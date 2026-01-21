-- ===========================================
-- ONT Backend Database Schema
-- MySQL Database for Tourism Website
-- ===========================================

-- Create database
CREATE DATABASE IF NOT EXISTS ont_db;
USE ont_db;

-- ===========================================
-- NEWS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS news (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title_en VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),
  excerpt_en TEXT,
  excerpt_ar TEXT,
  content_en TEXT,
  content_ar TEXT,
  category VARCHAR(50) DEFAULT 'Tourism',
  image VARCHAR(255),
  author VARCHAR(100),
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===========================================
-- ACTIVITIES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS activities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  description_en TEXT,
  description_ar TEXT,
  date VARCHAR(100),
  tags JSON,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- UNESCO SITES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS unesco_sites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  year_inscribed VARCHAR(50),
  image VARCHAR(255),
  description_en TEXT,
  description_ar TEXT
);

-- ===========================================
-- DESTINATIONS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS destinations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  image VARCHAR(255),
  description_en TEXT,
  description_ar TEXT
);

-- ===========================================
-- CONTACTS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- VIRTUAL TOURS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS virtual_tours (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tour_id VARCHAR(10) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),
  description_en TEXT,
  description_ar TEXT,
  tags JSON,
  image VARCHAR(255),
  cta_en VARCHAR(100),
  cta_ar VARCHAR(100)
);

-- ===========================================
-- SEED DATA - News
-- ===========================================
INSERT INTO news (title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar, category, image, author, likes) VALUES
('ONT Launches New Strategic Roadmap for 2025', 'الديوان يطلق خارطة الطريق الاستراتيجية الجديدة لعام 2025', 'Aligning with national goals, the ONT introduces a comprehensive bridge to sustainable tourism growth.', 'تماشياً مع الأهداف الوطنية، يقدم الديوان جسراً شاملاً لنمو السياحة المستدامة.', 'The National Tourism Office (ONT) has officially unveiled its strategic roadmap for 2025. This ambitious plan focuses on digital transformation, sustainable site management, and international marketing partnerships.', 'كشف الديوان الوطني للسياحة (ONT) رسمياً عن خارطة طريقه الاستراتيجية لعام 2025.', 'Institutional', '/images/destinations/great-mosque.jpg', 'ONT Communications', 25),
('Algeria Featured as Top Emerging Destination', 'الجزائر تبرز كأفضل وجهة ناشئة', 'International travel experts highlight Algeria as the must-visit spot.', 'يسلط خبراء السفر الدوليون الضوء على الجزائر.', 'Global tourism observers have ranked Algeria among the top 10 emerging destinations for 2025.', 'صنف مراقبون دوليون للسياحة الجزائر ضمن أفضل 10 وجهات ناشئة لعام 2025.', 'Tourism', '/images/destinations/constantine.jpg', 'Travel Desk', 58),
('Sbiba Festival: A Celebration of Tassili Culture', 'عيد السبيبة: احتفال بثقافة الطاسيلي', 'The annual cultural celebration in Djanet brings thousands.', 'الاحتفال الثقافي السنوي في جانت يجذب الآلاف.', 'Djanet hosted the historic Sbiba festival, showcasing the vibrant traditions of the Tassili region.', 'استضافت جانت عيد السبيبة التاريخي.', 'Events', '/images/destinations/fantasia.jpg', 'Culture Dept', 75);

-- ===========================================
-- SEED DATA - Activities
-- ===========================================
INSERT INTO activities (name_en, name_ar, description_en, description_ar, date, tags, image) VALUES
('Sahara Desert Festival', 'مهرجان الصحراء', 'Experience the magic of the Sahara with traditional Tuareg music and camel races.', 'اختبر سحر الصحراء الكبرى مع الموسيقى التارقية التقليدية.', 'March 15-20, 2025', '["Festival", "Culture"]', 'https://images.unsplash.com/photo-1575664274476-e02d99195164'),
('Timgad International Festival', 'المهرجان الدولي لتيمقاد', 'Join the renowned music festival at the ancient Roman ruins of Timgad.', 'انضم إلى المهرجان الموسيقي الشهير في الأطلال الرومانية.', 'July 10-18, 2025', '["Music", "Heritage"]', 'https://images.unsplash.com/photo-1549145177-238518f1ec1a'),
('Mediterranean Coastal Tour', 'جولة الساحل المتوسطي', 'Discover Algeria stunning 1,200km coastline with pristine beaches.', 'اكتشف الساحل الجزائري الخلاب.', 'May 1 - September 30, 2025', '["Beach", "Nature"]', 'https://images.unsplash.com/photo-1642088995585-e97a4af093ef');

