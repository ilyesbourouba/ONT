/**
 * Seed Visit Algeria section content with proper UTF-8 encoding
 * Also creates destinations_content table for Destinations section text
 * Run: node seedVisitAlgeria.js
 */

const pool = require('./config/db');

const seedData = async () => {
  console.log('🌱 Seeding Visit Algeria and Destinations content...');
  
  try {
    // Create visit_algeria_content table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visit_algeria_content (
        id INT PRIMARY KEY DEFAULT 1,
        badge_en VARCHAR(100),
        badge_ar VARCHAR(100),
        headline_en VARCHAR(255),
        headline_ar VARCHAR(255),
        description_en TEXT,
        description_ar TEXT,
        explore_btn_en VARCHAR(100),
        explore_btn_ar VARCHAR(100),
        banner_text_en VARCHAR(255),
        banner_text_ar VARCHAR(255),
        banner_image VARCHAR(500),
        youtube_video_id VARCHAR(50),
        destinations_title_en VARCHAR(255),
        destinations_title_ar VARCHAR(255),
        destinations_subtitle_en VARCHAR(255),
        destinations_subtitle_ar VARCHAR(255),
        cta_en VARCHAR(100),
        cta_ar VARCHAR(100),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);
    console.log('✅ visit_algeria_content table created');

    // Clear and seed content
    await pool.query('DELETE FROM visit_algeria_content WHERE id = 1');
    
    await pool.query(`
      INSERT INTO visit_algeria_content (id, badge_en, badge_ar, headline_en, headline_ar, description_en, description_ar, 
        explore_btn_en, explore_btn_ar, banner_text_en, banner_text_ar, banner_image, youtube_video_id,
        destinations_title_en, destinations_title_ar, destinations_subtitle_en, destinations_subtitle_ar, cta_en, cta_ar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      1,
      'VISIT Algeria',
      'زيارة الجزائر',
      'Unforgettable journeys await you.',
      'رحلات لا تُنسى في انتظارك.',
      'From the golden dunes of the Sahara to ancient Roman ruins and pristine Mediterranean beaches. Experience a land where history, culture, and natural beauty converge.',
      'من الكثبان الذهبية للصحراء إلى الآثار الرومانية القديمة والشواطئ المتوسطية النقية. عش تجربة أرض يلتقي فيها التاريخ والثقافة والجمال الطبيعي.',
      'Visit Algeria',
      'زيارة الجزائر',
      'Where ancient history meets breathtaking landscapes',
      'حيث يلتقي التاريخ العريق بالمناظر الطبيعية الخلابة',
      'https://images.unsplash.com/photo-1575664274476-e02d99195164?q=80&w=1931&auto=format&fit=crop',
      'fkIWNBiVTi8',
      'Amazing destinations',
      'وجهات مذهلة',
      'Explore the hidden gems of North Africa.',
      'اكتشف الجواهر المخفية في شمال أفريقيا.',
      'View All Destinations',
      'عرض جميع الوجهات'
    ]);
    
    console.log('✅ Visit Algeria content seeded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
