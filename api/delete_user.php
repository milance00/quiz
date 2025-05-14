<?php
include "../includes/db.php";
session_start();

header("Content-Type: application/json");

if (!isset($_SESSION["username"]) || !isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "You must be logged in to access this quiz."]);
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit();
}

if (!isset($data['user_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input data."]);
    exit();
}

$user_id = (int)$data['user_id'];

if (empty($user_id)) {
    http_response_code(400);
    echo json_encode(["error" => "User ID is required."]);
    exit();
}

try {
    $checkStmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $checkStmt->execute([$user_id]);
    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["error" => "User not found."]);
        exit();
    }

    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$user_id]);

    http_response_code(200);
    echo json_encode(["success" => "User deleted successfully!"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
}
?>