-- ===========================================
-- SEED DATA - UNESCO Sites
-- ===========================================
INSERT INTO unesco_sites (name_en, name_ar, year_inscribed, image, description_en, description_ar) VALUES
('Tipasa', 'تيبازة', 'Inscribed 1982', '/images/destinations/coastal-city.jpg', 'Ancient Phoenician and Roman ruins by the sea.', 'آثار فينيقية ورومانية قديمة على شاطئ البحر.'),
('Djémila', 'جميلة', 'Inscribed 1982', '/images/destinations/constantine.jpg', 'One of the most beautiful Roman ruins in North Africa.', 'واحدة من أجمل الآثار الرومانية في شمال إفريقيا.'),
('Timgad', 'تيمقاد', 'Inscribed 1982', '/images/destinations/constantine.jpg', 'A Roman colonial city founded by Emperor Trajan.', 'مدينة رومانية أسسها الإمبراطور تراجان.'),
('M''Zab Valley', 'وادي ميزاب', 'Inscribed 1982', '/images/destinations/fantasia.jpg', 'A masterpiece of medieval Islamic urban planning.', 'تحفة من التخطيط الحضري الإسلامي.'),
('Tassili n''Ajjer', 'طاسيلي ناجر', 'Inscribed 1982', '/images/destinations/fantasia.jpg', 'Prehistoric rock art and unique landscape.', 'فن صخري ما قبل التاريخ ومناظر طبيعية فريدة.'),
('Casbah of Algiers', 'قصبة الجزائر', 'Inscribed 1992', '/images/destinations/great-mosque.jpg', 'A unique kind of medina or Islamic city.', 'نوع فريد من المدينة الإسلامية.'),
('Béni Hammad Fort', 'قلعة بني حماد', 'Inscribed 1980', '/images/destinations/fantasia.jpg', 'Ruins of the first capital of the Hammadid dynasty.', 'أطلال العاصمة الأولى للدولة الحمادية.');

-- ===========================================
-- SEED DATA - Destinations
-- ===========================================
INSERT INTO destinations (name_en, name_ar, image, description_en, description_ar) VALUES
('Coastal Beauty', 'جمال الساحل', '/images/destinations/coastal-city.jpg', 'Beautiful Mediterranean coastline.', 'الساحل المتوسطي الجميل.'),
('Traditional Fantasia', 'الفانتازيا التقليدية', '/images/destinations/fantasia.jpg', 'Traditional equestrian shows.', 'عروض الفروسية التقليدية.'),
('Constantine Bridges', 'جسور قسنطينة', '/images/destinations/constantine.jpg', 'The city of hanging bridges.', 'مدينة الجسور المعلقة.'),
('Great Mosque of Algiers', 'جامع الجزائر الأعظم', '/images/destinations/great-mosque.jpg', 'Africa largest mosque.', 'أكبر مسجد في إفريقيا.');

-- ===========================================
-- SEED DATA - Virtual Tours
-- ===========================================
INSERT INTO virtual_tours (tour_id, title_en, title_ar, description_en, description_ar, tags, image, cta_en, cta_ar) VALUES
('01', 'Ghardaïa: The M''zab Valley', 'غرداية: وادي ميزاب', 'Explore the fortified cities of the M''zab valley.', 'استكشف المدن المحصنة في وادي ميزاب.', '["UNESCO", "Architecture", "360° View"]', '/images/destinations/fantasia.jpg', 'Enter Virtual Tour', 'دخول الجولة الافتراضية'),
('02', 'Timgad: The Roman Outpost', 'تيمقاد: المعقل الروماني', 'Step back into 100 AD with the Roman colonial city.', 'عد بالزمن إلى عام 100 ميلادي.', '["History", "Ruins", "Interactive"]', '/images/destinations/constantine.jpg', 'Enter Virtual Tour', 'دخول الجولة الافتراضية'),
('03', 'The Casbah of Algiers', 'قصبة الجزائر', 'A unique kind of medina or Islamic city.', 'نوع فريد من المدن الإسلامية.', '["Culture", "Labyrinth", "Audio Guide"]', '/images/destinations/great-mosque.jpg', 'Enter Virtual Tour', 'دخول الجولة الافتراضية');
