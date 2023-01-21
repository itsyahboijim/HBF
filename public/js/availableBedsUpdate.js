// Available bed modification feature
document.getElementById("plusOneChangeBedBtn").addEventListener("click", e => {
    ChangeAvailableBeds('+');
});
document.getElementById("minusOneChangeBedBtn").addEventListener("click", e => {
    ChangeAvailableBeds('-');
});

document.getElementById("plusChangeBedBtn").addEventListener("click", e => {
    SubmitCustomBedCount('+');
});
document.getElementById("minusChangeBedBtn").addEventListener("click", e => {
    SubmitCustomBedCount('-');
});

let changeCounter = 0;
let requestTimer = null;
const maxBedCount = document.getElementById("hospitalMaxBeds");
const availableBedCount = document.getElementById("availableBedCount");
const customBedCount = document.getElementById("customBedCount");
const customBedCountError = document.getElementById("customBedCountError");
customBedCount.addEventListener("input", function(event){
    let inputValue = this.value;
    inputValue = inputValue.replace(/[^0-9\b]/g,"");
    this.value = inputValue;
});

function ChangeAvailableBeds(sign){
    if (parseInt(availableBedCount.innerText) + parseInt(`${sign}1`) > parseInt(maxBedCount.innerText)){
        if (customBedCountError.innerText == "") customBedCountError.innerText = "The availabled bed count cannot exceed the maximum bed count!";
        return;
    }
    else {
        if (customBedCountError.innerText != "") customBedCountError.innerText = "";
    }

    changeCounter += parseInt(`${sign}1`);
    availableBedCount.innerText = parseInt(availableBedCount.innerText) + parseInt(`${sign}1`);

    if (requestTimer == null){
        requestTimer = setTimeout(SubmitChangeRequest, 3000);
    }

    return;
}

function SubmitCustomBedCount(sign){
    if (!customBedCount.value){
        if (customBedCountError.innerText == "") customBedCountError.innerText = "Please enter a custom number to add/subtract to the bed count";
        return;
    }

    if (parseInt(availableBedCount.innerText) + parseInt(`${sign}${customBedCount.value}`) > parseInt(maxBedCount.innerText)){
        if (customBedCountError.innerText == "") customBedCountError.innerText = "The availabled bed count cannot exceed the maximum bed count!";
        return;
    }

    if (customBedCountError.innerText != "") customBedCountError.innerText = "";

    changeCounter += parseInt(`${sign}${customBedCount.value}`);
    availableBedCount.innerText = parseInt(availableBedCount.innerText) + parseInt(`${sign}${customBedCount.value}`);
    
    if (requestTimer == null){
        requestTimer = setTimeout(SubmitChangeRequest, 3000);
    }

    return;
}

async function SubmitChangeRequest(){
    const countObj = {changeValue: changeCounter};
    fetch(baseUrl + "/api/changeBedValue", {
        method: "post",
        body: JSON.stringify(countObj),
        mode: "cors",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
    });

    changeCounter = 0;
    clearTimeout(requestTimer);
    requestTimer = null;
    return;
}