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

if (!isset($data['quiz_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input data."]);
    exit();
}

$quiz_id = (int)$data['quiz_id'];

if (empty($quiz_id)) {
    http_response_code(400);
    echo json_encode(["error" => "Quiz ID is required."]);
    exit();
}

try {
    $checkStmt = $pdo->prepare("SELECT id FROM quiz WHERE id = ?");
    $checkStmt->execute([$quiz_id]);
    if ($checkStmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Quiz not found."]);
        exit();
    }

    $stmt = $pdo->prepare("DELETE FROM quiz WHERE id = ?");
    $stmt->execute([$quiz_id]);

    http_response_code(200);
    echo json_encode(["success" => "Quiz deleted successfully!"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
}
?>
