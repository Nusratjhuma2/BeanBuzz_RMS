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
if (!isset($_SESSION['user_id']) || !in_array($_SESSION['user_role'], ['chef', 'manager'])) {
    echo json_encode(['success' => false, 'message' => 'Authentication required']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['item_id']) || !isset($input['transaction_type']) || !isset($input['quantity']) || !isset($input['reason'])) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
    
    $item_id = $input['item_id'];
    $transaction_type = $input['transaction_type'];
    $quantity = floatval($input['quantity']);
    $reason = trim($input['reason']);
    $user_id = $_SESSION['user_id'];
    
    // Validate transaction type
    if (!in_array($transaction_type, ['in', 'out', 'adjustment'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid transaction type']);
        exit;
    }
    
    if ($quantity <= 0) {
        echo json_encode(['success' => false, 'message' => 'Quantity must be greater than 0']);
        exit;
    }
    
    // Get database connection
    $database = new Database();
    $dbConn = $database->getConnection();
    
    // Get current inventory item
    $item_stmt = $dbConn->prepare("SELECT * FROM inventory_items WHERE id = ?");
    $item_stmt->execute([$item_id]);
    $item = $item_stmt->fetch();
    
    if (!$item) {
        echo json_encode(['success' => false, 'message' => 'Inventory item not found']);
        exit;
    }
    
    $current_stock = floatval($item['current_stock']);
    $new_stock = $current_stock;
    
    // Calculate new stock based on transaction type
    switch ($transaction_type) {
        case 'in':
            $new_stock = $current_stock + $quantity;
            break;
        case 'out':
            $new_stock = $current_stock - $quantity;
            if ($new_stock < 0) {
                echo json_encode(['success' => false, 'message' => 'Cannot reduce stock below zero']);
                exit;
            }
            break;
        case 'adjustment':
            // For adjustments, the quantity represents the new total stock
            $new_stock = $quantity;
            $quantity = $new_stock - $current_stock; // Calculate the actual change
            break;
    }
    
    // Begin transaction
    $dbConn->beginTransaction();
    
    try {
        // Update inventory item stock
        $update_stmt = $dbConn->prepare("UPDATE inventory_items SET current_stock = ?, last_restocked = NOW() WHERE id = ?");
        $update_result = $update_stmt->execute([$new_stock, $item_id]);
        
        if (!$update_result) {
            throw new Exception('Failed to update inventory item');
        }
        
        // Record transaction
        $transaction_stmt = $dbConn->prepare("INSERT INTO inventory_transactions (inventory_item_id, transaction_type, quantity, reason, user_id) VALUES (?, ?, ?, ?, ?)");
        $transaction_result = $transaction_stmt->execute([$item_id, $transaction_type, abs($quantity), $reason, $user_id]);
        
        if (!$transaction_result) {
            throw new Exception('Failed to record transaction');
        }
        
        // Commit transaction
        $dbConn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Stock updated successfully',
            'item_id' => $item_id,
            'old_stock' => $current_stock,
            'new_stock' => $new_stock,
            'change' => $quantity
        ]);
        
    } catch (Exception $e) {
        $dbConn->rollback();
        throw $e;
    }
    
} catch (Exception $e) {
    error_log("Update stock error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to update stock: ' . $e->getMessage()]);
}
?>