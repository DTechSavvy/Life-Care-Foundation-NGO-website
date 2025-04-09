<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
$db_host = 'localhost';
$db_user = 'root';      // Replace with your MySQL username
$db_pass = '';          // Replace with your MySQL password
$db_name = 'ngo_donations';

try {
    // Create database connection
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Fetch all campaign progress
    $sql = "SELECT campaign_name, target_amount, current_amount, description 
            FROM campaign_goals 
            ORDER BY created_at ASC";
    
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Error fetching campaign data: " . $conn->error);
    }

    $campaigns = [];
    while ($row = $result->fetch_assoc()) {
        $progress = ($row['current_amount'] / $row['target_amount']) * 100;
        $campaigns[] = [
            'name' => $row['campaign_name'],
            'target' => floatval($row['target_amount']),
            'current' => floatval($row['current_amount']),
            'progress' => round($progress, 2),
            'description' => $row['description']
        ];
    }

    echo json_encode(['status' => 'success', 'campaigns' => $campaigns]);

} catch (Exception $e) {
    error_log("Error in get_campaign_progress.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'An error occurred while fetching campaign progress']);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?> 