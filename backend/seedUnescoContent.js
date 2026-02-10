/**
 * Seed UNESCO content with proper UTF-8 encoding
 * Run: node seedUnescoContent.js
 */

const pool = require('./config/db');

const seedData = async () => {
  console.log('🌱 Seeding UNESCO content...');
  
  try {
    // Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS unesco_content (
        id INT PRIMARY KEY DEFAULT 1,
        badge_en VARCHAR(100),
        badge_ar VARCHAR(100),
        headline_en VARCHAR(255),
        headline_ar VARCHAR(255),
        description_en TEXT,
        description_ar TEXT,
        cta_explore_en VARCHAR(100),
        cta_explore_ar VARCHAR(100),
        cta_learn_en VARCHAR(100),
        cta_learn_ar VARCHAR(100),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);
    console.log('✅ Table created/verified');

    // Clear and seed content
    await pool.query('DELETE FROM unesco_content WHERE id = 1');
    
    await pool.query(`
      INSERT INTO unesco_content (id, badge_en, badge_ar, headline_en, headline_ar, description_en, description_ar, cta_explore_en, cta_explore_ar, cta_learn_en, cta_learn_ar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      1,
      'UNESCO World Heritage',
      'التراث العالمي لليونسكو',
      "Discover Algeria's UNESCO World Heritage Sites",
      'اكتشف مواقع التراث العالمي في الجزائر',
      'Algeria is home to seven exceptional sites recognized by UNESCO for their outstanding universal value. From ancient Roman ruins to prehistoric rock art, these treasures represent millennia of human history and natural wonders.',
      'تضم الجزائر سبعة مواقع استثنائية معترف بها من قبل اليونسكو لقيمتها العالمية المتميزة. من الآثار الرومانية القديمة إلى الفن الصخري ما قبل التاريخ، تمثل هذه الكنوز آلاف السنين من التاريخ البشري والعجائب الطبيعية.',
      'Explore Heritage Sites',
      'استكشف مواقع التراث',
      'View All Sites',
      'عرض جميع المواقع'
    ]);
    
    console.log('✅ UNESCO content seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
