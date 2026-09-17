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
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'], ['waiter', 'manager'])) {
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['order_id']) || !isset($input['payment_method'])) {
        echo json_encode(['success' => false, 'message' => 'Order ID and payment method are required']);
        exit;
    }
    
    $order_id = $input['order_id'];
    $payment_method = $input['payment_method'];
    $amount_received = floatval($input['amount_received'] ?? 0);
    $notes = trim($input['notes'] ?? '');
    $processed_by = $_SESSION['user_id'];
    
    // Validate payment method
    $valid_methods = ['cash', 'card', 'digital'];
    if (!in_array($payment_method, $valid_methods)) {
        echo json_encode(['success' => false, 'message' => 'Invalid payment method']);
        exit;
    }
    
    // Get order details
    $order_stmt = $db->query("SELECT * FROM orders WHERE id = ?", [$order_id]);
    $order = $order_stmt->fetch();
    
    if (!$order) {
        echo json_encode(['success' => false, 'message' => 'Order not found']);
        exit;
    }
    
    if ($order['payment_status'] === 'paid') {
        echo json_encode(['success' => false, 'message' => 'Order has already been paid']);
        exit;
    }
    
    // Validate amount for cash payments
    if ($payment_method === 'cash' && $amount_received < $order['total_amount']) {
        echo json_encode(['success' => false, 'message' => 'Insufficient amount received']);
        exit;
    }
    
    // For non-cash payments, set amount received to total amount
    if ($payment_method !== 'cash') {
        $amount_received = $order['total_amount'];
    }
    
    // Begin transaction
    $db->beginTransaction();
    
    try {
        // Update order payment status
        $update_order = $db->query("
            UPDATE orders 
            SET payment_status = 'paid', 
                payment_method = ?, 
                status = CASE WHEN status = 'served' THEN 'completed' ELSE status END,
                updated_at = NOW() 
            WHERE id = ?
        ", [$payment_method, $order_id]);
        
        if (!$update_order) {
            throw new Exception('Failed to update order payment status');
        }
        
        // Create payment record (you might want to add a payments table)
        // For now, we'll add a note to track the payment
        $payment_note = "Payment processed: {$payment_method}, Amount: $" . number_format($amount_received, 2);
        if ($notes) {
            $payment_note .= ", Notes: {$notes}";
        }
        $payment_note .= ", Processed by user ID: {$processed_by}";
        
        // You could create a payments table and insert a record here
        // For this example, we'll just update the order with payment info
        
        // If table was used, mark it as available
        if ($order['table_id']) {
            $db->query("UPDATE restaurant_tables SET status = 'available' WHERE id = ?", [$order['table_id']]);
        }
        
        // Commit transaction
        $db->commit();
        
        $change_due = $payment_method === 'cash' ? max(0, $amount_received - $order['total_amount']) : 0;
        
        echo json_encode([
            'success' => true,
            'message' => 'Payment processed successfully',
            'order_id' => $order_id,
            'payment_method' => $payment_method,
            'amount_received' => $amount_received,
            'total_amount' => $order['total_amount'],
            'change_due' => $change_due
        ]);
        
    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }
    
} catch (Exception $e) {
    error_log("Process payment error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to process payment: ' . $e->getMessage()]);
}
?>