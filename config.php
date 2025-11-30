<?php
// Database configuration
$db_file = __DIR__ . '/users.db';

try {
    // Create SQLite database connection
    $db = new PDO("sqlite:$db_file");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create users table if it doesn't exist
    $db->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT,
        mobile TEXT,
        email TEXT UNIQUE,
        password TEXT,
        otp TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Create login_attempts table
    $db->exec("CREATE TABLE IF NOT EXISTS login_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Helper function to log login attempts
function log_login_attempt($email, $db) {
    $ip = $_SERVER['REMOTE_ADDR'];
    $user_agent = $_SERVER['HTTP_USER_AGENT'];
    
    $stmt = $db->prepare("INSERT INTO login_attempts (email, ip_address, user_agent) VALUES (?, ?, ?)");
    $stmt->execute([$email, $ip, $user_agent]);
}
?>
