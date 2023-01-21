// Edit account feature
document.getElementById("inputName").addEventListener("change", e => {
    e.target.value = e.target.value.trim();
});

document.getElementById("inputLocation").addEventListener("change", e => {
    e.target.value = e.target.value.trim();
});

const inputContact = document.getElementById("inputContactNum");
inputContact.addEventListener("input", function(event){
    let lastValue = inputContact.value;
    inputContact.value = lastValue.replace(/[^0-9\s\-\(\)\+]/g, "");
    if(inputContact.value.length > 16){
        inputContact.value = lastValue.substring(0,16);
    }
});

document.getElementById("inputMaxBeds").addEventListener("input", function(event){
    let inputValue = this.value;
    inputValue = inputValue.replace(/[^0-9\b]/g,'');
    this.value = inputValue;
});

let editInputs = document.querySelectorAll(".detailInputWrapper");
function hideInputs(hideBool){
    editInputs.forEach(input => {
        input.classList.toggle("hide", hideBool);
    });
}
hideInputs(true);

let details = document.querySelectorAll(".detailInfo");
function hideDetails(hideBool){
    details.forEach(detail => {
        detail.classList.toggle("hide", hideBool);
    });
}

function setDetailsToInputs(){
    for (let i = 0; i < editInputs.length; i++) {
        editInputs[i].children[0].value = details[i].innerText;
    }
}
setDetailsToInputs();

let errorList = document.querySelectorAll(".error");
const toggledButtons = document.getElementById("toggledButtonsWrapper");
toggledButtons.classList.toggle("hide", true);
const editButton = document.getElementById("editButton");
function toggleEdit(e){
    hideInputs(false);
    hideDetails(true);
    toggledButtons.classList.toggle("hide", false);
    e.target.classList.toggle("hide", true);
}
editButton.addEventListener("click", toggleEdit);

document.getElementById("cancelButton").addEventListener("click", e => {
    hideInputs(true);
    hideDetails(false);
    setDetailsToInputs();
    editButton.classList.toggle("hide", false);
    toggledButtons.classList.toggle("hide", true);
    errorList.forEach(error => {
        errorList.innerText = "";
    });
});

const editForm = document.getElementById("editForm");
document.getElementById("saveButton").addEventListener("click", async (e) => {
    const formData = new FormData(editForm);
    const res = await fetch(baseUrl + "/api/editProfile", {
        method: "post",
        body: JSON.stringify(Object.fromEntries(formData)),
        mode: "cors",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
    });
    const resBody = await res.json();
    if (resBody.success){
        window.location.reload();
        return;
    }

    let errorField = document.getElementById(`${resBody.field}Error`);
    errorField.innerText = resBody.error;
    return;
});