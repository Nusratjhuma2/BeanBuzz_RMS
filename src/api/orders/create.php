<?php
session_start();
require_once '../../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['items']) || !is_array($input['items']) || empty($input['items'])) {
        echo json_encode(['success' => false, 'message' => 'Order items are required']);
        exit;
    }
    
    $customer_name = $input['customer_name'] ?? 'Guest Customer';
    $order_type = $input['order_type'] ?? 'dine_in';
    $special_instructions = $input['special_instructions'] ?? '';
    $subtotal = $input['subtotal'] ?? 0;
    $tax_amount = $input['tax_amount'] ?? 0;
    $total_amount = $input['total_amount'] ?? 0;
    $reservation_id = $input['reservation_id'] ?? null;
    $table_id = $input['table_id'] ?? null;
    
    // Validate dine-in orders require table reservation
    if ($order_type === 'dine_in' && !$table_id) {
        echo json_encode(['success' => false, 'message' => 'Table reservation is required for dine-in orders']);
        exit;
    }
    
    // Get customer ID if logged in
    $customer_id = null;
    if (isset($_SESSION['user_id']) && isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'customer') {
        $customer_id = $_SESSION['user_id'];
    }
    
    // Get database connection
    $database = new Database();
    $dbConn = $database->getConnection();
    
    // Begin transaction
    $dbConn->beginTransaction();
    
    try {
        // Calculate estimated completion time (15-25 minutes from now)
        $estimated_minutes = 15 + rand(0, 10);
        $estimated_completion = date('Y-m-d H:i:s', strtotime("+{$estimated_minutes} minutes"));
        
        // Create order
        $order_sql = "INSERT INTO orders (customer_id, customer_name, table_id, reservation_id, order_type, subtotal, tax_amount, total_amount, special_instructions, estimated_completion_time, status) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')";
        $order_stmt = $dbConn->prepare($order_sql);
        $order_stmt->execute([
            $customer_id,
            $customer_name,
            $table_id,
            $reservation_id,
            $order_type,
            $subtotal,
            $tax_amount,
            $total_amount,
            $special_instructions,
            $estimated_completion
        ]);
        
        $order_id = $dbConn->lastInsertId();
        
        // Add order items
        foreach ($input['items'] as $item) {
            if (!isset($item['id']) || !isset($item['quantity']) || !isset($item['price'])) {
                throw new Exception('Invalid item data');
            }
            
            $quantity = intval($item['quantity']);
            $unit_price = floatval($item['price']);
            $total_price = $unit_price * $quantity;
            
            $item_sql = "INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)";
            $item_stmt = $dbConn->prepare($item_sql);
            $item_stmt->execute([$order_id, $item['id'], $quantity, $unit_price, $total_price]);
        }
        
        // Commit transaction
        $dbConn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Order created successfully',
            'order_id' => $order_id,
            'estimated_completion' => $estimated_completion
        ]);
        
    } catch (Exception $e) {
        $dbConn->rollback();
        throw $e;
    }
    
} catch (Exception $e) {
    error_log("Create order error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to create order']);
}
?>