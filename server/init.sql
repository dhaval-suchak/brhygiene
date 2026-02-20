CREATE DATABASE IF NOT EXISTS br_hygiene;
USE br_hygiene;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    features JSON,
    usage_text TEXT,
    image_path VARCHAR(255),
    badge VARCHAR(50),
    category VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial sample data matching user images
INSERT INTO products (name, description, features, usage_text, image_path, badge, category) VALUES 
('Aloe Vera & Cucumber Wipe', 'Infused with natural aloe and cooling cucumber for deep hydration and sensitive skin care.', '["Alcohol Free", "Skin Friendly", "Moisturizing"]', 'Ideal for face, neck, and hands anytime you need a refreshing cleanse.', '/images/alovera mockup.jpeg', 'Alcohol Free', 'Refreshing'),
('Lemon Wipe', 'Zesty lemon scent provides an instant burst of energy while effectively cleansing skin.', '["Citrus Freshness", "pH Balanced", "Individually Sealed"]', 'Perfect for post-meal cleanup or quick refreshment during travel.', '/images/sample lemon.png', 'pH Balanced', 'Citrus');
