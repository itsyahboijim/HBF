// "No hospitals found" display
let noHospitalsIndicator = document.getElementById("noHospitalsText");
let hospitalsDiv = document.getElementById("hospitalsDiv");
let mutationObserver = new MutationObserver(mutation => {
    let hospitals = document.querySelectorAll(".hospitalBox");
    let hiddenHospitals = document.querySelectorAll(".hospitalBox.hide");
    console.log("Hospitals length: " + hospitals.length);
    console.log("Hidden length: " + hiddenHospitals.length);
    if (hospitals.length != hiddenHospitals.length){
        noHospitalsIndicator.classList.toggle("hide", true);
    }
    else {
        noHospitalsIndicator.classList.toggle("hide", false);
    }
});

mutationObserver.observe(hospitalsDiv, {
    subtree: true,
    childList: true,
    attributes: true,
});