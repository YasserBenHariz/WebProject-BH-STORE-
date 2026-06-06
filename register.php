<?php
session_start();
header('Content-Type: application/json');

require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['name']) || !isset($data['email']) || !isset($data['pass'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields required']);
    exit;
}

$name = trim($data['name']);
$email = trim($data['email']);
$password = trim($data['pass']);

if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Name cannot be empty']);
    exit;
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

if (strlen($password) < 4) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 4 characters']);
    exit;
}

try {
    $check_query = "SELECT id FROM users WHERE email = ?";
    $check_stmt = $conn->prepare($check_query);
    if (!$check_stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }
    
    $check_stmt->bind_param('s', $email);
    $check_stmt->execute();
    
    if ($check_stmt->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        $check_stmt->close();
        exit;
    }
    $check_stmt->close();
    
    $hashed_pass = md5($password);
    
    $insert_query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_query);
    
    if (!$insert_stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }
    
    $insert_stmt->bind_param('sss', $name, $email, $hashed_pass);
    
    if (!$insert_stmt->execute()) {
        throw new Exception('Execute failed: ' . $insert_stmt->error);
    }
    
    $user_id = $conn->insert_id;
    
    $_SESSION['user_id'] = $user_id;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;
    
    echo json_encode([
        'success' => true,
        'message' => 'Compte créé avec succès',
        'user' => [
            'id' => $user_id,
            'name' => $name,
            'email' => $email
        ]
    ]);
    
    $insert_stmt->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>
