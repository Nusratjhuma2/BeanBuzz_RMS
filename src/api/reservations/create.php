<?php
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
    
    // Validate required fields
    $required_fields = ['customer_name', 'customer_phone', 'reservation_date', 'reservation_time', 'party_size'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            echo json_encode(['success' => false, 'message' => "Field '{$field}' is required"]);
            exit;
        }
    }
    
    $customer_name = trim($input['customer_name']);
    $customer_email = trim($input['customer_email']) ?: null;
    $customer_phone = trim($input['customer_phone']);
    $reservation_date = $input['reservation_date'];
    $reservation_time = $input['reservation_time'];
    $party_size = intval($input['party_size']);
    $table_id = !empty($input['table_id']) ? intval($input['table_id']) : null;
    $special_requests = trim($input['special_requests']) ?: null;
    
    // Validate date is not in the past
    $reservation_datetime = $reservation_date . ' ' . $reservation_time;
    if (strtotime($reservation_datetime) <= time()) {
        echo json_encode(['success' => false, 'message' => 'Reservation time must be in the future']);
        exit;
    }
    
    // Validate party size
    if ($party_size < 1 || $party_size > 10) {
        echo json_encode(['success' => false, 'message' => 'Party size must be between 1 and 10 people']);
        exit;
    }
    
    // If table is specified, check if it's available
    if ($table_id) {
        // Check if table exists and has sufficient capacity
        $table_check = $db->query("SELECT capacity, status FROM restaurant_tables WHERE id = ?", [$table_id])->fetch();
        
        if (!$table_check) {
            echo json_encode(['success' => false, 'message' => 'Selected table does not exist']);
            exit;
        }
        
        if ($table_check['status'] !== 'available') {
            echo json_encode(['success' => false, 'message' => 'Selected table is not available']);
            exit;
        }
        
        if ($party_size > $table_check['capacity']) {
            echo json_encode(['success' => false, 'message' => 'Party size exceeds table capacity']);
            exit;
        }
        
        // Check for conflicting reservations (within 2 hours)
        $conflict_check = $db->query("
            SELECT COUNT(*) as conflicts 
            FROM reservations 
            WHERE table_id = ? 
            AND reservation_date = ? 
            AND status IN ('pending', 'confirmed', 'seated')
            AND ABS(TIMESTAMPDIFF(MINUTE, reservation_time, ?)) < 120
        ", [$table_id, $reservation_date, $reservation_time])->fetch();
        
        if ($conflict_check['conflicts'] > 0) {
            echo json_encode(['success' => false, 'message' => 'Selected time slot is not available for this table']);
            exit;
        }
    } else {
        // Auto-assign a suitable table
        $suitable_tables = $db->query("
            SELECT rt.id 
            FROM restaurant_tables rt 
            WHERE rt.capacity >= ? 
            AND rt.status = 'available'
            AND rt.id NOT IN (
                SELECT COALESCE(r.table_id, 0)
                FROM reservations r 
                WHERE r.reservation_date = ? 
                AND r.status IN ('pending', 'confirmed', 'seated')
                AND ABS(TIMESTAMPDIFF(MINUTE, r.reservation_time, ?)) < 120
            )
            ORDER BY rt.capacity ASC 
            LIMIT 1
        ", [$party_size, $reservation_date, $reservation_time])->fetchAll();
        
        if (!empty($suitable_tables)) {
            $table_id = $suitable_tables[0]['id'];
        }
        // If no table found, still allow reservation without table assignment
    }
    
    // Create reservation
    $stmt = $db->query("
        INSERT INTO reservations (customer_name, customer_email, customer_phone, table_id, party_size, reservation_date, reservation_time, special_requests, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    ", [
        $customer_name,
        $customer_email,
        $customer_phone,
        $table_id,
        $party_size,
        $reservation_date,
        $reservation_time,
        $special_requests
    ]);
    
    if ($stmt) {
        $reservation_id = $db->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Reservation created successfully',
            'reservation_id' => $reservation_id,
            'table_assigned' => $table_id !== null,
            'reservation_details' => [
                'id' => $reservation_id,
                'customer_name' => $customer_name,
                'date' => $reservation_date,
                'time' => $reservation_time,
                'party_size' => $party_size,
                'table_id' => $table_id
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create reservation']);
    }
    
} catch (Exception $e) {
    error_log("Create reservation error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred while creating the reservation']);
}
?>