<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require_once 'config.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if the request is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

try {
    // Get the authorization header
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        throw new Exception('No authorization token provided');
    }

    // Extract the token
    $token = str_replace('Bearer ', '', $headers['Authorization']);

    // Verify token
    $stmt = $conn->prepare("SELECT * FROM admin_tokens WHERE token = ? AND expiry > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception('Invalid or expired token');
    }

    // Fetch registrations
    $query = "SELECT * FROM event_registrations ORDER BY registration_date DESC";
    $result = $conn->query($query);

    if (!$result) {
        throw new Exception('Failed to fetch registrations');
    }

    $registrations = [];
    while ($row = $result->fetch_assoc()) {
        $registrations[] = $row;
    }

    echo json_encode([
        'success' => true,
        'registrations' => $registrations
    ]);

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?> 
