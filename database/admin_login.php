<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
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

try {
    // Get POST data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data || !isset($data['username']) || !isset($data['password'])) {
        throw new Exception('Missing required fields');
    }

    // In a real application, you would hash passwords and store them securely
    // This is just for demonstration purposes
    $valid_username = 'admin';
    $valid_password = 'admin123'; // In production, use a secure password

    if ($data['username'] === $valid_username && $data['password'] === $valid_password) {
        // Generate a simple token (in production, use a proper JWT)
        $token = bin2hex(random_bytes(32));
        
        // Store the token in the database with an expiration time
        $expiry = date('Y-m-d H:i:s', strtotime('+24 hours'));
        $stmt = $conn->prepare("INSERT INTO admin_tokens (token, expiry) VALUES (?, ?)");
        $stmt->bind_param("ss", $token, $expiry);
        $stmt->execute();
        $stmt->close();

        echo json_encode([
            'success' => true,
            'token' => $token
        ]);
    } else {
        throw new Exception('Invalid credentials');
    }

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?> 