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
    $question = trim($_POST["question"]);
    $answer_1 = trim($_POST["answer1"]);
    $answer_2 = trim($_POST["answer2"]);
    $answer_3 = trim($_POST["answer3"]);
    $answer_4 = trim($_POST["answer4"]);
    $correct_answer = isset($_POST["correctAnswer"]) ? (int)$_POST["correctAnswer"] : null;

    if (
        empty($quiz_name) || empty($quiz_category) || empty($question) ||
        empty($answer_1) || empty($answer_2) || empty($answer_3) || empty($answer_4) || 
        $correct_answer === null || $correct_answer < 1 || $correct_answer > 4
    ) {
        echo json_encode(["error" => "All fields are required and the correct answer must be between 1 and 4!"]);
        exit();
    }

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("SELECT id FROM quiz WHERE quiz_name = ? AND category = ?");
        $stmt->execute([$quiz_name, $quiz_category]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["error" => "A quiz with this name and category already exists!"]);
            exit();
        }

        $stmt = $pdo->prepare("INSERT INTO quiz (quiz_name, category) VALUES (?, ?)");
        $stmt->execute([$quiz_name, $quiz_category]);

        $quiz_id = $pdo->lastInsertId();

        $stmt = $pdo->prepare("INSERT INTO questions (question, answer_1, answer_2, answer_3, answer_4, correct_answer, quiz_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$question, $answer_1, $answer_2, $answer_3, $answer_4, $correct_answer, $quiz_id]);

        $pdo->commit();

        echo json_encode(["success" => "Quiz and question added successfully!"]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
    }
}
?>
