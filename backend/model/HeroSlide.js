const db = require('../config/db');

class HeroSlide {
  /**
   * Get all hero slides ordered by display_order
   */
  static async findAll() {
    const [rows] = await db.query(
      'SELECT * FROM hero_slides ORDER BY display_order ASC, created_at DESC'
    );
    return rows;
  }

  /**
   * Get only active slides (for frontend)
   */
  static async findActive() {
    const [rows] = await db.query(
      'SELECT * FROM hero_slides WHERE is_active = TRUE ORDER BY display_order ASC'
    );
    return rows;
  }

  /**
   * Get total count
   */
  static async count() {
    const [rows] = await db.query('SELECT COUNT(*) as total FROM hero_slides');
    return rows[0].total;
  }

  /**
   * Get single slide by ID
   */
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM hero_slides WHERE id = ?', [id]);
    return rows[0];
  }

  /**
   * Create new slide
   */
  static async create(data) {
    const { 
      headline_en, headline_ar, subtitle_en, subtitle_ar,
      button_text_en, button_text_ar, button_link, image,
      display_order = 0, is_active = true 
    } = data;
    
    const [result] = await db.query(
      `INSERT INTO hero_slides (headline_en, headline_ar, subtitle_en, subtitle_ar,
       button_text_en, button_text_ar, button_link, image, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [headline_en, headline_ar, subtitle_en, subtitle_ar,
       button_text_en, button_text_ar, button_link, image, display_order, is_active]
    );
    
    return { id: result.insertId, ...data };
  }

  /**
   * Update slide
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
      `UPDATE hero_slides SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }

  /**
   * Delete slide
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM hero_slides WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = HeroSlide;
