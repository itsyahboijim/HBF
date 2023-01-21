// Search feature
let searchHospitals = document.querySelectorAll(".hospitalBox");
let searchBar = document.getElementById("searchBar");
searchBar.value = "";
searchBar.addEventListener("input", e => {
    let value = e.target.value.toLowerCase();
    searchHospitals.forEach(searchHospital => {
        let name = searchHospital.children[0].innerText.toLowerCase();
        let address = searchHospital.children[1].children[0].children[0].innerText.toLowerCase().replaceAll(",", "");
        let maxBeds = parseInt(searchHospital.children[1].children[1].children[0].innerText);
        let availableBeds = parseInt(searchHospital.children[1].children[1].children[1].innerText);

        let match = name.includes(value) || address.includes(value) || maxBeds >= parseInt(value) || availableBeds >= parseInt(value);
        searchHospital.classList.toggle("hide", !match);
    });
});