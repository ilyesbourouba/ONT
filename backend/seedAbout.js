/**
 * Seed About data with proper UTF-8 encoding
 * Run: node seedAbout.js
 */

const pool = require('./config/db');

const seedData = async () => {
  console.log('🌱 Seeding About data...');
  
  try {
    // Clear existing data
    await pool.query('TRUNCATE about_missions');
    await pool.query('TRUNCATE about_stats');
    await pool.query('TRUNCATE about_pillars');
    await pool.query('TRUNCATE about_faqs');
    await pool.query('DELETE FROM about_content WHERE id = 1');
    
    // Seed main content
    await pool.query(`
      INSERT INTO about_content (id, tagline_en, tagline_ar, headline_en, headline_ar, description_en, description_ar, 
        hero_title_en, hero_title_ar, hero_sub_en, hero_sub_ar, page_headline_en, page_headline_ar, 
        page_description1_en, page_description1_ar, page_description2_en, page_description2_ar, 
        pillars_title_en, pillars_title_ar, faq_title_en, faq_title_ar, faq_sub_en, faq_sub_ar, 
        cta_en, cta_ar, image1, image2) 
      VALUES (1, 
        'National Tourism Office', 'الديوان الوطني للسياحة',
        'Who is the National Tourism Office?', 'من هو الديوان الوطني للسياحة؟',
        'The ONT is the official government organ of Algeria responsible for steering the national tourism strategy through several key pillars:', 
        'الديوان الوطني للسياحة هو الهيئة الحكومية الرسمية في الجزائر المسؤولة عن توجيه استراتيجية السياحة الوطنية من خلال عدة ركائز أساسية:',
        'About - O.N.T Algeria', 'عن الديوان الوطني للسياحة',
        'WHO WE ARE', 'من نحن',
        "The Guardian of Algeria's Tourism Heritage", 'حارس التراث السياحي الجزائري',
        'The National Tourism Office (ONT) is a public administrative institution endowed with legal personality and financial autonomy. Established by Executive Decree No. 92-402 in 1992, it operates under the tutelage of the Ministry of Tourism and Handicrafts.',
        'الديوان الوطني للسياحة (ONT) هو مؤسسة عمومية ذات طابع إداري تتمتع بالشخصية المعنوية والاستقلال المالي. تم إنشاؤه بموجب المرسوم التنفيذي رقم 92-402 في عام 1992، ويخضع لوصاية وزارة السياحة والصناعة التقليدية.',
        'We are dedicated to placing Algeria on the global tourism map through innovative promotion and strategic marketing.',
        'نحن مكرسون لوضع الجزائر على الخارطة السياحية العالمية من خلال الترويج المبتكر والتسويق الاستراتيجي.',
        'Our Strategic Core', 'جوهرنا الاستراتيجي',
        'Frequently Asked Questions', 'الأسئلة الشائعة',
        'BASIC INFORMATION', 'معلومات أساسية',
        'Learn more about ONT', 'تعرف أكثر على الديوان',
        '/assets/about-card-1.png', '/assets/about-card-2.jpg'
      )
    `);
    console.log('✅ Content seeded');

    // Seed missions
    const missions = [
      ['Promotion of National Tourism', 'ترقية السياحة الوطنية', 1],
      ['Sustainable Tourism Development', 'تطوير السياحة المستدامة', 2],
      ['Official Statistics & Data Analysis', 'الإحصائيات والبيانات الرسمية', 3],
      ['International Strategic Partnerships', 'الشراكات الاستراتيجية الدولية', 4],
      ['Professional Tourism Training', 'التكوين والتدريب المهني', 5],
    ];
    for (const m of missions) {
      await pool.query('INSERT INTO about_missions (mission_en, mission_ar, display_order) VALUES (?, ?, ?)', m);
    }
    console.log('✅ Missions seeded');

    // Seed stats (landing)
    const landingStats = [
      ['250K+', '+250 ألف', 'Annual Visitors', 'زائر سنوياً', 'landing', 1],
      ['75', '75', 'Countries Represented', 'دولة ممثلة', 'landing', 2],
      ['$45M', '45 مليون دولار', 'Annual Revenue', 'الإيرادات السنوية', 'landing', 3],
    ];
    for (const s of landingStats) {
      await pool.query('INSERT INTO about_stats (value_en, value_ar, label_en, label_ar, stat_type, display_order) VALUES (?, ?, ?, ?, ?, ?)', s);
    }

    // Seed stats (page)
    const pageStats = [
      ['1992', '1992', 'Founded', 'تأسس في', 'page', 1],
      ['04', '04', 'Core Pillars', 'مهام رئيسية', 'page', 2],
      ['100+', '100+', 'Global Partners', 'شركاء دوليون', 'page', 3],
    ];
    for (const s of pageStats) {
      await pool.query('INSERT INTO about_stats (value_en, value_ar, label_en, label_ar, stat_type, display_order) VALUES (?, ?, ?, ?, ?, ?)', s);
    }
    console.log('✅ Stats seeded');

    // Seed pillars
    const pillars = [
      ['Promotion', 'الترويج', 'Tourism Promotion', 'الترويج السياحي', 
       'Designing and implementing national tourism promotion programs, producing high-premium promotional materials like catalogs, guides, and digital platforms.',
       'تصميم وتنفيذ برامج الترويج السياحي الوطني، وإنتاج مواد ترويجية فاخرة مثل الكتالوجات والأدلة والمنصات الرقمية.', 1],
      ['Marketing', 'التسويق', 'Tourism Marketing', 'التسويق السياحي',
       'Representing Algeria in international tourism fairs and exhibitions, organizing media days, and building international partnerships.',
       'تمثيل الجزائر في المعارض السياحية الدولية، وتنظيم الأيام الإعلامية، وبناء شراكات دولية.', 2],
      ['Research', 'البحوث', 'Studies & Research', 'الدراسات والبحوث',
       'Conducting market research on tourism trends, analyzing statistical data, and preparing sector development reports.',
       'إجراء بحوث السوق حول الاتجاهات السياحية، وتحليل البيانات الإحصائية، وإعداد تقارير تطوير القطاع.', 3],
      ['Training', 'التكوين', 'Qualification', 'التأهيل والتكوين',
       'Organizing training workshops for industry professionals, developing vocational skills, and promoting tourism awareness.',
       'تنظيم ورش عمل تدريبية لمحترفي الصناعة، وتطوير المهارات المهنية، ونشر الوعي السياحي.', 4],
    ];
    for (const p of pillars) {
      await pool.query('INSERT INTO about_pillars (label_en, label_ar, title_en, title_ar, description_en, description_ar, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)', p);
    }
    console.log('✅ Pillars seeded');

    // Seed FAQs
    const faqs = [
      ['What is the legal status of the National Tourism Office (ONT)?', 'ما هو الوضع القانوني للديوان الوطني للسياحة (ONT)؟',
       'The ONT is a public administrative institution (EPA) endowed with legal personality and financial autonomy, operating under the tutelage of the Ministry of Tourism and Handicrafts.',
       'الديوان الوطني للسياحة هو مؤسسة عمومية ذات طابع إداري (EPA) تتمتع بالشخصية المعنوية والاستقلال المالي، وتخضع لوصاية وزارة السياحة والصناعة التقليدية.', 1],
      ['When was the ONT officially established?', 'متى تم تأسيس الديوان رسمياً؟',
       'It was created by Executive Decree No. 92-402 on October 13, 1992, to centralize and enhance national tourism promotion efforts.',
       'تم إنشاؤه بموجب المرسوم التنفيذي رقم 92-420 المؤرخ في 13 أكتوبر 1992، لمركزية وتعزيز جهود الترويج السياحي الوطني.', 2],
      ['What are the primary institutional goals of the office?', 'ما هي الأهداف المؤسساتية الرئيسية للديوان؟',
       "Our main goals are to improve Algeria's image as a destination, increase tourism flows, develop the local tourism product, and contribute to sustainable development within the sector.",
       'أهدافنا الرئيسية هي تحسين صورة الجزائر كوجهة سياحية، زيادة التدفقات السياحية، تطوير المنتج السياحي المحلي، والمساهمة في التنمية المستدامة للقطاع.', 3],
      ['Does the ONT provide training for tourism professionals?', 'هل يقدم الديوان تدريبات للمهنيين في قطاع السياحة؟',
       'Yes, one of our core missions is the development of vocational skills and organizing training cycles to upgrade the qualifications of personnel within the tourism industry.',
       'نعم، من مهامنا الأساسية تطوير المهارات المهنية وتنظيم دورات تدريبية لرفع كفاءة العاملين في صناعة السياحة.', 4],
    ];
    for (const f of faqs) {
      await pool.query('INSERT INTO about_faqs (question_en, question_ar, answer_en, answer_ar, display_order) VALUES (?, ?, ?, ?, ?)', f);
    }
    console.log('✅ FAQs seeded');

    console.log('✅ All About data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
