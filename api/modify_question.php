<?php
include "../includes/db.php";
session_start();

header("Content-Type: application/json");


if (!isset($_SESSION["username"]) || !isset($_SESSION["user_id"])) {
    echo json_encode(["error" => "You must be logged in to access this quiz."]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $question = trim($_POST["Question"]);
    $answer_1 = trim($_POST["answer1"]);
    $answer_2 = trim($_POST["answer2"]);
    $answer_3 = trim($_POST["answer3"]);
    $answer_4 = trim($_POST["answer4"]);
    $correct_answer = isset($_POST["correctAnswer"]) ? (int)$_POST["correctAnswer"] : null;
    $question_id = trim($_POST["question_id"]);;


    if (empty($question) || empty($answer_1) || empty($answer_2) || empty($answer_3) || empty($answer_4) || empty($correct_answer) || empty($question_id)) {
        echo json_encode(["error" => "All fields are required"]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("UPDATE questions SET question = ?, answer_1 = ?, answer_2 = ?, answer_3 = ?, answer_4 = ?, correct_answer = ? WHERE id = ?");
        $stmt->execute([$question, $answer_1, $answer_2, $answer_3, $answer_4, $correct_answer, $question_id]);


        echo json_encode(["success" => "Question updated successfully!"]);
    } catch (Exception $e) {
        echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
    }
}
?>
