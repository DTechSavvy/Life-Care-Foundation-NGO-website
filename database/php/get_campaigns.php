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

    // Fetch only active campaigns (those that haven't reached their target)
    $sql = "SELECT 
                cg.campaign_name,
                cg.target_amount,
                cg.current_amount,
                cg.description,
                ROUND((cg.current_amount / cg.target_amount) * 100, 2) as progress_percentage
            FROM campaign_goals cg
            WHERE cg.current_amount < cg.target_amount
            ORDER BY cg.created_at ASC";
    
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Error fetching campaigns: " . $conn->error);
    }

    $campaigns = [];
    while ($row = $result->fetch_assoc()) {
        $campaigns[] = [
            'name' => $row['campaign_name'],
            'target' => floatval($row['target_amount']),
            'current' => floatval($row['current_amount']),
            'progress' => floatval($row['progress_percentage']),
            'description' => $row['description']
        ];
    }

    echo json_encode(['status' => 'success', 'campaigns' => $campaigns]);

} catch (Exception $e) {
    error_log("Error in get_campaigns.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'An error occurred while fetching campaigns']);
} finally {
    if (isset($conn)) {
        $conn->close();
    }
}
?> 