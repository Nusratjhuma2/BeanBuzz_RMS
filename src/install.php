<?php
// BeanBuzz RMS Installation Script
// This script helps with the initial setup of the database

// Configuration
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'beanbuzz_rms';

$success_messages = [];
$error_messages = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Connect to MySQL server
        $pdo = new PDO("mysql:host=$db_host", $db_user, $db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Create database if it doesn't exist
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $success_messages[] = "Database '$db_name' created successfully!";
        
        // Connect to the new database
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Read and execute SQL file
        $sql_file = __DIR__ . '/database/schema.sql';
        if (file_exists($sql_file)) {
            $sql_content = file_get_contents($sql_file);
            
            // Remove the CREATE DATABASE statements since we already created it
            $sql_content = preg_replace('/CREATE DATABASE.*?;/i', '', $sql_content);
            $sql_content = preg_replace('/USE.*?;/i', '', $sql_content);
            
            // Split into individual statements
            $statements = array_filter(array_map('trim', explode(';', $sql_content)));
            
            foreach ($statements as $statement) {
                if (!empty($statement)) {
                    $pdo->exec($statement);
                }
            }
            
            $success_messages[] = "Database tables created successfully!";
            $success_messages[] = "Sample data imported successfully!";
            $success_messages[] = "Installation completed! You can now delete this install.php file.";
            
        } else {
            $error_messages[] = "SQL file not found: $sql_file";
        }
        
    } catch (PDOException $e) {
        $error_messages[] = "Database error: " . $e->getMessage();
    } catch (Exception $e) {
        $error_messages[] = "Error: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BeanBuzz RMS - Installation</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            background: var(--gradient-cream);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        
        .install-container {
            max-width: 600px;
            width: 100%;
            background: var(--card);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-2xl);
            overflow: hidden;
        }
        
        .install-header {
            background: var(--gradient-coffee);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        .install-body {
            padding: 2rem;
        }
        
        .message {
            padding: 1rem;
            border-radius: var(--radius);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .message.success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #10b981;
        }
        
        .message.error {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #dc2626;
        }
        
        .install-steps {
            background: var(--secondary);
            border-radius: var(--radius);
            padding: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .install-steps h3 {
            margin-bottom: 1rem;
            color: var(--primary);
        }
        
        .install-steps ol {
            margin-left: 1.5rem;
        }
        
        .install-steps li {
            margin-bottom: 0.5rem;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="install-container fade-in">
        <div class="install-header">
            <h1><i class="fas fa-coffee"></i> BeanBuzz RMS</h1>
            <p>Restaurant Management System Installation</p>
        </div>
        
        <div class="install-body">
            <?php if (!empty($success_messages)): ?>
                <?php foreach ($success_messages as $message): ?>
                    <div class="message success">
                        <i class="fas fa-check-circle"></i>
                        <?php echo htmlspecialchars($message); ?>
                    </div>
                <?php endforeach; ?>
                
                <div style="text-align: center; margin-top: 2rem;">
                    <a href="index.php" class="btn btn-primary btn-lg">
                        <i class="fas fa-rocket"></i> Launch BeanBuzz RMS
                    </a>
                </div>
                
            <?php elseif (!empty($error_messages)): ?>
                <?php foreach ($error_messages as $message): ?>
                    <div class="message error">
                        <i class="fas fa-exclamation-circle"></i>
                        <?php echo htmlspecialchars($message); ?>
                    </div>
                <?php endforeach; ?>
                
                <div style="text-align: center; margin-top: 2rem;">
                    <button onclick="location.reload()" class="btn btn-secondary">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                </div>
                
            <?php else: ?>
                <div class="install-steps">
                    <h3><i class="fas fa-list-check"></i> Installation Steps</h3>
                    <ol>
                        <li><strong>Start XAMPP:</strong> Make sure Apache and MySQL are running</li>
                        <li><strong>Database Setup:</strong> This installer will create the database and tables</li>
                        <li><strong>Import Data:</strong> Sample menu items and user accounts will be created</li>
                        <li><strong>Ready to Use:</strong> Your restaurant management system will be ready!</li>
                    </ol>
                </div>
                
                <div style="background: var(--muted); border-radius: var(--radius); padding: 1.5rem; margin: 1.5rem 0;">
                    <h4><i class="fas fa-info-circle" style="color: var(--primary);"></i> Default Login Credentials</h4>
                    <div style="margin-top: 1rem; font-family: monospace; font-size: 0.9rem;">
                        <strong>Manager:</strong> admin@beanbuzz.com / admin123<br>
                        <strong>Waiter:</strong> waiter@beanbuzz.com / waiter123<br>
                        <strong>Chef:</strong> chef@beanbuzz.com / chef123
                    </div>
                </div>
                
                <form method="POST" style="text-align: center;">
                    <button type="submit" class="btn btn-primary btn-lg hover-glow">
                        <i class="fas fa-download"></i> Install BeanBuzz RMS
                    </button>
                </form>
                
                <div style="text-align: center; margin-top: 1rem;">
                    <small class="text-muted">
                        <i class="fas fa-shield-alt"></i> 
                        Make sure to delete this install.php file after installation
                    </small>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>