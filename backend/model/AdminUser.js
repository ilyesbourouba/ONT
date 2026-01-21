const db = require('../config/db');
const bcrypt = require('bcryptjs');

class AdminUser {
  static async findByUsername(username) {
    const [rows] = await db.query('SELECT * FROM admin_users WHERE username = ?', [username]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM admin_users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT id, username, email, role, created_at FROM admin_users WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { username, email, password, role = 'editor' } = data;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const [result] = await db.query(
      `INSERT INTO admin_users (username, email, password, role) VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, role]
    );
    
    return { id: result.insertId, username, email, role };
  }

  static async comparePassword(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }

  static async updatePassword(id, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await db.query('UPDATE admin_users SET password = ? WHERE id = ?', [hashedPassword, id]);
    return true;
  }
}

module.exports = AdminUser;
