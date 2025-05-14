<?php
session_start();
include "../includes/db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"]);
    $password = $_POST["password"];

    if (empty($username) || empty($password)) {
        echo json_encode(["error" => "All fields are required!"]);
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user["password"])) {
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["username"] = $user["username"];

        echo json_encode(["success" => "Login successful!", "redirect" => "./pages/quizzes_page.php?page=1"]);
        exit();
    } else {
        echo json_encode(["error" => "Username or password is incorrect."]);
        exit();
    }
}
?>
