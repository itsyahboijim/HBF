// Dynamic hospital update feature
function UpdateHospital(e){
    console.log(`Update received: ${e.data}`);
    const hospitalData = JSON.parse(e.data);

    let mode = hospitalData.mode;
    switch(mode){
        case "update":{
            let availableHospitalBedBar = document.getElementById(`${hospitalData._id}_availableBedsBar`);
            let maxHospitalBed = document.getElementById(`${hospitalData._id}_maxBeds`);
            let availableHospitalBed = document.getElementById(`${hospitalData._id}_availableBeds`);

            let newValue = parseInt(availableHospitalBed.innerText) + hospitalData.changeValue;
            let colorPercentage = newValue / parseInt(maxHospitalBed.innerText);
            
            // Red to Yellow range (inclusive to 50%)
            if (colorPercentage <= 0.5){
                colorPercentage = colorPercentage / 0.5;
                availableHospitalBedBar.style.backgroundColor = `rgb(${Math.round(228 + (21 * colorPercentage))}, ${Math.round(94 + (99 * colorPercentage))}, ${Math.round(45 + (8 * colorPercentage))}`;
            } else {
                colorPercentage = (colorPercentage - 0.5) / 0.5;
                availableHospitalBedBar.style.backgroundColor = `rgb(${Math.round(249 + (152 * -1 * colorPercentage))}, ${Math.round(193 + (31 * colorPercentage))}, ${Math.round(53 + (65 * colorPercentage))}`;
            }

            availableHospitalBed.innerText = parseInt(availableHospitalBed.innerText) + hospitalData.changeValue;
            
            break;
        }

        case "add": {
            // Create new hospital box
            let newHospitalBox = document.createElement('div');
            newHospitalBox.classList.add("hospitalBox");

            // Create new hospital identifier
            let newHospitalIdentifier = document.createElement('div');
            newHospitalIdentifier.classList.add("hospitalIdentifier", "hospitalFont");
            newHospitalIdentifier.id = `${hospitalData._id}_image`;
            newHospitalIdentifier.style.backgroundImage = `url(${hospitalData.image})`;

            let newHospitalNameDiv = document.createElement('div');
            newHospitalNameDiv.classList.add("hospitalName");
            let newHospitalName = document.createElement('p');
            newHospitalName.id = `${hospitalData._id}_name`;
            newHospitalName.classList.add("whiteText");
            newHospitalName.innerText = hospitalData.name;
        
            newHospitalNameDiv.appendChild(newHospitalName);
            newHospitalIdentifier.appendChild(newHospitalNameDiv);
            newHospitalBox.appendChild(newHospitalIdentifier);

            // Create new hospital details
            let newHospitalDetails = document.createElement('div');
            newHospitalDetails.classList.add("hospitalDetails");

            // Address and contact
            let detailsList = document.createElement('ul');
            detailsList.classList.add("detailsList", "hospitalFont");
            let detailsListAddress = document.createElement('li');
            detailsListAddress.id = `${hospitalData._id}_location`;
            let detailsListContact = document.createElement('li');
            detailsListContact.id = `${hospitalData._id}_contactNum`;
            
            let detailstListAddressImage = document.createElement('img');
            detailstListAddressImage.src = "/images/location.png";
            detailstListAddressImage.alt = "Location";
            let detailsListAddressText = document.createTextNode(hospitalData.location);
            detailsListAddress.appendChild(detailstListAddressImage);
            detailsListAddress.appendChild(detailsListAddressText);
            
            let detailsListContactImage = document.createElement('img');
            detailsListContactImage.src = "/images/contactNum.png";
            detailsListContactImage.alt = "Contact Number";
            let detailsListContactText = document.createTextNode(hospitalData.contactNum);
            detailsListContact.appendChild(detailsListContactImage);
            detailsListContact.appendChild(detailsListContactText);

            detailsList.appendChild(detailsListAddress);
            detailsList.appendChild(detailsListContact);

            // Beds list
            let bedsList = document.createElement('ul');
            bedsList.classList.add("bedsList");

            let maxBedsBar = document.createElement('li');
            maxBedsBar.classList.add("maxBedsBar");
            
            let maxBedsImageDiv = document.createElement('div');
            let maxBedsImage = document.createElement('img');
            maxBedsImage.src = "/images/maxBeds.png";
            maxBedsImage.alt = "Max Beds";

            let maxBedsCountDiv = document.createElement('div');
            let maxBedsCount = document.createElement('span');
            maxBedsCount.id = `${hospitalData._id}_maxBeds`;
            maxBedsCount.innerText = hospitalData.maxBeds;

            maxBedsImageDiv.appendChild(maxBedsImage);
            maxBedsCountDiv.appendChild(maxBedsCount);
            maxBedsBar.appendChild(maxBedsImageDiv);
            maxBedsBar.appendChild(maxBedsCountDiv);

            let availableBedsBar = document.createElement('li');
            availableBedsBar.id = `${hospitalData._id}_availableBedsBar`;
            availableBedsBar.classList.add("availableBedsBar");

            let colorPercentage = hospitalData.availableBeds / hospitalData.maxBeds;
            if (colorPercentage <= 0.5){
                colorPercentage = colorPercentage / 0.5;
                availableBedsBar.style.backgroundColor = `rgb(${Math.round(228 + (21 * colorPercentage))}, ${Math.round(94 + (99 * colorPercentage))}, ${Math.round(45 + (8 * colorPercentage))}`;
            } else {
                colorPercentage = (colorPercentage - 0.5) / 0.5;
                availableBedsBar.style.backgroundColor = `rgb(${Math.round(249 + (152 * -1 * colorPercentage))}, ${Math.round(193 + (31 * colorPercentage))}, ${Math.round(53 + (65 * colorPercentage))}`;
            }

            let availableBedsImageDiv = document.createElement('div');
            let availableBedsImage = document.createElement('img');
            availableBedsImage.src = "/images/availableBeds.png";
            availableBedsImage.alt = "Available Beds";

            let availableBedsCountDiv = document.createElement('div');
            let availableBedsCount = document.createElement('span');
            availableBedsCount.id = `${hospitalData._id}_availableBeds`;
            availableBedsCount.innerText = hospitalData.availableBeds;

            availableBedsImageDiv.appendChild(availableBedsImage);
            availableBedsCountDiv.appendChild(availableBedsCount);
            availableBedsBar.appendChild(availableBedsImageDiv);
            availableBedsBar.appendChild(availableBedsCountDiv);

            bedsList.appendChild(maxBedsBar);
            bedsList.appendChild(availableBedsBar);

            newHospitalDetails.appendChild(detailsList);
            newHospitalDetails.appendChild(bedsList);
            newHospitalBox.appendChild(newHospitalDetails);

            // Append to list of hospitals
            let hospitalsDiv = document.getElementById("hospitalsDiv");
            hospitalsDiv.appendChild(newHospitalBox);
            searchHospitals = document.querySelectorAll(".hospitalBox");

            break;
        }

        case "edit": {
            for (let key in hospitalData){
                if (key == "availableBeds"){
                    let availableHospitalBedBar = document.getElementById(`${hospitalData._id}_availableBedsBar`);
                    let maxHospitalBed = document.getElementById(`${hospitalData._id}_maxBeds`);
                    
                    maxBedValue = hospitalData.maxBeds ? hospitalData.maxBeds : parseInt(maxHospitalBed.innerText);
                    let colorPercentage = hospitalData[key] / maxBedValue;
                    
                    // Red to Yellow range (inclusive to 50%)
                    if (colorPercentage <= 0.5){
                        colorPercentage = colorPercentage / 0.5;
                        availableHospitalBedBar.style.backgroundColor = `rgb(${Math.round(228 + (21 * colorPercentage))}, ${Math.round(94 + (99 * colorPercentage))}, ${Math.round(45 + (8 * colorPercentage))}`;
                    } else {
                        colorPercentage = (colorPercentage - 0.5) / 0.5;
                        availableHospitalBedBar.style.backgroundColor = `rgb(${Math.round(249 + (152 * -1 * colorPercentage))}, ${Math.round(193 + (31 * colorPercentage))}, ${Math.round(53 + (65 * colorPercentage))}`;
                    }
                }
                else if (key == "maxBeds"){
                    let availableHospitalBedBar = document.getElementById(`${hospitalData._id}_availableBedsBar`);
                    let availableHospitalBed = document.getElementById(`${hospitalData._id}_availableBeds`);
                    
                    availableBedValue = parseInt(availableHospitalBed.innerText);
                    let colorPercentage = availableBedValue / hospitalData[key];
                    
                    // Red to Yellow range (inclusive to 50%)
                    if (colorPercentage <= 0.5){
                        colorPercentage = colorPercentage / 0.5;
                        availableHospitalBedBar.style.backgroundColor = `rgb(${Math.round(228 + (21 * colorPercentage))}, ${Math.round(94 + (99 * colorPercentage))}, ${Math.round(45 + (8 * colorPercentage))}`;
                    } else {
                        colorPercentage = (colorPercentage - 0.5) / 0.5;
                        availableHospitalBedBar.style.backgroundColor = `rgb(${Math.round(249 + (152 * -1 * colorPercentage))}, ${Math.round(193 + (31 * colorPercentage))}, ${Math.round(53 + (65 * colorPercentage))}`;
                    }
                }

                let targetElement = document.getElementById(`${hospitalData._id}_${key}`);
                if (targetElement){
                    targetElement.innerText = hospitalData[key];
                }
            }

            break;
        }

        case "image": {
            document.getElementById(`${hospitalData._id}_image`).style.backgroundImage = `url(${hospitalData.image})`;

            break;
        }
    }

    return;
}

let hospitalSource = new EventSource(`${baseUrl}/api/streamHospitalUpdates`);
hospitalSource.onmessage = UpdateHospital;