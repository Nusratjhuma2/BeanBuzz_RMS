<?php
require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Get database connection
    $database = new Database();
    $db = $database->getConnection();
    
    // Query to get reservations with table information
    $query = "SELECT r.*, rt.table_number 
              FROM reservations r 
              LEFT JOIN restaurant_tables rt ON r.table_id = rt.id 
              WHERE r.status IN ('pending', 'confirmed')
              ORDER BY r.reservation_date DESC, r.reservation_time DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $reservations = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $reservations[] = [
            'id' => $row['id'],
            'customer_name' => $row['customer_name'],
            'customer_email' => $row['customer_email'],
            'customer_phone' => $row['customer_phone'],
            'table_id' => $row['table_id'],
            'table_number' => $row['table_number'],
            'party_size' => (int)$row['party_size'],
            'reservation_date' => $row['reservation_date'],
            'reservation_time' => $row['reservation_time'],
            'status' => $row['status'],
            'special_requests' => $row['special_requests'],
            'created_at' => $row['created_at']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'reservations' => $reservations
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>