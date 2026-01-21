const db = require('../config/db');

class Activity {
  static async findAll(limit = 10, offset = 0) {
    const [rows] = await db.query(
      'SELECT * FROM activities ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : []
    }));
  }

  static async count() {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM activities');
    return rows[0].total;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM activities WHERE id = ?', [id]);
    if (rows[0]) {
      rows[0].tags = rows[0].tags ? JSON.parse(rows[0].tags) : [];
    }
    return rows[0];
  }

  static async create(data) {
    const { name_en, name_ar, description_en, description_ar, date, tags, image } = data;
    
    const [result] = await db.query(
      `INSERT INTO activities (name_en, name_ar, description_en, description_ar, date, tags, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name_en, name_ar, description_en, description_ar, date, JSON.stringify(tags || []), image]
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
    
    await db.query(`UPDATE activities SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM activities WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Activity;
