<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database configuration
require_once 'config.php';

try {
    // Get POST data
    $input = file_get_contents('php://input');
    
    // Log raw input for debugging
    error_log("Raw input: " . $input);
    
    // Decode JSON data
    $data = json_decode($input, true);
    
    // Check for JSON decode errors
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON: ' . json_last_error_msg());
    }
    
    // Log decoded data
    error_log("Decoded data: " . print_r($data, true));

    // Validate required fields
    $required_fields = ['event_title', 'event_date', 'full_name', 'email', 'phone', 'age', 'availability'];
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            throw new Exception("Missing required field: {$field}");
        }
    }

    // Create the SQL query
    $sql = "INSERT INTO event_registrations (
        event_title,
        event_date,
        full_name,
        email,
        phone,
        age,
        previous_experience,
        availability,
        areas_of_interest,
        terms_accepted,
        registration_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

    // Prepare statement
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Database error: " . $conn->error);
    }

    // Set default values for optional fields
    $previous_experience = isset($data['previous_experience']) ? $data['previous_experience'] : '';
    $areas_of_interest = isset($data['areas_of_interest']) ? $data['areas_of_interest'] : '';
    $terms_accepted = isset($data['terms_accepted']) ? $data['terms_accepted'] : 1;

    // Bind parameters
    $stmt->bind_param(
        "sssssiisis",
        $data['event_title'],
        $data['event_date'],
        $data['full_name'],
        $data['email'],
        $data['phone'],
        $data['age'],
        $previous_experience,
        $data['availability'],
        $areas_of_interest,
        $terms_accepted
    );

    // Execute the statement
    if (!$stmt->execute()) {
        throw new Exception("Failed to save registration: " . $stmt->error);
    }

    // Return success response
    $response = [
        'success' => true,
        'message' => 'Registration successful',
        'id' => $conn->insert_id
    ];
    
    echo json_encode($response);

} catch (Exception $e) {
    // Log the error
    error_log("Registration error: " . $e->getMessage());
    
    // Return error response
    $response = [
        'success' => false,
        'error' => $e->getMessage()
    ];
    
    http_response_code(400);
    echo json_encode($response);
}

// Close database connection
if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?> 
