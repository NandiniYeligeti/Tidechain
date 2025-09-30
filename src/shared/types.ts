import z from "zod";

// User related schemas
export const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ngo', 'buyer'])
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['ngo', 'admin', 'buyer']),
  created_at: z.string()
});

// Project related schemas
export const CreateProjectSchema = z.object({
  name: z.string().min(1),
  land_size: z.number().positive(),
  location: z.string().min(1),
  description: z.string().optional()
});

export const ProjectSchema = z.object({
  id: z.number(),
  ngo_id: z.number(),
  name: z.string(),
  land_size: z.number(),
  location: z.string(),
  description: z.string().nullable(),
  status: z.enum(['pending', 'verified', 'rejected']),
  price_per_credit: z.number().default(25),
  total_credits: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string()
});

export const UpdateProjectSchema = z.object({
  status: z.enum(['verified', 'rejected']).optional(),
  price_per_credit: z.number().positive().optional(),
  total_credits: z.number().positive().optional()
});

// Transaction related schemas
export const CreateTransactionSchema = z.object({
  project_id: z.number(),
  credits_purchased: z.number().positive()
});

export const TransactionSchema = z.object({
  id: z.string(),
  buyer_id: z.number(),
  project_id: z.number(),
  credits_purchased: z.number(),
  price_per_credit: z.number(),
  total_amount: z.number(),
  certificate_id: z.string(),
  created_at: z.string()
});

// Carbon calculator schemas
export const CarbonCalculatorSchema = z.object({
  electricity: z.number().min(0).optional().default(0), // kWh
  fuel: z.number().min(0).optional().default(0), // liters
  flight_km: z.number().min(0).optional().default(0), // km
  car_km: z.number().min(0).optional().default(0), // km
  waste: z.number().min(0).optional().default(0) // tons
});

// Type exports
export type RegisterType = z.infer<typeof RegisterSchema>;
export type LoginType = z.infer<typeof LoginSchema>;
export type UserType = z.infer<typeof UserSchema>;
export type CreateProjectType = z.infer<typeof CreateProjectSchema>;
export type ProjectType = z.infer<typeof ProjectSchema>;
export type UpdateProjectType = z.infer<typeof UpdateProjectSchema>;
export type CreateTransactionType = z.infer<typeof CreateTransactionSchema>;
export type TransactionType = z.infer<typeof TransactionSchema>;
export type CarbonCalculatorType = z.infer<typeof CarbonCalculatorSchema>;

// JWT Payload
export interface JWTPayload {
  userId: number;
  email: string;
  role: 'ngo' | 'admin' | 'buyer';
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CarbonCalculationResult {
  electricity_emissions: number;
  fuel_emissions: number;
  flight_emissions: number;
  car_emissions: number;
  waste_emissions: number;
  total_emissions: number;
  suggested_credits: number;
}
