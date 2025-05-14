<?php
include "../includes/db.php";
session_start();
if (!isset($_SESSION["username"]) && !isset($_SESSION["user_id"])) {
    header("Location: ../index.html");
    exit();
}

if (isset($_GET['page']) && is_numeric($_GET['page'])) {
  $currentPage = (int) $_GET['page'];
} else {
  $currentPage = 1; 
}

$stmt = $pdo->prepare("SELECT COUNT(*) AS total FROM quiz");
$stmt->execute();
$row = $stmt->fetch(PDO::FETCH_ASSOC);
$totalResults = $row['total'];

$resultsPerPage = 12;
$totalPages = ceil($totalResults / $resultsPerPage);
$startFrom = ($currentPage - 1) * $resultsPerPage;

$stmt = $pdo->prepare("SELECT q.id, q.quiz_name, q.category, 
      COALESCE(s.max_score, 0) AS max_score
      FROM quiz q
      LEFT JOIN scores s ON q.id = s.id_quiz AND s.id_user = :user_id
      LIMIT :startFrom, :resultsPerPage");
$stmt->bindParam(":startFrom", $startFrom, PDO::PARAM_INT);
$stmt->bindParam(":resultsPerPage", $resultsPerPage, PDO::PARAM_INT);
$stmt->bindParam(":user_id", $_SESSION["user_id"], PDO::PARAM_INT);
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
    <link rel="stylesheet" href="../assets/css/style_quizzes_page.css" />
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
      <div id="gameBoxContainer">
        <?php
            if (count($quizzes) > 0) {                            
              foreach ($quizzes as $quiz) {
              echo "<div class='gameBox' onclick=\"startGame(" . $quiz['id'] . ")\">";
              echo "<span>" . $quiz['quiz_name'] . "</span>";
              echo "<span>Category: " . $quiz['category'] . "</span>";
              echo "<span>Max score: " . $quiz['max_score'] . "/20</span>";
              echo "</div>";
          }
          } else {
            echo "No records found.";
          }
        ?>
      </div>
      <div id="paginationBox">
        <?php
        if ($currentPage > 1) {
          echo "<a href='?page=" . ($currentPage - 1) . "'>< </a>";
        }
        
        echo "<span>Page " . $currentPage . " of $totalPages</span>";
        
        if ($currentPage < $totalPages) {
          echo "<a href='?page=" . ($currentPage + 1) . "'> ></a>";
        }
        ?>
      </div> 
    </div>
    
    <div id="footer">Copyright &copy 2025 - Milan Popovic ITS 13/23</div>
    <script src="../js/script.js"></script>
    <script src="../js/script_quizzes_page.js"></script>
  </body>
</html>
