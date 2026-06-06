CREATE DATABASE IF NOT EXISTS bh_store;
USE bh_store;


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);


CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    specs JSON NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    old_price DECIMAL(10,2),
    sub_category VARCHAR(100),
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_brand (brand)
);


CREATE TABLE IF NOT EXISTS commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    items JSON NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'En attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);


INSERT INTO products (name, brand, category, specs, price, old_price, sub_category, image) VALUES
('Redmi 15C', 'Xiaomi', 'phones', '["128GB","4GB RAM"]', 399, NULL, 'xiaomi', './Redmi15C.png'),
('Samsung Galaxy A17', 'Samsung', 'phones', '["128GB","6GB RAM"]', 580, NULL, 'samsung', './SamsungA17.png'),
('Samsung Galaxy A07', 'Samsung', 'phones', '["64GB","4GB RAM"]', 420, 480, 'samsung', './SamsungA07.png'),
('Redmi Note 14', 'Xiaomi', 'phones', '["256GB","8GB RAM"]', 720, NULL, 'xiaomi', './RedmiNote14.png'),
('iPhone 16 Plus', 'Apple', 'phones', '["256GB"]', 3200, NULL, 'iphone', './Iphone16Plus.png'),
('iPhone 13', 'Apple', 'phones', '["128GB"]', 1550, 1800, 'iphone', './Iphone13.png'),
('iPhone 14', 'Apple', 'phones', '["128GB"]', 1950, 2200, 'iphone', './Iphone14.png'),
('AirPods Max', 'Apple', 'audio', '["Bluetooth","ANC"]', 1200, NULL, NULL, './AirpodsMax.png'),
('AirPods Max Argent', 'Apple', 'audio', '["Bluetooth","Silver"]', 1200, NULL, NULL, './AirpodsArgent.png'),
('AirPods Max Bleu', 'Apple', 'audio', '["Bluetooth","Blue"]', 1200, NULL, NULL, './AirpodsBleu.png'),
('Chargeur GaN', 'Baseus', 'acc', '["65W","USB-C"]', 28, 35, 'chargeur', './GanChargeur.png'),
('Protection écran', 'Spigen', 'acc', '["Verre trempé"]', 6, NULL, 'protection', './Protection.png'),
('Écran iPhone 13', 'OEM', 'parts', '["OLED"]', 85, NULL, NULL, './Ecraniphone13.png'),
('Batterie Samsung', 'OEM', 'parts', '["Original"]', 42, NULL, NULL, './Batteriesamsung.png'),
('Connecteur', 'OEM', 'parts', '["Charge"]', 18, NULL, NULL, './Connecteur.png');
