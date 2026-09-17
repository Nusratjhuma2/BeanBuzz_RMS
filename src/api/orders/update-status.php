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

// Check if user is logged in and has permission
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role'])) {
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

$user_role = $_SESSION['user_role'];
if (!in_array($user_role, ['waiter', 'chef', 'manager'])) {
    echo json_encode(['success' => false, 'message' => 'Insufficient permissions']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['order_id']) || !isset($input['status'])) {
        echo json_encode(['success' => false, 'message' => 'Order ID and status are required']);
        exit;
    }
    
    $order_id = $input['order_id'];
    $new_status = $input['status'];
    
    // Validate status
    $valid_statuses = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'];
    if (!in_array($new_status, $valid_statuses)) {
        echo json_encode(['success' => false, 'message' => 'Invalid status']);
        exit;
    }
    
    // Check if order exists
    $order_check = $db->query("SELECT status FROM orders WHERE id = ?", [$order_id])->fetch();
    if (!$order_check) {
        echo json_encode(['success' => false, 'message' => 'Order not found']);
        exit;
    }
    
    // Role-based permission checks
    $current_status = $order_check['status'];
    $allowed = false;
    
    switch ($user_role) {
        case 'manager':
            $allowed = true; // Managers can change any status
            break;
        case 'waiter':
            // Waiters can confirm orders and mark as served/completed
            $allowed = in_array($new_status, ['confirmed', 'served', 'completed']) ||
                      ($current_status === 'pending' && $new_status === 'confirmed') ||
                      ($current_status === 'ready' && $new_status === 'served') ||
                      ($current_status === 'served' && $new_status === 'completed');
            break;
        case 'chef':
            // Chefs can start preparing and mark as ready
            $allowed = ($current_status === 'confirmed' && $new_status === 'preparing') ||
                      ($current_status === 'preparing' && $new_status === 'ready');
            break;
    }
    
    if (!$allowed) {
        echo json_encode(['success' => false, 'message' => 'Not authorized to change to this status']);
        exit;
    }
    
    // Update order status
    $stmt = $db->query(
        "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?",
        [$new_status, $order_id]
    );
    
    if ($stmt) {
        // Log the status change if needed
        // You could add an order_status_history table here
        
        echo json_encode([
            'success' => true,
            'message' => 'Order status updated successfully',
            'order_id' => $order_id,
            'new_status' => $new_status
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update order status']);
    }
    
} catch (Exception $e) {
    error_log("Update order status error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred while updating order status']);
}
?>