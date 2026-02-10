const db = require('../config/db');

class UnescoSite {
  // ==============================
  // SITES CRUD
  // ==============================
  
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM unesco_sites ORDER BY id ASC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM unesco_sites WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { name_en, name_ar, year_inscribed, image, description_en, description_ar } = data;
    
    const [result] = await db.query(
      `INSERT INTO unesco_sites (name_en, name_ar, year_inscribed, image, description_en, description_ar)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name_en, name_ar, year_inscribed, image, description_en, description_ar]
    );
    
    return { id: result.insertId, ...data };
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });
    
    if (fields.length === 0) return null;
    
    values.push(id);
    await db.query(`UPDATE unesco_sites SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM unesco_sites WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // ==============================
  // SECTION CONTENT
  // ==============================
  
  static async getContent() {
    const [rows] = await db.query('SELECT * FROM unesco_content WHERE id = 1');
    return rows[0];
  }

  static async updateContent(data) {
    const fields = [];
    const values = [];
    
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });
    
    if (fields.length === 0) return null;
    
    await db.query(`UPDATE unesco_content SET ${fields.join(', ')} WHERE id = 1`, values);
    return this.getContent();
  }

  // ==============================
  // GET ALL (for frontend)
  // ==============================
  
  static async getAll() {
    const content = await this.getContent();
    const sites = await this.findAll();
    return { content, sites };
  }
}

module.exports = UnescoSite;

