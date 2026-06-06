<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'bh_store';


$conn = new mysqli($host, $user, $pass, $db);


if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['success' => false, 'error' => 'Database Connection Error: ' . $conn->connect_error]));
}


$conn->set_charset("utf8mb4");
?>
