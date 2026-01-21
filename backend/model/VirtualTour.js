const db = require('../config/db');

class VirtualTour {
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM virtual_tours ORDER BY tour_id ASC');
    return rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : []
    }));
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM virtual_tours WHERE id = ?', [id]);
    if (rows[0]) {
      rows[0].tags = rows[0].tags ? JSON.parse(rows[0].tags) : [];
    }
    return rows[0];
  }

  static async create(data) {
    const { tour_id, title_en, title_ar, description_en, description_ar, tags, image, cta_en, cta_ar } = data;
    
    const [result] = await db.query(
      `INSERT INTO virtual_tours (tour_id, title_en, title_ar, description_en, description_ar, tags, image, cta_en, cta_ar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tour_id, title_en, title_ar, description_en, description_ar, JSON.stringify(tags || []), image, cta_en, cta_ar]
    );
    
    return { id: result.insertId, ...data };
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(key === 'tags' ? JSON.stringify(data[key]) : data[key]);
      }
    });
    
    if (fields.length === 0) return null;
    
    values.push(id);
    await db.query(`UPDATE virtual_tours SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM virtual_tours WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = VirtualTour;
