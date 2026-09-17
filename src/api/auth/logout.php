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
    // Remove session from database if it exists
    if (isset($_SESSION['session_token'])) {
        $db->query("DELETE FROM user_sessions WHERE session_token = ?", [$_SESSION['session_token']]);
    }
    
    // Clear session
    session_unset();
    session_destroy();
    
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    
} catch (Exception $e) {
    error_log("Logout error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred during logout']);
}
?>