let main = document.getElementById("mainSection");
let signUpForm = document.getElementById("signUpFormWrapper");
let loginForm = document.getElementById("loginFormWrapper");

loginForm.classList.toggle("hide", false);
main.style.width = "25%";
signUpForm.classList.toggle("hide", true);

document.getElementById("signUpClick").addEventListener("click", e => {
    loginForm.classList.toggle("hide", true);
    main.style.width = "40%";
    signUpForm.classList.toggle("hide", false);
});

document.getElementById("loginClick").addEventListener("click", e => {
    loginForm.classList.toggle("hide", false);
    main.style.width = "25%";
    signUpForm.classList.toggle("hide", true);
});