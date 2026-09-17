-- BeanBuzz Restaurant Management System Database Schema

CREATE DATABASE IF NOT EXISTS beanbuzz_rms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE beanbuzz_rms;

-- Users table (staff and customers)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'waiter', 'chef', 'manager') NOT NULL DEFAULT 'customer',
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Menu categories
CREATE TABLE menu_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu items
CREATE TABLE menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    preparation_time INT DEFAULT 15, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE SET NULL
);

-- Tables for restaurant
CREATE TABLE restaurant_tables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_number VARCHAR(10) UNIQUE NOT NULL,
    capacity INT NOT NULL DEFAULT 4,
    status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations
CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    table_id INT,
    party_size INT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'seated', 'completed', 'cancelled') DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE SET NULL
);

-- Orders
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    customer_name VARCHAR(100) NOT NULL,
    table_id INT NOT NULL, -- Make required since table reservation is mandatory
    reservation_id INT, -- Link to reservation
    waiter_id INT,
    order_type ENUM('dine_in', 'takeout', 'delivery') DEFAULT 'dine_in',
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled') DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    special_instructions TEXT,
    estimated_completion_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL,
    FOREIGN KEY (waiter_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order items
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    special_instructions TEXT,
    status ENUM('ordered', 'preparing', 'ready', 'served') DEFAULT 'ordered',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Inventory items
CREATE TABLE inventory_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    unit VARCHAR(20) NOT NULL, -- kg, liter, pieces, etc.
    current_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
    minimum_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
    maximum_stock DECIMAL(10, 2) NOT NULL DEFAULT 0,
    unit_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
    supplier VARCHAR(100),
    last_restocked TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inventory transactions
CREATE TABLE inventory_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inventory_item_id INT NOT NULL,
    transaction_type ENUM('in', 'out', 'adjustment') NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    reason VARCHAR(255),
    reference_id INT, -- could reference order_id for usage tracking
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Staff attendance
CREATE TABLE staff_attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    clock_in TIMESTAMP NULL,
    clock_out TIMESTAMP NULL,
    break_start TIMESTAMP NULL,
    break_end TIMESTAMP NULL,
    total_hours DECIMAL(4, 2) DEFAULT 0,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'on_leave') DEFAULT 'present',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Staff salaries
CREATE TABLE staff_salaries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    base_salary DECIMAL(10, 2) NOT NULL,
    hourly_rate DECIMAL(8, 2),
    bonus DECIMAL(10, 2) DEFAULT 0,
    deductions DECIMAL(10, 2) DEFAULT 0,
    total_salary DECIMAL(10, 2) NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    payment_date DATE,
    status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User sessions for web authentication
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default data

-- Insert menu categories
INSERT INTO menu_categories (name, description, display_order) VALUES
('Coffee & Beverages', 'Premium coffee and refreshing beverages', 1),
('Breakfast', 'Fresh breakfast options to start your day', 2),
('Lunch', 'Delicious lunch meals and light bites', 3),
('Pastries & Desserts', 'Sweet treats and freshly baked goods', 4);

-- Insert sample menu items
INSERT INTO menu_items (category_id, name, description, price, preparation_time) VALUES
-- Coffee & Beverages
(1, 'BeanBuzz Signature Latte', 'Our house blend with steamed milk, vanilla syrup, and a touch of cinnamon', 4.50, 5),
(1, 'Cappuccino', 'Rich espresso with steamed milk foam', 3.75, 5),
(1, 'Americano', 'Bold espresso with hot water', 3.25, 3),
(1, 'Iced Coffee', 'Cold brew coffee served over ice', 3.50, 3),
(1, 'Green Tea Latte', 'Smooth green tea with steamed milk', 4.25, 5),

-- Breakfast
(2, 'Artisan Avocado Toast', 'Fresh avocado, cherry tomatoes, and microgreens on sourdough bread', 8.95, 10),
(2, 'Classic Eggs Benedict', 'Poached eggs, ham, and hollandaise sauce on English muffin', 12.95, 15),
(2, 'Breakfast Burrito', 'Scrambled eggs, bacon, cheese, and vegetables wrapped in tortilla', 9.50, 12),
(2, 'French Toast', 'Thick-cut brioche with maple syrup and fresh berries', 10.50, 12),
(2, 'Granola Bowl', 'House-made granola with yogurt and seasonal fruits', 7.95, 5),

-- Lunch
(3, 'Truffle Mushroom Pasta', 'Handmade pasta with wild mushrooms, truffle oil, and parmesan cheese', 12.95, 18),
(3, 'Grilled Chicken Salad', 'Mixed greens, grilled chicken, cherry tomatoes, and balsamic vinaigrette', 11.50, 15),
(3, 'BeanBuzz Burger', 'Angus beef patty with lettuce, tomato, onion, and special sauce', 13.95, 20),
(3, 'Quinoa Power Bowl', 'Quinoa, roasted vegetables, chickpeas, and tahini dressing', 10.95, 12),
(3, 'Fish Tacos', 'Grilled fish with cabbage slaw and lime crema on corn tortillas', 11.95, 15),

-- Pastries & Desserts
(4, 'Chocolate Croissant', 'Buttery croissant filled with dark chocolate', 3.95, 3),
(4, 'Blueberry Muffin', 'Fresh blueberries in a tender, moist muffin', 2.95, 2),
(4, 'Tiramisu', 'Classic Italian dessert with coffee-soaked ladyfingers', 6.95, 5),
(4, 'Cheesecake Slice', 'New York style cheesecake with berry compote', 5.95, 3),
(4, 'Chocolate Chip Cookie', 'Warm, freshly baked cookie', 1.95, 2);

-- Insert sample restaurant tables
INSERT INTO restaurant_tables (table_number, capacity) VALUES
('T01', 2), ('T02', 2), ('T03', 4), ('T04', 4), ('T05', 4),
('T06', 6), ('T07', 6), ('T08', 8), ('T09', 2), ('T10', 4);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@beanbuzz.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager');

-- Insert sample staff users
INSERT INTO users (name, email, password, role) VALUES
('John Waiter', 'waiter@beanbuzz.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'waiter'),
('Jane Chef', 'chef@beanbuzz.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'chef');

-- Insert sample inventory items
INSERT INTO inventory_items (name, unit, current_stock, minimum_stock, unit_cost, supplier) VALUES
('Coffee Beans - House Blend', 'kg', 50.0, 10.0, 25.00, 'Premium Coffee Suppliers'),
('Milk', 'liter', 30.0, 5.0, 3.50, 'Local Dairy Farm'),
('Bread - Sourdough', 'loaves', 20, 5, 4.50, 'Artisan Bakery'),
('Avocados', 'pieces', 50, 10, 1.25, 'Fresh Produce Co.'),
('Chicken Breast', 'kg', 15.0, 3.0, 12.00, 'Quality Meats'),
('Pasta', 'kg', 25.0, 5.0, 3.75, 'Italian Foods Import'),
('Cheese - Parmesan', 'kg', 5.0, 1.0, 35.00, 'Gourmet Cheese Shop'),
('Eggs', 'dozen', 10, 2, 4.50, 'Local Farm'),
('Flour', 'kg', 40.0, 10.0, 2.25, 'Baking Supplies Co.'),
('Sugar', 'kg', 20.0, 5.0, 1.85, 'Sweetener Suppliers');