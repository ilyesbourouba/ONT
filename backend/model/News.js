const db = require('../config/db');

class News {
  /**
   * Get all news articles
   */
  static async findAll(limit = 10, offset = 0) {
    const [rows] = await db.query(
      'SELECT * FROM news ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }

  /**
   * Get total count
   */
  static async count() {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM news');
    return rows[0].total;
  }

  /**
   * Get single article by ID
   */
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM news WHERE id = ?', [id]);
    return rows[0];
  }

  /**
   * Get articles by category
   */
  static async findByCategory(category, limit = 10, offset = 0) {
    const [rows] = await db.query(
      'SELECT * FROM news WHERE category = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [category, limit, offset]
    );
    return rows;
  }

  /**
   * Create new article
   */
  static async create(data) {
    const { title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar, category, image, author } = data;
    
    const [result] = await db.query(
      `INSERT INTO news (title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar, category, image, author)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar, category, image, author]
    );
    
    return { id: result.insertId, ...data };
  }

  /**
   * Update article
   */
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
    
    await db.query(
      `UPDATE news SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  /**
   * Delete article
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM news WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  /**
   * Increment likes
   */
  static async incrementLikes(id) {
    await db.query('UPDATE news SET likes = likes + 1 WHERE id = ?', [id]);
    return this.findById(id);
  }
}

module.exports = News;
