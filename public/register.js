const register = document.getElementById("register-me");
    const registerForm = document.getElementById("register-form");
// need to fix - event fires at second click only - why???
register.addEventListener("click", function() {
    console.log("click");
    const loginMe = document.getElementById("login-me");
    if (registerForm.style.display === "none") {
      registerForm.style.display = "block";
      loginMe.style.display = "none";
    } else {
      registerForm.style.display = "none";
      loginMe.style.display = "block";
    }
});

const arrow = document.getElementById("arrow");

arrow.addEventListener("mouseover", function() {
    const infoBox = document.getElementById("info-box");
  document.body.classList.add('moveInfo');
});

arrow.addEventListener("mouseout", function() {
    const infoBox = document.getElementById("info-box");
  document.body.classList.remove('moveInfo');
});
