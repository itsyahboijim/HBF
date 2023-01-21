// Edit image function
let imageInput = document.getElementById("imageInput");
imageInput.onchange = async function(){
    if(imageInput.value == "") return;

    const imageForm = document.getElementById("imageForm");
    const formData = new FormData(imageForm);
    const res = await fetch(baseUrl + "/api/editProfilePicture", {
        method: "post",
        body: formData,
        mode: "cors",
    });
    const resBody = await res.json();
    if (resBody.success){
        window.location.reload();
        return;
    }
}