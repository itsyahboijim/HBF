$(document).ready(function(){
    const baseUrl = window.location.origin;

    // Event listener for sign in
    document.getElementById("loginButton").addEventListener("click", async () => {
        const formData = formArrayToObject($("#loginForm").serializeArray());
        const res = await fetch(baseUrl + "/api/login", {
            method: "post",
            body: JSON.stringify(formData),
            mode: "cors",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        });
        const resBody = await res.json();
        if (resBody.success){
            window.location.href = `${baseUrl}/interface/account`;
            return;
        }
        document.getElementById("loginError").innerText = resBody.error;
    });

    // Event listener for sign up (NOT DONE)
    document.getElementById("signUpButton").addEventListener("click", async() => {
        const formData = formArrayToObject($("#signUpForm").serializeArray());
        const res = await fetch(baseUrl + "/api/register", {
            method: "post",
            body: JSON.stringify(formData),
            mode: "cors",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        });
        const resBody = await res.json();
        if (resBody.success){
            window.location.href = `${baseUrl}/interface/account`;
            return;
        }
        document.getElementById("signUpError").innerText = resBody.error;
    });
});
