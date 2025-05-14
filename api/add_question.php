<?php
include "../includes/db.php";
session_start();

header("Content-Type: application/json");


if (!isset($_SESSION["username"]) || !isset($_SESSION["user_id"])) {
    echo json_encode(["error" => "You must be logged in to access this quiz."]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $question = trim($_POST["question"]);
    $answer_1 = trim($_POST["answer1"]);
    $answer_2 = trim($_POST["answer2"]);
    $answer_3 = trim($_POST["answer3"]);
    $answer_4 = trim($_POST["answer4"]);
    $correct_answer = isset($_POST["correctAnswer"]) ? (int)$_POST["correctAnswer"] : null;
    $quiz_id = (int)$_POST["quiz_id"];

    if (empty($quiz_id) || empty($question) || empty($answer_1) || empty($answer_2) || empty($answer_3) || empty($answer_4) || 
        $correct_answer === null || $correct_answer < 1 || $correct_answer > 4
    ) {
        echo json_encode(["error" => "All fields are required and the correct answer must be between 1 and 4!"]);
        exit();
    }

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("SELECT question FROM questions WHERE quiz_id = ? AND question = ?");
        $stmt->execute([$quiz_id,$question]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["error" => "Question already exists!"]);
            exit();
        }

        $stmt = $pdo->prepare("INSERT INTO questions (question, answer_1, answer_2, answer_3, answer_4, correct_answer, quiz_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$question, $answer_1, $answer_2, $answer_3, $answer_4, $correct_answer, $quiz_id]);

        $pdo->commit();

        echo json_encode(["success" => "Question added successfully!"]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
    }
}
?>
