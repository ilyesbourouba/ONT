const db = require('../config/db');

class UnescoSite {
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
}

module.exports = UnescoSite;
