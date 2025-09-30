import { Hono } from "hono";
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { 
  RegisterSchema, 
  LoginSchema, 
  CreateProjectSchema, 
  UpdateProjectSchema,
  CreateTransactionSchema,
  CarbonCalculatorSchema,
  JWTPayload,
  ApiResponse,
  CarbonCalculationResult
} from '@/shared/types';
import { Database } from './database';
import { signJWT, ensureAuth, ensureNGO, ensureAdmin, ensureBuyer } from './middleware';

const app = new Hono<{ Bindings: Env; Variables: { user: JWTPayload } }>();

// CORS middleware
app.use('*', cors({
  origin: ['http://localhost:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string): string {
  return btoa(password); // Simple base64 encoding - use bcrypt in production
}

function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Authentication routes
app.post('/api/auth/register', zValidator('json', RegisterSchema), async (c) => {
  try {
    const { name, email, password, role } = c.req.valid('json');
    const db = new Database(c.env.DB);

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return c.json<ApiResponse>({ success: false, error: 'User already exists' }, 400);
    }

    // Hash password and create user
    const passwordHash = hashPassword(password);
    const userId = await db.createUser(name, email, passwordHash, role);

    // Generate JWT
    const payload: JWTPayload = { userId, email, role };
    const token = signJWT(payload);

    return c.json<ApiResponse>({
      success: true,
      data: { token, user: { id: userId, name, email, role } }
    });
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Registration failed' }, 500);
  }
});

app.post('/api/auth/login', zValidator('json', LoginSchema), async (c) => {
  try {
    const { email, password } = c.req.valid('json');
    const db = new Database(c.env.DB);

    // Get user and password hash
    const user = await db.getUserByEmail(email);
    const passwordHash = await db.getUserPasswordHash(email);

    if (!user || !passwordHash || !verifyPassword(password, passwordHash)) {
      return c.json<ApiResponse>({ success: false, error: 'Invalid credentials' }, 401);
    }

    // Generate JWT
    const payload: JWTPayload = { userId: user.id, email: user.email, role: user.role };
    const token = signJWT(payload);

    return c.json<ApiResponse>({
      success: true,
      data: { token, user }
    });
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Login failed' }, 500);
  }
});

// Project routes (NGO)
app.post('/api/projects', ensureAuth, ensureNGO, zValidator('json', CreateProjectSchema), async (c) => {
  try {
    const { name, land_size, location, description } = c.req.valid('json');
    const user = c.get('user');
    const db = new Database(c.env.DB);

    const projectId = await db.createProject(user.userId, name, land_size, location, description);

    return c.json<ApiResponse>({
      success: true,
      data: { id: projectId }
    });
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Failed to create project' }, 500);
  }
});

app.get('/api/projects/my', ensureAuth, ensureNGO, async (c) => {
  try {
    const user = c.get('user');
    const db = new Database(c.env.DB);

    const projects = await db.getProjectsByNGO(user.userId);

    return c.json<ApiResponse>({
      success: true,
      data: projects
    });
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Failed to fetch projects' }, 500);
  }
});

// Admin routes
app.get('/api/admin/projects', ensureAuth, ensureAdmin, async (c) => {
  try {
    const db = new Database(c.env.DB);
    const projects = await db.getAllProjects();

    return c.json<ApiResponse>({
      success: true,
      data: projects
    });
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Failed to fetch projects' }, 500);
  }
});

app.put('/api/admin/projects/:id/status', ensureAuth, ensureAdmin, zValidator('json', UpdateProjectSchema), async (c) => {
  try {
    const projectId = parseInt(c.req.param('id'));
    const updates = c.req.valid('json');
    const db = new Database(c.env.DB);

    const success = await db.updateProject(projectId, updates);

    if (!success) {
      return c.json<ApiResponse>({ success: false, error: 'Project not found' }, 404);
    }

    return c.json<ApiResponse>({
      success: true,
      data: { message: 'Project updated successfully' }
    });
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Failed to update project' }, 500);
  }
});

// Buyer routes
app.get('/api/projects/verified', ensureAuth, ensureBuyer, async (c) => {
  try {
    const db = new Database(c.env.DB);
    const projects = await db.getVerifiedProjects();

    return c.json<ApiResponse>({
      success: true,
      data: projects
    });
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Failed to fetch projects' }, 500);
  }
});

app.post('/api/transactions', ensureAuth, ensureBuyer, zValidator('json', CreateTransactionSchema), async (c) => {
  try {
    const { project_id, credits_purchased } = c.req.valid('json');
    const user = c.get('user');
    const db = new Database(c.env.DB);

    // Verify project exists and is verified
    const project = await db.getProjectById(project_id);
    if (!project || project.status !== 'verified') {
      return c.json<ApiResponse>({ success: false, error: 'Project not found or not verified' }, 404);
    }

    // Calculate total amount (assuming $25 per credit)
    const pricePerCredit = 25;
    const totalAmount = credits_purchased * pricePerCredit;

    // Generate IDs
    const transactionId = generateUUID();
    const certificateId = generateUUID();

    // Create transaction
    const success = await db.createTransaction(
      transactionId,
      user.userId,
      project_id,
      credits_purchased,
      totalAmount,
      certificateId
    );

    if (!success) {
      return c.json<ApiResponse>({ success: false, error: 'Failed to create transaction' }, 500);
    }

    return c.json<ApiResponse>({
      success: true,
      data: { 
        transactionId, 
        certificateId, 
        totalAmount,
        message: 'Transaction completed successfully' 
      }
    });
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Transaction failed' }, 500);
  }
});

app.get('/api/transactions/my', ensureAuth, ensureBuyer, async (c) => {
  try {
    const user = c.get('user');
    const db = new Database(c.env.DB);

    const transactions = await db.getTransactionsByBuyer(user.userId);

    return c.json<ApiResponse>({
      success: true,
      data: transactions
    });
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Failed to fetch transactions' }, 500);
  }
});

app.get('/api/transactions/:id/certificate', async (c) => {
  try {
    const transactionId = c.req.param('id');
    const db = new Database(c.env.DB);

    const transaction = await db.getTransactionById(transactionId);
    if (!transaction) {
      return c.json<ApiResponse>({ success: false, error: 'Transaction not found' }, 404);
    }

    // Generate certificate HTML
    const certificateHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f8f9fa; }
        .certificate { background: white; padding: 60px; border: 8px solid #059669; border-radius: 20px; max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .title { color: #059669; font-size: 36px; font-weight: bold; margin-bottom: 10px; }
        .subtitle { color: #6B7280; font-size: 18px; }
        .content { margin: 40px 0; }
        .field { margin: 15px 0; font-size: 16px; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #059669; font-weight: bold; }
        .signature { margin-top: 60px; text-align: center; }
        .signature-line { border-top: 2px solid #059669; width: 300px; margin: 20px auto 10px; }
        .date { text-align: right; margin-top: 40px; color: #6B7280; }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <div class="title">TideChain</div>
            <div class="subtitle">Certificate of Carbon Credit Purchase</div>
        </div>
        
        <div class="content">
            <div class="field">
                <span class="label">Certificate ID:</span> 
                <span class="value">${transaction.certificate_id}</span>
            </div>
            <div class="field">
                <span class="label">Project Name:</span> 
                <span class="value">${transaction.project_name}</span>
            </div>
            <div class="field">
                <span class="label">Land Size:</span> 
                <span class="value">${transaction.land_size} acres</span>
            </div>
            <div class="field">
                <span class="label">Location:</span> 
                <span class="value">${transaction.location}</span>
            </div>
            <div class="field">
                <span class="label">Buyer Name:</span> 
                <span class="value">${transaction.buyer_name}</span>
            </div>
            <div class="field">
                <span class="label">Credits Purchased:</span> 
                <span class="value">${transaction.credits_purchased} tons CO₂</span>
            </div>
            <div class="field">
                <span class="label">Purchase Date:</span> 
                <span class="value">${new Date(transaction.created_at).toLocaleDateString()}</span>
            </div>
        </div>
        
        <div class="signature">
            <div class="signature-line"></div>
            <div>Certified by TideChain Admin</div>
        </div>
        
        <div class="date">
            Generated on ${new Date().toLocaleDateString()}
        </div>
    </div>
</body>
</html>
    `;

    return c.html(certificateHtml);
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Failed to generate certificate' }, 500);
  }
});

// Carbon calculator
app.post('/api/calculator/emissions', zValidator('json', CarbonCalculatorSchema), async (c) => {
  try {
    const { electricity, fuel, flight_km, car_km, waste } = c.req.valid('json');

    // Emission factors (kg CO₂)
    const factors = {
      electricity: 0.92, // kg CO₂ per kWh
      fuel: 2.68, // kg CO₂ per liter (diesel)
      flight: 0.255, // kg CO₂ per km
      car: 0.21, // kg CO₂ per km
      waste: 1000 // kg CO₂ per ton
    };

    const emissions = {
      electricity_emissions: (electricity || 0) * factors.electricity,
      fuel_emissions: (fuel || 0) * factors.fuel,
      flight_emissions: (flight_km || 0) * factors.flight,
      car_emissions: (car_km || 0) * factors.car,
      waste_emissions: (waste || 0) * factors.waste
    };

    const total_emissions = Object.values(emissions).reduce((sum, value) => sum + value, 0);
    const total_emissions_tons = total_emissions / 1000; // Convert to tons
    const suggested_credits = Math.ceil(total_emissions_tons);

    const result: CarbonCalculationResult = {
      ...emissions,
      total_emissions: total_emissions_tons,
      suggested_credits
    };

    return c.json<ApiResponse>({
      success: true,
      data: result
    });
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Calculation failed' }, 500);
  }
});

// Create default admin user if not exists
app.get('/api/admin/setup', async (c) => {
  try {
    const db = new Database(c.env.DB);
    
    // Check if admin exists
    const adminUser = await db.getUserByEmail('admin@tidechain.com');
    if (adminUser) {
      return c.json<ApiResponse>({ 
        success: true, 
        data: { message: 'Admin user already exists' } 
      });
    }

    // Create admin user
    const passwordHash = hashPassword('admin123');
    await db.createUser('TideChain Admin', 'admin@tidechain.com', passwordHash, 'admin');

    return c.json<ApiResponse>({
      success: true,
      data: { 
        message: 'Admin user created',
        credentials: {
          email: 'admin@tidechain.com',
          password: 'admin123'
        }
      }
    });
  } catch (error) {
    return c.json<ApiResponse>({ success: false, error: 'Setup failed' }, 500);
  }
});

export default app;
