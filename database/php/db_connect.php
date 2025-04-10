<?php
$db_host = 'sql100.infinityfree.com';
$db_user = 'if0_38719579';      // Your MySQL username
$db_pass = 'lifecare25';          // Your MySQL password
$db_name = 'if0_38719579_life_care';

// Create connection with error handling
try {
    $conn = new mysqli($db_host, $db_user, $db_pass);
    
    // Create database if it doesn't exist
    $conn->query("CREATE DATABASE IF NOT EXISTS $db_name");
    
    // Select the database
    $conn->select_db($db_name);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Set charset to utf8mb4
    if (!$conn->set_charset("utf8mb4")) {
        throw new Exception("Error setting charset utf8mb4: " . $conn->error);
    }

    // Create table if it doesn't exist
    $create_table_sql = "CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        campaign VARCHAR(100),
        recurring BOOLEAN DEFAULT FALSE,
        donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        payment_status VARCHAR(20) DEFAULT 'pending',
        transaction_id VARCHAR(100),
        INDEX idx_email (email),
        INDEX idx_donation_date (donation_date)
    )";
    
    if (!$conn->query($create_table_sql)) {
        throw new Exception("Error creating table: " . $conn->error);
    }

} catch (Exception $e) {
    error_log("Database connection error: " . $e->getMessage());
    // Don't expose database errors to the client
    http_response_code(500);
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
        die(json_encode(['status' => 'error', 'message' => 'Internal server error']));
    } else {
        die("Internal server error");
    }
}
?> 
