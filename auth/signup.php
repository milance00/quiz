<?php
include "../includes/db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"]);
    $email = trim($_POST["email"]);
    $password = $_POST["password"];
    $firstname = trim($_POST["firstname"]);
    $lastname = trim($_POST["lastname"]);
    $createdAt = date('Y-m-d H:i:s');

    if (empty($username) || empty($email) || empty($password) || empty($firstname) || empty($lastname)) {
        echo json_encode(["error" => "All fields are required!"]);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["error" => "Email address is not valid!"]);
        exit();
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? OR username = ?");
        $stmt->execute([$email, $username]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["error" => "A user with this username or email already exists!"]);
            exit();
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $pdo->beginTransaction();

        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, first_name, last_name, created_at) 
                               VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$username, $email, $hashedPassword, $firstname, $lastname, $createdAt]);

        $pdo->commit();

        echo json_encode(["success" => "Registration successful! Redirecting..."]);
        exit();
        
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["error" => "An error occurred: " . $e->getMessage()]);
        exit();
    }
}
?>
