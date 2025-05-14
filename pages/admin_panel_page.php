<?php
include "../includes/db.php";
session_start();
if (!isset($_SESSION["username"]) && !isset($_SESSION["user_id"])) {
    header("Location: ../index.html");
    exit();
}

?>
<!DOCTYPE html>
<html lang="sr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Main page</title>
    <link rel="stylesheet" href="../assets/css/style.css" />
    <link rel="stylesheet" href="../assets/css/style_admin_panel_page.css" />
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
            echo '<div class="navbarOption"><a href="#">ADMIN PANEL</a></div>';
        }
        ?>
        <div class="navbarOption"><a href="../auth/logout.php">LOG OUT</a></div>
      </div>
    </div>
    <div id="mainContainer">
    <div id="btnContainer">
            <div id="quizBtn">QUIZZES</div>
            <div id="userBtn">USERS</div>
        </div>
        <div id="adminContainer">
        <div id="quizBoxNewQuiz">
            <span class="quizName">New Quiz</span>
            <button id="addNewQuiz" >+</button>
          </div>
          
        </div>
    </div>
    
    <div id="footer">Copyright &copy 2025 - Milan Popovic ITS 13/23</div>
    </div>
    <div id="popupBackground">
      <div id="popup">
      <button class="exitPopupButton" id="exitSmallPopup">X</button>
        <div id="popupContainer"></div>
      </div>
      <div id="bigPopup">
      <button class="exitPopupButton" id="exitBigPopup">X</button>
      <div id="bigPopupContainer"></div>
      </div></div>
    <script src="../js/script.js"></script>
    <script type="module" src="../js/script_admin_panel_page.js"></script>
    
  </body>
</html>
