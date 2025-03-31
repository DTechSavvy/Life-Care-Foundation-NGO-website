<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log the received POST data
error_log("Received POST data: " . print_r($_POST, true));

// Database configuration
$db_host = 'localhost';
$db_user = 'root';      // Replace with your MySQL username
$db_pass = '';          // Replace with your MySQL password
$db_name = 'ngo_donations';

try {
    // Create database connection
    $conn = new mysqli($db_host, $db_user, $db_pass);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Create database if it doesn't exist
    $conn->query("CREATE DATABASE IF NOT EXISTS $db_name");
    $conn->select_db($db_name);

    // Create table if it doesn't exist
    $create_table = "CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        campaign VARCHAR(100),
        recurring BOOLEAN DEFAULT FALSE,
        donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    if (!$conn->query($create_table)) {
        throw new Exception("Error creating table: " . $conn->error);
    }

    // Validate and sanitize input data
    if (!isset($_POST['name']) || !isset($_POST['email']) || !isset($_POST['phone']) || !isset($_POST['amount'])) {
        throw new Exception("Missing required fields");
    }

    $name = $conn->real_escape_string($_POST['name']);
    $email = $conn->real_escape_string($_POST['email']);
    $phone = $conn->real_escape_string($_POST['phone']);
    $amount = floatval($_POST['amount']);
    $campaign = isset($_POST['campaign']) ? $conn->real_escape_string($_POST['campaign']) : '';
    $recurring = isset($_POST['recurring']) ? ($_POST['recurring'] === '1' ? 1 : 0) : 0;

    // Insert data into database
    $sql = "INSERT INTO donations (name, email, phone, amount, campaign, recurring) 
            VALUES ('$name', '$email', '$phone', $amount, '$campaign', $recurring)";

    if (!$conn->query($sql)) {
        throw new Exception("Error inserting data: " . $conn->error);
    }

    $donation_id = $conn->insert_id;
    error_log("Donation saved successfully. ID: $donation_id");

    // Send success response
    echo json_encode(['status' => 'success', 'message' => 'Donation recorded successfully']);

} catch (Exception $e) {
    error_log("Error in process_donation.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'An error occurred while processing your donation']);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?> 