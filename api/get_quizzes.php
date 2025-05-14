<?php
include "../includes/db.php";
session_start();

header("Content-Type: application/json");

if (!isset($_SESSION["username"]) || !isset($_SESSION["user_id"])) {
    echo json_encode(["error" => "You must be logged in to access this quiz."]);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM quiz");
    $stmt->execute();

    $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($quizzes)) {
        echo json_encode(["error" => "No quizzes found."]);
        exit();
    }

    echo json_encode([
        "quizzes" => $quizzes
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => "An error occurred while fetching quizzes."]);
}
?>
