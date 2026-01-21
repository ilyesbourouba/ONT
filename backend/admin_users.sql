-- ===========================================
-- ADMIN USERS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor') DEFAULT 'editor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Default admin user (password: admin123)
-- Password hash generated with bcrypt
INSERT INTO admin_users (username, email, password, role) VALUES
('admin', 'admin@ont.dz', '$2b$10$rOC8qWRkL8jXwU8qJXYQZO5kfGQ3R5XzQCZJ5kO9cY8qmQxCvMsOy', 'admin');
