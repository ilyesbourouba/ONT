const db = require('../config/db');

class VisitAlgeria {
  /**
   * Get Visit Algeria section content
   */
  static async getContent() {
    const [rows] = await db.query('SELECT * FROM visit_algeria_content WHERE id = 1');
    return rows[0];
  }

  /**
   * Update Visit Algeria section content
   */
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
    
    await db.query(`UPDATE visit_algeria_content SET ${fields.join(', ')} WHERE id = 1`, values);
    return this.getContent();
  }
}

module.exports = VisitAlgeria;
