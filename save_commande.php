<?php
session_start();
header('Content-Type: application/json');

require_once 'config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}


$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['items']) || !isset($data['total'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

try {
    $user_id = (int)$_SESSION['user_id'];
    $items = json_encode($data['items']);
    $total = (float)$data['total'];
    $status = 'En attente';
    

    $query = "INSERT INTO commandes (user_id, items, total, status) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }
    

    $stmt->bind_param('isds', $user_id, $items, $total, $status);
    
    if (!$stmt->execute()) {
        throw new Exception('Execute failed: ' . $stmt->error);
    }
    
    $order_id = $conn->insert_id;
    
    echo json_encode([
        'success' => true,
        'message' => 'Commande créée avec succès',
        'order_id' => $order_id,
        'total' => $total
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();
?>
