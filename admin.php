<?php
session_start();


if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}


$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'bh_store';


$conn = new mysqli($host, $user, $pass, $db);


if ($conn->connect_error) {
    die('Database Connection Error: ' . $conn->connect_error);
}

$conn->set_charset("utf8mb4");


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'delete_user') {
        $user_id = intval($_POST['user_id']);
        $delete_query = "DELETE FROM users WHERE id = ?";
        $stmt = $conn->prepare($delete_query);
        $stmt->bind_param("i", $user_id);
        
        if ($stmt->execute()) {
            $delete_message = "Utilisateur supprimé avec succès!";
        } else {
            $delete_message = "Erreur lors de la suppression de l'utilisateur!";
        }
        $stmt->close();
    }
    
    if ($_POST['action'] === 'delete_order') {
        $order_id = intval($_POST['order_id']);
        $delete_query = "DELETE FROM commandes WHERE id = ?";
        $stmt = $conn->prepare($delete_query);
        $stmt->bind_param("i", $order_id);
        
        if ($stmt->execute()) {
            $delete_message = "Commande supprimée avec succès!";
        } else {
            $delete_message = "Erreur lors de la suppression de la commande!";
        }
        $stmt->close();
    }
    
    if ($_POST['action'] === 'delete_product') {
        $product_id = intval($_POST['product_id']);
        $delete_query = "DELETE FROM products WHERE id = ?";
        $stmt = $conn->prepare($delete_query);
        $stmt->bind_param("i", $product_id);
        
        if ($stmt->execute()) {
            $delete_message = "Produit supprimé avec succès!";
        } else {
            $delete_message = "Erreur lors de la suppression du produit!";
        }
        $stmt->close();
    }
}


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['product_name'])) {
    $product_name = $_POST['product_name'];
    $brand = $_POST['brand'];
    $category = $_POST['category'];
    $price = floatval($_POST['price']);
    $old_price = !empty($_POST['old_price']) ? floatval($_POST['old_price']) : null;
    $sub_category = $_POST['sub_category'] ?? '';
    $specs = json_encode(array_filter(explode(',', $_POST['specs']), 'trim'));
    $description = $_POST['description'] ?? '';
    
    $image_path = '';
    
    if (isset($_FILES['product_image']) && $_FILES['product_image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = './';
        $file_name = basename($_FILES['product_image']['name']);
        $file_path = $upload_dir . $file_name;
        
        if (move_uploaded_file($_FILES['product_image']['tmp_name'], $file_path)) {
            $image_path = './' . $file_name;
        }
    }
    
    if ($image_path) {
        $insert_query = "INSERT INTO products (name, brand, category, sub_category, price, old_price, specs, image) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($insert_query);
        $stmt->bind_param("ssssdiss", $product_name, $brand, $category, $sub_category, $price, $old_price, $specs, $image_path);
        
        if ($stmt->execute()) {
            $delete_message = "✅ Produit ajouté avec succès!";
        } else {
            $delete_message = "❌ Erreur lors de l'ajout du produit!";
        }
        $stmt->close();
    }
}


$total_users = $conn->query("SELECT COUNT(*) as count FROM users")->fetch_assoc()['count'];
$total_orders = $conn->query("SELECT COUNT(*) as count FROM commandes")->fetch_assoc()['count'];
$total_revenue = $conn->query("SELECT SUM(total) as sum FROM commandes")->fetch_assoc()['sum'] ?? 0;
$total_products = $conn->query("SELECT COUNT(*) as count FROM products")->fetch_assoc()['count'];


$users_result = $conn->query("SELECT id, name, email, created_at FROM users ORDER BY created_at DESC");
$users = [];
if ($users_result) {
    while ($row = $users_result->fetch_assoc()) {
        $users[] = $row;
    }
}


$orders_result = $conn->query("
    SELECT c.id, c.user_id, u.name, u.email, c.items, c.total, c.status, c.created_at
    FROM commandes c
    LEFT JOIN users u ON c.user_id = u.id
    ORDER BY c.created_at DESC
");
$orders = [];
if ($orders_result) {
    while ($row = $orders_result->fetch_assoc()) {
        if (isset($row['items']) && $row['items']) {
            $items = json_decode($row['items'], true);
            if (is_array($items)) {
                foreach ($items as &$item) {
                    // If product_id exists, lookup product details from database
                    if (isset($item['product_id'])) {
                        $product_query = $conn->prepare("SELECT name, brand FROM products WHERE id = ? LIMIT 1");
                        $product_query->bind_param("i", $item['product_id']);
                        $product_query->execute();
                        $product_result = $product_query->get_result();
                        if ($product_data = $product_result->fetch_assoc()) {
                            $item['name'] = $product_data['name'];
                            $item['brand'] = $product_data['brand'];
                        }
                        $product_query->close();
                    }
                }
                $row['items'] = json_encode($items);
            }
        }
        $orders[] = $row;
    }
}


$products_result = $conn->query("SELECT id, name, brand, category, price, old_price, image, specs FROM products ORDER BY id DESC");
$products = [];
if ($products_result) {
    while ($row = $products_result->fetch_assoc()) {
        $products[] = $row;
    }
}


include 'admin.html';

$conn->close();
?>
