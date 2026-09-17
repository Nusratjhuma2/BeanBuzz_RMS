<?php
session_start();
require_once '../../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Check if user is logged in
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['session_token'])) {
        echo json_encode(['success' => false, 'message' => 'Not logged in']);
        exit;
    }
    
    $user_id = $_SESSION['user_id'];
    $session_token = $_SESSION['session_token'];
    
    // Verify session in database
    $stmt = $db->query(
        "SELECT s.*, u.name, u.email, u.role FROM user_sessions s 
         JOIN users u ON s.user_id = u.id 
         WHERE s.session_token = ? AND s.user_id = ? AND s.expires_at > NOW() AND u.is_active = 1",
        [$session_token, $user_id]
    );
    
    $session = $stmt->fetch();
    
    if (!$session) {
        // Invalid or expired session
        session_unset();
        session_destroy();
        echo json_encode(['success' => false, 'message' => 'Session expired']);
        exit;
    }
    
    // Update session expiry
    $db->query("UPDATE user_sessions SET expires_at = DATE_ADD(NOW(), INTERVAL 24 HOUR) WHERE session_token = ?", [$session_token]);
    
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $session['user_id'],
            'name' => $session['name'],
            'email' => $session['email'],
            'role' => $session['role']
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Session check error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>