<?php
include "../includes/db.php";
session_start();

header("Content-Type: application/json");

if (!isset($_SESSION["username"]) || !isset($_SESSION["user_id"])) {
    echo json_encode(["error" => "You must be logged in to access this quiz."]);
    exit();
}

if (!isset($_GET['quiz_id'])) {
    echo json_encode(["success" => false, "error" => "Invalid input data."]);
    exit();
}

$quiz_id = (int)$_GET['quiz_id'];

try {
    $stmt = $pdo->prepare("
        SELECT id,
            ROW_NUMBER() OVER (ORDER BY id) AS row_number, 
            question, 
            answer_1, 
            answer_2, 
            answer_3, 
            answer_4, 
            correct_answer 
        FROM questions 
        WHERE quiz_id = :quiz_id
    ");
    $stmt->bindParam(':quiz_id', $quiz_id, PDO::PARAM_INT);
    $stmt->execute();

    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);


    echo json_encode([
        "success" => true,
        "questions" => $questions
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => "An error occurred while fetching questions.", "details" => $e->getMessage()]);
}
?>
