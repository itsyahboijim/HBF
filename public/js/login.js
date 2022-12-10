$(function(){
    const baseUrl = window.location.origin;
    document.getElementById("loginForm").reset();
    document.getElementById("signUpForm").reset();

    // Event listener for sign in
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        
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

    let signUpEmailError = document.getElementById("emailError");
    function checkEmail(e){
        if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(e.target.value)){
            signUpEmailError.innerText = "";
        }
        else {
            signUpEmailError.innerText = "Please enter a valid email address.";
        }
    }
    document.getElementById("signUpEmail").addEventListener("input", checkEmail);
    
    let passwordErrors = [];
    function hasUppercase(str){
        return (/[A-Z]/.test(str));
    }
    function hasLowerCase(str){
        return (/[a-z]/.test(str));
    }
    function hasSpecialChar(str){
        return (/[^a-zA-Z0-9]/.test(str));
    }
    function checkPassword(e){
        $("#passwordErrors").empty();

        passwordErrors = [];
        if (e.target.textLength < 8){
            passwordErrors.push("Password must be longer than 8 characters.");
        }
        if (!hasUppercase(e.target.value)){
            passwordErrors.push("Password must have at least one uppercase character.");
        }
        if (!hasLowerCase(e.target.value)){
            passwordErrors.push("Password must have at least one lowercase character.");
        }
        if (!hasSpecialChar(e.target.value)){
            passwordErrors.push("Password must have at least one special character.");
        }

        let passwordErrorList = document.getElementById("passwordErrors");
        for (let error of passwordErrors){
            let li = document.createElement("li");
            li.appendChild(document.createTextNode(error));
            passwordErrorList.appendChild(li);
        }
    }
    document.getElementById("signUpPassword").addEventListener("input", checkPassword);

    document.getElementById("signUpForm").addEventListener("submit", async(e) => {
        e.preventDefault();

        if (passwordErrors.length > 0) return;
        if (signUpEmailError.innerText != "") return;
        
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