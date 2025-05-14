<?php
include "../includes/db.php";
session_start();

header("Content-Type: application/json");


if (!isset($_SESSION["username"]) || !isset($_SESSION["user_id"])) {
    echo json_encode(["error" => "You must be logged in to access this quiz."]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $quiz_name = trim($_POST["quizName"]);
    $quiz_category = trim($_POST["quizCategory"]);
    $quiz_id = trim($_POST["quiz_id"]);

    if (empty($quiz_name) || empty($quiz_category) || empty($quiz_id)) {
        echo json_encode(["error" => "All fields are required"]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("UPDATE quiz SET quiz_name = ?, category = ? WHERE id = ?");
        $stmt->execute([$quiz_name, $quiz_category, $quiz_id]);


        echo json_encode(["success" => "Quiz updated successfully!"]);
    } catch (Exception $e) {
        echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
    }
}
?>
