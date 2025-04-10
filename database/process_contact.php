<?php
header('Content-Type: application/json');

// Database configuration
$db_host = 'sql100.infinityfree.com';
$db_user = 'if0_38719579';
$db_pass = 'lifecare25';
$db_name = 'if0_38719579_life_care';

// Create connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit();
}

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

try {
    // Get POST data
    $input = file_get_contents('php://input');
    if (!$input) {
        throw new Exception('No input data received');
    }

    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data');
    }

    // Validate required fields
    $required_fields = ['name', 'email', 'subject', 'message'];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            throw new Exception("Missing required field: {$field}");
        }
    }

    // Validate email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // Prepare SQL statement
    $sql = "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Failed to prepare statement: ' . $conn->error);
    }
    
    // Bind parameters
    $stmt->bind_param(
        "ssss",
        $data['name'],
        $data['email'],
        $data['subject'],
        $data['message']
    );
    
    // Execute the statement
    if (!$stmt->execute()) {
        throw new Exception('Failed to execute statement: ' . $stmt->error);
    }
    
    echo json_encode([
        'success' => true, 
        'message' => 'Message sent successfully',
        'data' => [
            'id' => $conn->insert_id
        ]
    ]);
    
    $stmt->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>
