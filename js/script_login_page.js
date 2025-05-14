const btnLogin = document.getElementById("loginBtn");
const btnSignup = document.getElementById("signupBtn");
const formLogin = document.getElementById("loginForm");
const formSignup = document.getElementById("signupForm");

btnLogin.addEventListener("click", btnLoginHandler);
function btnLoginHandler() {
  formLogin.style.display = "flex";
  formSignup.style.display = "none";
  btnLogin.style.backgroundColor = "white";
  btnSignup.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
}
btnSignup.addEventListener("click", btnSignupHandler);
function btnSignupHandler() {
  formSignup.style.display = "flex";
  formLogin.style.display = "none";
  btnSignup.style.backgroundColor = "white";
  btnLogin.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
}
document
  .getElementById("signupForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    let formData = new FormData(this);

    try {
      let response = await fetch("auth/signup.php", {
        method: "POST",
        body: formData,
      });

      let result = await response.json();

      if (result.success) {
        alert(result.success);
        window.location.href = "./index.html";
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    }
  });
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    let formData = new FormData(this);

    try {
      let response = await fetch("auth/login.php", {
        method: "POST",
        body: formData,
      });

      let result = await response.json();

      if (result.success) {
        window.location.href = result.redirect;
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    }
  });
