<?php
include "../includes/db.php";
session_start();

if (!isset($_SESSION["username"]) || !isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "error" => "Unauthorized access."]);
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!isset($data['quiz_id'], $data['score'])) {
    echo json_encode(["success" => false, "error" => "Invalid input data."]);
    exit();
}

$quiz_id = (int)$data['quiz_id'];
$user_id = (int)$_SESSION["user_id"];
$new_score = (int)$data['score'];

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        SELECT max_score 
        FROM scores 
        WHERE id_quiz = :quiz_id AND id_user = :user_id
    ");
    $stmt->execute([
        ':quiz_id' => $quiz_id,
        ':user_id' => $user_id,
    ]);

    $existing_score = $stmt->fetchColumn();

    if ($existing_score !== false) {
        if ($new_score > $existing_score) {
            $updateStmt = $pdo->prepare("
                UPDATE scores 
                SET max_score = :score, date = NOW() 
                WHERE id_quiz = :quiz_id AND id_user = :user_id
            ");
            $updateStmt->execute([
                ':score' => $new_score,
                ':quiz_id' => $quiz_id,
                ':user_id' => $user_id,
            ]);
            $pdo->commit();
            echo json_encode(["success" => true, "message" => "Score updated!"]);
        } else {
            echo json_encode(["success" => false, "message" => "New score is not higher than the existing score."]);
        }
    } else {
        $insertStmt = $pdo->prepare("
            INSERT INTO scores (id_quiz, id_user, max_score, date)
            VALUES (:quiz_id, :user_id, :score, NOW())
        ");
        $insertStmt->execute([
            ':quiz_id' => $quiz_id,
            ':user_id' => $user_id,
            ':score' => $new_score,
        ]);
        $pdo->commit();
        echo json_encode(["success" => true, "message" => "New score added!"]);
    }
} catch (Exception $e) {
    $pdo->rollBack();
    error_log("Error updating score: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "An unexpected error occurred."]);
}
?>
