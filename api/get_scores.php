<?php
include "../includes/db.php";
session_start();

header("Content-Type: application/json");

// Check if the user is logged in
if (!isset($_SESSION["username"]) || !isset($_SESSION["user_id"])) {
    echo json_encode(["error" => "You must be logged in to access this quiz."]);
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!isset($data['quiz_id']) || !is_numeric($data['quiz_id'])) {
    echo json_encode(["success" => false, "error" => "Invalid input data."]);
    exit();
}

$quiz_id = (int)$data['quiz_id'];

try {
    $stmt = $pdo->prepare("
        SELECT 
            ROW_NUMBER() OVER (ORDER BY scores.max_score DESC) AS row_number, 
            users.username, 
            scores.max_score, 
            DATE_FORMAT(scores.date, '%Y-%m-%d %H:%i:%s') AS score_date 
        FROM scores 
        INNER JOIN users ON scores.id_user = users.id 
        WHERE scores.id_quiz = :quiz_id 
        ORDER BY scores.max_score DESC, scores.date ASC
        LIMIT 25
    ");
    $stmt->bindParam(':quiz_id', $quiz_id, PDO::PARAM_INT);
    $stmt->execute();

    $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $pdo->prepare("SELECT quiz_name FROM quiz WHERE id = :quiz_id");
    $stmt->bindParam(':quiz_id', $quiz_id, PDO::PARAM_INT);
    $stmt->execute();

    $quiz = $stmt->fetch(PDO::FETCH_ASSOC);


    echo json_encode([
        "scores" => $scores,
        "quiz_name" => $quiz['quiz_name']
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => "An error occurred while fetching quiz scores."]);
}
?>
