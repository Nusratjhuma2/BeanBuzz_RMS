-- BeanBuzz Restaurant Management System Sample Data

USE beanbuzz_rms;

-- Insert sample tables
INSERT INTO restaurant_tables (table_number, capacity, status) VALUES
('1', 2, 'available'),
('2', 4, 'available'),
('3', 4, 'available'),
('4', 6, 'available'),
('5', 2, 'available'),
('6', 4, 'available'),
('7', 6, 'available'),
('8', 8, 'available'),
('9', 2, 'available'),
('10', 4, 'available'),
('11', 6, 'available'),
('12', 8, 'available');

-- Insert sample users
INSERT INTO users (name, email, password, role, phone) VALUES
('Guest Customer', 'guest@beanbuzz.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '555-0001'),
('John Waiter', 'waiter@beanbuzz.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'waiter', '555-0002'),
('Sarah Chef', 'chef@beanbuzz.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'chef', '555-0003'),
('Mike Manager', 'manager@beanbuzz.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', '555-0004'),
('Alice Customer', 'alice@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '555-0005');

-- Insert sample menu categories
INSERT INTO menu_categories (name, description, display_order) VALUES
('Coffee', 'Premium coffee beverages made from carefully selected beans', 1),
('Tea', 'Fine teas from around the world', 2),
('Pastries', 'Fresh baked goods and sweet treats', 3),
('Breakfast', 'Hearty breakfast options to start your day', 4),
('Lunch', 'Satisfying lunch selections', 5),
('Desserts', 'Delicious desserts and treats', 6);

-- Insert sample menu items
INSERT INTO menu_items (category_id, name, description, price, is_available, preparation_time) VALUES
-- Coffee
(1, 'Espresso', 'Rich and bold single shot of espresso', 2.50, 1, 3),
(1, 'Americano', 'Espresso with hot water for a smooth coffee experience', 3.00, 1, 5),
(1, 'Cappuccino', 'Espresso with steamed milk and foam', 4.25, 1, 7),
(1, 'Latte', 'Espresso with steamed milk and light foam', 4.75, 1, 8),
(1, 'Mocha', 'Espresso with chocolate syrup and steamed milk', 5.25, 1, 10),

-- Tea
(2, 'Earl Grey', 'Classic bergamot-infused black tea', 3.25, 1, 5),
(2, 'Green Tea', 'Delicate and refreshing green tea', 3.00, 1, 5),
(2, 'Chamomile', 'Soothing herbal tea perfect for relaxation', 3.50, 1, 7),

-- Pastries
(3, 'Croissant', 'Buttery, flaky French pastry', 3.75, 1, 2),
(3, 'Blueberry Muffin', 'Fresh baked muffin with juicy blueberries', 4.25, 1, 3),
(3, 'Chocolate Chip Cookie', 'Warm, chewy cookie with chocolate chips', 2.75, 1, 2),

-- Breakfast
(4, 'Avocado Toast', 'Multigrain toast topped with fresh avocado', 8.95, 1, 12),
(4, 'Breakfast Sandwich', 'Egg, cheese, and bacon on toasted English muffin', 7.50, 1, 15),
(4, 'Greek Yogurt Bowl', 'Creamy yogurt with granola and fresh berries', 6.75, 1, 5),

-- Lunch
(5, 'Grilled Chicken Salad', 'Fresh greens with grilled chicken and vinaigrette', 12.95, 1, 18),
(5, 'Turkey Club Sandwich', 'Triple-decker sandwich with turkey, bacon, and veggies', 11.50, 1, 15),
(5, 'Vegetarian Wrap', 'Fresh vegetables and hummus in a spinach tortilla', 9.75, 1, 12),

-- Desserts
(6, 'Cheesecake', 'Rich and creamy New York style cheesecake', 6.95, 1, 3),
(6, 'Chocolate Brownie', 'Fudgy brownie with nuts', 4.50, 1, 2),
(6, 'Tiramisu', 'Classic Italian coffee dessert', 7.25, 1, 5);

-- Insert sample reservations
INSERT INTO reservations (customer_name, customer_email, customer_phone, table_id, party_size, reservation_date, reservation_time, status, special_requests) VALUES
('Alice Johnson', 'alice@example.com', '555-0101', 2, 2, CURDATE(), '12:00:00', 'confirmed', 'Window seat if possible'),
('Bob Smith', 'bob@example.com', '555-0102', 4, 4, CURDATE(), '13:30:00', 'confirmed', 'Birthday celebration'),
('Carol Davis', 'carol@example.com', '555-0103', 6, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', 'pending', 'Quiet area preferred'),
('David Wilson', 'david@example.com', '555-0104', 8, 6, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '19:00:00', 'confirmed', 'Business meeting'),
('Emily Brown', 'emily@example.com', '555-0105', 3, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', 'pending', '');

-- Insert sample inventory items
INSERT INTO inventory_items (name, description, unit, current_stock, minimum_stock, maximum_stock, unit_cost, supplier) VALUES
('Coffee Beans - Colombian', 'Premium Colombian Arabica coffee beans', 'kg', 45.5, 10.0, 100.0, 12.50, 'Premium Coffee Suppliers'),
('Coffee Beans - Ethiopian', 'Single origin Ethiopian coffee beans', 'kg', 32.0, 8.0, 80.0, 15.75, 'Premium Coffee Suppliers'),
('Milk - Whole', 'Fresh whole milk for beverages', 'liter', 120.0, 30.0, 200.0, 1.25, 'Local Dairy Co'),
('Milk - Oat', 'Organic oat milk alternative', 'liter', 25.0, 10.0, 50.0, 2.85, 'Organic Foods Ltd'),
('Sugar - White', 'Granulated white sugar', 'kg', 18.5, 5.0, 50.0, 0.85, 'Food Supplies Inc'),
('Flour - All Purpose', 'All-purpose baking flour', 'kg', 65.0, 15.0, 100.0, 1.15, 'Bakery Supplies Co'),
('Eggs - Large', 'Fresh large eggs', 'dozen', 24, 6, 48, 3.25, 'Local Farms'),
('Butter - Unsalted', 'Premium unsalted butter', 'kg', 12.5, 3.0, 25.0, 4.75, 'Dairy Products Ltd'),
('Chocolate Chips', 'Semi-sweet chocolate chips', 'kg', 8.2, 2.0, 20.0, 6.50, 'Confectionery Supply'),
('Blueberries - Fresh', 'Fresh organic blueberries', 'kg', 5.5, 2.0, 15.0, 8.95, 'Fresh Fruit Co'),
('Avocados', 'Ripe Hass avocados', 'pieces', 36, 12, 60, 1.25, 'Produce Distributors'),
('Bread - Multigrain', 'Artisan multigrain bread loaves', 'loaves', 18, 5, 30, 3.50, 'Artisan Bakery');

-- Insert some sample orders
INSERT INTO orders (customer_id, customer_name, table_id, reservation_id, order_type, subtotal, tax_amount, total_amount, status, special_instructions, estimated_completion_time) VALUES
(1, 'Alice Customer', 2, 1, 'dine_in', 12.50, 1.06, 13.56, 'preparing', 'Extra hot please', DATE_ADD(NOW(), INTERVAL 20 MINUTE)),
(5, 'Alice Johnson', 4, 2, 'dine_in', 24.75, 2.10, 26.85, 'pending', 'Birthday dessert with candle', DATE_ADD(NOW(), INTERVAL 25 MINUTE));

-- Insert sample order items
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price, special_instructions) VALUES
-- Order 1 items
(1, 4, 1, 4.75, 4.75, 'Extra hot'),
(1, 12, 1, 7.75, 7.75, ''),

-- Order 2 items  
(2, 3, 2, 4.25, 8.50, ''),
(2, 14, 1, 12.95, 12.95, 'Dressing on the side'),
(2, 17, 1, 6.95, 6.95, 'With birthday candle');

-- Update table status for reserved tables
UPDATE restaurant_tables SET status = 'reserved' WHERE id IN (SELECT table_id FROM reservations WHERE status = 'confirmed' AND reservation_date = CURDATE());