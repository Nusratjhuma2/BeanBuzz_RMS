<?php
require_once '../../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $item_id = $_GET['id'] ?? null;
    
    if (!$item_id) {
        echo json_encode(['success' => false, 'message' => 'Item ID is required']);
        exit;
    }
    
    $stmt = $db->query("SELECT * FROM menu_items WHERE id = ? AND is_available = 1", [$item_id]);
    $item = $stmt->fetch();
    
    if (!$item) {
        echo json_encode(['success' => false, 'message' => 'Item not found']);
        exit;
    }
    
    echo json_encode([
        'success' => true,
        'item' => [
            'id' => $item['id'],
            'name' => $item['name'],
            'description' => $item['description'],
            'price' => $item['price'],
            'image_url' => $item['image_url'],
            'preparation_time' => $item['preparation_time']
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Get menu item error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>