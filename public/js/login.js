$(function(){
    const baseUrl = window.location.origin;

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

    let passwordErrors = [];
    function hasUppercase(str){
        return (/[A-Z]/.test(str));
    }
    function hasLowerCase(str){
        return (/[a-z]/.test(str));
    }
    function hasSpecialChar(str){
        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        return specialChars.test(str);
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
