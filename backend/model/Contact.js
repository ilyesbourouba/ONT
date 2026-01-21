const db = require('../config/db');

class Contact {
  static async findAll(limit = 50, offset = 0) {
    const [rows] = await db.query(
      'SELECT * FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }

  static async count() {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM contacts');
    return rows[0].total;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM contacts WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { name, email, phone, subject, message } = data;
    
    const [result] = await db.query(
      `INSERT INTO contacts (name, email, phone, subject, message)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, subject, message]
    );
    
    return { id: result.insertId, ...data };
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM contacts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Contact;
