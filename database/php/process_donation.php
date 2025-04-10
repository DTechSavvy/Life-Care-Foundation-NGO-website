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
$db_host = 'sql100.infinityfree.com';
$db_user = 'if0_38719579';      // Your MySQL username
$db_pass = 'lifecare25';          // Your MySQL password
$db_name = 'if0_38719579_life_care';

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

    // Create campaign goals table
    $create_campaigns_table = "CREATE TABLE IF NOT EXISTS campaign_goals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        campaign_name VARCHAR(100) NOT NULL,
        target_amount DECIMAL(10,2) NOT NULL,
        current_amount DECIMAL(10,2) DEFAULT 0,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    if (!$conn->query($create_campaigns_table)) {
        throw new Exception("Error creating campaign goals table: " . $conn->error);
    }

    // Insert default campaign goals if they don't exist
    $default_campaigns = [
        ['Education for All', 100000, 'Support education for underprivileged children'],
        ['Healthcare Initiative', 150000, 'Provide healthcare to rural communities'],
        ['Environmental Protection', 200000, 'Protect and restore natural habitats'],
        ['Women Empowerment', 80000, 'Support women\'s education and skill development'],
        ['Clean Water Project', 120000, 'Provide clean water access to communities']
    ];

    foreach ($default_campaigns as $campaign) {
        $check_sql = "SELECT id FROM campaign_goals WHERE campaign_name = '" . $conn->real_escape_string($campaign[0]) . "'";
        $result = $conn->query($check_sql);
        
        if ($result->num_rows == 0) {
            $insert_sql = "INSERT INTO campaign_goals (campaign_name, target_amount, description) 
                          VALUES ('" . $conn->real_escape_string($campaign[0]) . "', 
                                 " . floatval($campaign[1]) . ", 
                                 '" . $conn->real_escape_string($campaign[2]) . "')";
            $conn->query($insert_sql);
        }
    }

    // Validate and sanitize input data
    $name = $conn->real_escape_string($_POST['name'] ?? '');
    $email = $conn->real_escape_string($_POST['email'] ?? '');
    $phone = $conn->real_escape_string($_POST['phone'] ?? '');
    $amount = floatval($_POST['amount'] ?? 0);
    $campaign = $conn->real_escape_string($_POST['campaign'] ?? '');
    $recurring = isset($_POST['recurring']) ? 1 : 0;

    // Validate name (no numbers allowed)
    if (!preg_match('/^[a-zA-Z\s]+$/', $name)) {
        throw new Exception("Name should only contain letters and spaces");
    }

    // Validate phone number (exactly 10 digits)
    if (!preg_match('/^\d{10}$/', $phone)) {
        throw new Exception("Phone number must be exactly 10 digits");
    }

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    // Validate amount
    if ($amount <= 0) {
        throw new Exception("Amount must be greater than 0");
    }

    // Validate required fields
    if (empty($name) || empty($email) || empty($phone)) {
        throw new Exception("All fields are required");
    }

    // Insert data into database
    $sql = "INSERT INTO donations (name, email, phone, amount, campaign, recurring) 
            VALUES ('$name', '$email', '$phone', $amount, '$campaign', $recurring)";

    if (!$conn->query($sql)) {
        throw new Exception("Error inserting data: " . $conn->error);
    }

    // Update campaign progress if campaign is specified
    if (!empty($campaign)) {
        $update_progress = "UPDATE campaign_goals 
                           SET current_amount = current_amount + $amount 
                           WHERE campaign_name = '$campaign'";
        if (!$conn->query($update_progress)) {
            error_log("Error updating campaign progress: " . $conn->error);
        }
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
