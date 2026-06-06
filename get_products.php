<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

try {
    $query = "SELECT id, name, brand, category, specs, price, old_price, sub_category, image FROM products ORDER BY id ASC";
    $result = $conn->query($query);
    
    if (!$result) {
        throw new Exception('Query failed: ' . $conn->error);
    }
    
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $specs = json_decode($row['specs'], true);
        if (!is_array($specs)) {
            $specs = [];
        }
        
        
        $product = [
            'id' => (int)$row['id'],
            'n' => $row['name'],              
            'b' => $row['brand'],              
            'c' => $row['category'],           
            's' => $specs,                     
            'p' => (float)$row['price'],       
            'op' => $row['old_price'] ? (float)$row['old_price'] : null, 
            'cat' => $row['sub_category'],     
            'img' => $row['image']             
        ];
        
        $products[] = $product;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $products,
        'count' => count($products)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>
