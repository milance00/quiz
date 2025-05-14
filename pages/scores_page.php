<?php
include "../includes/db.php";
session_start();
if (!isset($_SESSION["username"]) && !isset($_SESSION["user_id"])) {
    header("Location: ../index.html");
    exit();
}
$stmt = $pdo->prepare("SELECT * FROM quiz");
$stmt->execute();
$quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="sr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Main page</title>
    <link rel="stylesheet" href="../assets/css/style.css" />
    <link rel="stylesheet" href="../assets/css/style_scores_page.css" />
  </head>
  <body>
    <div id="navbar">
      <h1>Quiz</h1>
      <div id="menuButton" onclick="toggleMenu()">☰</div>
      <div id="navbarMenu">
      <div class="navbarOption"><a href="../pages/quizzes_page.php?page=1">QUIZZES</a></div>
        <div class="navbarOption"><a href="../pages/scores_page.php">SCORES</a></div>
        <?php
        $stmt = $pdo->prepare("SELECT admin FROM users WHERE id = ?");
        $stmt->execute([$_SESSION["user_id"]]); 
        $user = $stmt->fetch();

        if ($user && $user["admin"] == 1) {
            echo '<div class="navbarOption"><a href="../pages/admin_panel_page.php">ADMIN PANEL</a></div>';
        }
        ?>
        <div class="navbarOption"><a href="../auth/logout.php">LOG OUT</a></div>
      </div>
    </div>
    <div id="mainContainer">
        <div id="scoreContainer">
            <div id="quizSideBar">
            <?php
            if (count($quizzes) > 0) {                            
              foreach ($quizzes as $quiz) {
              echo "<div class='quizBox' onclick=\"showScores(" . $quiz['id'] . ")\">";
              echo "<span>" . $quiz['quiz_name'] . "</span>";
              echo "<span>Category: " . $quiz['category'] . "</span>";
              echo "</div>";
          }
          } else {
            echo "No records found.";
          }
        ?>
            </div>
            <div id="scoreBox">
                <table>

                </table>
            </div>
        </div>
    </div>
    
    <div id="footer">Copyright &copy 2025 - Milan Popovic ITS 13/23</div>
    <script src="../js/script.js"></script>
    <script src="../js/script_scores_page.js"></script>

  </body>
</html>
