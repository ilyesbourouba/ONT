const db = require('../config/db');

class About {
  // ==============================
  // MAIN CONTENT
  // ==============================
  
  /**
   * Get main about content (single row)
   */
  static async getContent() {
    const [rows] = await db.query('SELECT * FROM about_content WHERE id = 1');
    return rows[0];
  }

  /**
   * Update main about content
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
    
    await db.query(
      `UPDATE about_content SET ${fields.join(', ')} WHERE id = 1`,
      values
    );
    
    return this.getContent();
  }

  // ==============================
  // MISSIONS
  // ==============================
  
  static async getMissions() {
    const [rows] = await db.query('SELECT * FROM about_missions ORDER BY display_order');
    return rows;
  }

  static async getMissionById(id) {
    const [rows] = await db.query('SELECT * FROM about_missions WHERE id = ?', [id]);
    return rows[0];
  }

  static async createMission(data) {
    const { mission_en, mission_ar, display_order = 0 } = data;
    const [result] = await db.query(
      'INSERT INTO about_missions (mission_en, mission_ar, display_order) VALUES (?, ?, ?)',
      [mission_en, mission_ar, display_order]
    );
    return { id: result.insertId, ...data };
  }

  static async updateMission(id, data) {
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
    
    await db.query(`UPDATE about_missions SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.getMissionById(id);
  }

  static async deleteMission(id) {
    const [result] = await db.query('DELETE FROM about_missions WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // ==============================
  // STATS
  // ==============================
  
  static async getStats(type = null) {
    let query = 'SELECT * FROM about_stats';
    const params = [];
    
    if (type) {
      query += ' WHERE stat_type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY display_order';
    const [rows] = await db.query(query, params);
    return rows;
  }

  static async getStatById(id) {
    const [rows] = await db.query('SELECT * FROM about_stats WHERE id = ?', [id]);
    return rows[0];
  }

  static async createStat(data) {
    const { value_en, value_ar, label_en, label_ar, stat_type = 'landing', display_order = 0 } = data;
    const [result] = await db.query(
      'INSERT INTO about_stats (value_en, value_ar, label_en, label_ar, stat_type, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [value_en, value_ar, label_en, label_ar, stat_type, display_order]
    );
    return { id: result.insertId, ...data };
  }

  static async updateStat(id, data) {
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
    
    await db.query(`UPDATE about_stats SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.getStatById(id);
  }

  static async deleteStat(id) {
    const [result] = await db.query('DELETE FROM about_stats WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // ==============================
  // PILLARS
  // ==============================
  
  static async getPillars() {
    const [rows] = await db.query('SELECT * FROM about_pillars ORDER BY display_order');
    return rows;
  }

  static async getPillarById(id) {
    const [rows] = await db.query('SELECT * FROM about_pillars WHERE id = ?', [id]);
    return rows[0];
  }

  static async createPillar(data) {
    const { label_en, label_ar, title_en, title_ar, description_en, description_ar, display_order = 0 } = data;
    const [result] = await db.query(
      'INSERT INTO about_pillars (label_en, label_ar, title_en, title_ar, description_en, description_ar, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [label_en, label_ar, title_en, title_ar, description_en, description_ar, display_order]
    );
    return { id: result.insertId, ...data };
  }

  static async updatePillar(id, data) {
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
    
    await db.query(`UPDATE about_pillars SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.getPillarById(id);
  }

  static async deletePillar(id) {
    const [result] = await db.query('DELETE FROM about_pillars WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // ==============================
  // FAQS
  // ==============================
  
  static async getFaqs() {
    const [rows] = await db.query('SELECT * FROM about_faqs ORDER BY display_order');
    return rows;
  }

  static async getFaqById(id) {
    const [rows] = await db.query('SELECT * FROM about_faqs WHERE id = ?', [id]);
    return rows[0];
  }

  static async createFaq(data) {
    const { question_en, question_ar, answer_en, answer_ar, display_order = 0 } = data;
    const [result] = await db.query(
      'INSERT INTO about_faqs (question_en, question_ar, answer_en, answer_ar, display_order) VALUES (?, ?, ?, ?, ?)',
      [question_en, question_ar, answer_en, answer_ar, display_order]
    );
    return { id: result.insertId, ...data };
  }

  static async updateFaq(id, data) {
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
    
    await db.query(`UPDATE about_faqs SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.getFaqById(id);
  }

  static async deleteFaq(id) {
    const [result] = await db.query('DELETE FROM about_faqs WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // ==============================
  // GET ALL (for frontend)
  // ==============================
  
  static async getAll() {
    const [content] = await db.query('SELECT * FROM about_content WHERE id = 1');
    const [missions] = await db.query('SELECT * FROM about_missions ORDER BY display_order');
    const [landingStats] = await db.query("SELECT * FROM about_stats WHERE stat_type = 'landing' ORDER BY display_order");
    const [pageStats] = await db.query("SELECT * FROM about_stats WHERE stat_type = 'page' ORDER BY display_order");
    const [pillars] = await db.query('SELECT * FROM about_pillars ORDER BY display_order');
    const [faqs] = await db.query('SELECT * FROM about_faqs ORDER BY display_order');
    
    return {
      content: content[0] || {},
      missions,
      landingStats,
      pageStats,
      pillars,
      faqs
    };
  }
}

module.exports = About;
