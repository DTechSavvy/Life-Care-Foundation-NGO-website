<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json');

require_once 'config.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Check content type
if (!isset($_SERVER["CONTENT_TYPE"]) || stripos($_SERVER["CONTENT_TYPE"], 'application/json') === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Content-Type must be application/json']);
    exit();
}

try {
    // Get POST data
    $input = file_get_contents('php://input');
    if (empty($input)) {
        throw new Exception('No input data received');
    }

    // Log the raw input for debugging
    error_log("Raw input: " . $input);

    // Decode JSON data
    $data = json_decode($input, true);
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data: ' . json_last_error_msg());
    }

    // Log the decoded data for debugging
    error_log("Decoded data: " . print_r($data, true));

    // Validate required fields
    $required_fields = ['eventTitle', 'eventDate', 'fullName', 'email', 'phone', 'age', 'availability'];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            throw new Exception("Missing required field: {$field}");
        }
    }

    // Validate email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // Validate age
    if (!is_numeric($data['age']) || $data['age'] < 18 || $data['age'] > 100) {
        throw new Exception('Invalid age (must be between 18 and 100)');
    }

    // Prepare SQL statement
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
        terms_accepted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Failed to prepare statement: ' . $conn->error);
    }
    
    // Set default values for optional fields
    $previous_experience = isset($data['experience']) ? $data['experience'] : '';
    $areas_of_interest = isset($data['interests']) ? implode(', ', (array)$data['interests']) : '';
    
    // Bind parameters
    $stmt->bind_param(
        "sssssisss",
        $data['eventTitle'],
        $data['eventDate'],
        $data['fullName'],
        $data['email'],
        $data['phone'],
        $data['age'],
        $previous_experience,
        $data['availability'],
        $areas_of_interest
    );
    
    // Execute the statement
    if (!$stmt->execute()) {
        throw new Exception('Failed to execute statement: ' . $stmt->error);
    }
    
    echo json_encode([
        'success' => true, 
        'message' => 'Registration successful',
        'data' => [
            'id' => $conn->insert_id,
            'eventTitle' => $data['eventTitle']
        ]
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?> 