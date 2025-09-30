import { UserType, ProjectType } from '@/shared/types';

export class Database {
  constructor(private db: D1Database) {}

  // User methods
  async createUser(name: string, email: string, passwordHash: string, role: 'ngo' | 'admin' | 'buyer'): Promise<number> {
    const result = await this.db.prepare(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
    ).bind(name, email, passwordHash, role).run();
    
    return result.meta.last_row_id as number;
  }

  async getUserByEmail(email: string): Promise<UserType | null> {
    const result = await this.db.prepare(
      'SELECT id, name, email, role, created_at FROM users WHERE email = ?'
    ).bind(email).first();
    
    return result as UserType | null;
  }

  async getUserById(id: number): Promise<UserType | null> {
    const result = await this.db.prepare(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?'
    ).bind(id).first();
    
    return result as UserType | null;
  }

  async getUserPasswordHash(email: string): Promise<string | null> {
    const result = await this.db.prepare(
      'SELECT password_hash FROM users WHERE email = ?'
    ).bind(email).first();
    
    return result?.password_hash as string | null;
  }

  // Project methods
  async createProject(ngoId: number, name: string, landSize: number, location: string, description?: string): Promise<number> {
    const result = await this.db.prepare(
      'INSERT INTO projects (ngo_id, name, land_size, location, description) VALUES (?, ?, ?, ?, ?)'
    ).bind(ngoId, name, landSize, location, description || null).run();
    
    return result.meta.last_row_id as number;
  }

  async getProjectsByNGO(ngoId: number): Promise<ProjectType[]> {
    const result = await this.db.prepare(
      'SELECT * FROM projects WHERE ngo_id = ? ORDER BY created_at DESC'
    ).bind(ngoId).all();
    
    return result.results as ProjectType[];
  }

  async getAllProjects(): Promise<ProjectType[]> {
    const result = await this.db.prepare(
      'SELECT * FROM projects ORDER BY created_at DESC'
    ).all();
    
    return result.results as ProjectType[];
  }

  async getVerifiedProjects(): Promise<ProjectType[]> {
    const result = await this.db.prepare(
      'SELECT * FROM projects WHERE status = "verified" ORDER BY created_at DESC'
    ).all();
    
    return result.results as ProjectType[];
  }

  async getProjectById(id: number): Promise<ProjectType | null> {
    const result = await this.db.prepare(
      'SELECT * FROM projects WHERE id = ?'
    ).bind(id).first();
    
    return result as ProjectType | null;
  }

  async updateProjectStatus(id: number, status: 'verified' | 'rejected'): Promise<boolean> {
    const result = await this.db.prepare(
      'UPDATE projects SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(status, id).run();
    
    return result.success;
  }

  async updateProject(id: number, updates: { status?: string; price_per_credit?: number; total_credits?: number }): Promise<boolean> {
    const fields = [];
    const values = [];
    
    if (updates.status) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.price_per_credit) {
      fields.push('price_per_credit = ?');
      values.push(updates.price_per_credit);
    }
    if (updates.total_credits) {
      fields.push('total_credits = ?');
      values.push(updates.total_credits);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await this.db.prepare(
      `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run();
    
    return result.success;
  }

  // Photo methods
  async addProjectPhoto(projectId: number, filename: string, url: string): Promise<number> {
    const result = await this.db.prepare(
      'INSERT INTO project_photos (project_id, filename, url) VALUES (?, ?, ?)'
    ).bind(projectId, filename, url).run();
    
    return result.meta.last_row_id as number;
  }

  async getProjectPhotos(projectId: number): Promise<any[]> {
    const result = await this.db.prepare(
      'SELECT * FROM project_photos WHERE project_id = ? ORDER BY created_at DESC'
    ).bind(projectId).all();
    
    return result.results;
  }

  // Transaction methods
  async createTransaction(
    id: string,
    buyerId: number,
    projectId: number,
    creditsPurchased: number,
    totalAmount: number,
    certificateId: string
  ): Promise<boolean> {
    const result = await this.db.prepare(
      'INSERT INTO transactions (id, buyer_id, project_id, credits_purchased, total_amount, certificate_id) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(id, buyerId, projectId, creditsPurchased, totalAmount, certificateId).run();
    
    return result.success;
  }

  async getTransactionsByBuyer(buyerId: number): Promise<any[]> {
    const result = await this.db.prepare(`
      SELECT t.*, p.name as project_name, p.location, u.name as ngo_name
      FROM transactions t
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON p.ngo_id = u.id
      WHERE t.buyer_id = ?
      ORDER BY t.created_at DESC
    `).bind(buyerId).all();
    
    return result.results;
  }

  async getTransactionById(id: string): Promise<any | null> {
    const result = await this.db.prepare(`
      SELECT t.*, p.name as project_name, p.location, p.land_size, u.name as ngo_name, b.name as buyer_name
      FROM transactions t
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON p.ngo_id = u.id
      JOIN users b ON t.buyer_id = b.id
      WHERE t.id = ?
    `).bind(id).first();
    
    return result;
  }
}
