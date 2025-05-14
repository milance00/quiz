<?php
include "../includes/db.php";
session_start();

header("Content-Type: application/json");

if (!isset($_SESSION["username"]) || !isset($_SESSION["user_id"])) {
    echo json_encode(["error" => "You must be logged in to access this quiz."]);
    exit();
}

if (!isset($_GET['quiz_id']) || !is_numeric($_GET['quiz_id'])) {
    echo json_encode(["error" => "No quiz selected."]);
    exit();
}

$quiz_id = (int)$_GET['quiz_id'];

try {
    $stmt = $pdo->prepare("
        SELECT id, question, answer_1, answer_2, answer_3, answer_4, correct_answer
        FROM questions
        WHERE quiz_id = :quiz_id
        ORDER BY RAND()
        LIMIT 20
    ");
    $stmt->bindParam(':quiz_id', $quiz_id, PDO::PARAM_INT);
    $stmt->execute();

    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($questions)) {
        echo json_encode(["error" => "No questions found for this quiz."]);
        exit();
    }

    echo json_encode([
        "questions" => $questions
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => "An error occurred while fetching quiz questions."]);
}
?>
