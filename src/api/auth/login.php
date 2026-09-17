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
    
    if (!isset($input['email']) || !isset($input['password'])) {
        echo json_encode(['success' => false, 'message' => 'Email and password are required']);
        exit;
    }
    
    $email = trim($input['email']);
    $password = $input['password'];
    
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Email and password cannot be empty']);
        exit;
    }
    
    // Get user from database
    $stmt = $db->query("SELECT * FROM users WHERE email = ? AND is_active = 1", [$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        exit;
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
        exit;
    }
    
    // Check if user is staff (not customer)
    if ($user['role'] === 'customer') {
        echo json_encode(['success' => false, 'message' => 'This login is for staff only. Customers can order directly from the menu.']);
        exit;
    }
    
    // Create session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    
    // Generate session token for additional security
    $session_token = bin2hex(random_bytes(32));
    $_SESSION['session_token'] = $session_token;
    
    // Store session in database
    $db->query(
        "INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))",
        [
            $user['id'],
            $session_token,
            $_SERVER['REMOTE_ADDR'] ?? '',
            $_SERVER['HTTP_USER_AGENT'] ?? '',
        ]
    );
    
    // Update last login timestamp
    $db->query("UPDATE users SET updated_at = NOW() WHERE id = ?", [$user['id']]);
    
    // Return user data (without password)
    unset($user['password']);
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred during login']);
}
?>