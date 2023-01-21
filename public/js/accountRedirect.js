    // Logout redirect
    function Logout(){
        window.location.href = `${baseUrl}/api/logout`;
        return;
    }
    let logoutButton = document.getElementById("logoutButton");
    logoutButton.addEventListener("click", Logout);

    // Homepage redirect
    function BackToHomepage(){
        window.location.href = `${baseUrl}/interface/hospitalFeed`;
        return;
    }
    let homeButton = document.getElementById("homeButton");
    homeButton.addEventListener("click", BackToHomepage);