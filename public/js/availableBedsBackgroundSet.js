// Change background color for all available bed divs
    let availableBedsDivs = document.querySelectorAll(".availableBedsBar");
    let maxBedsDivs = document.querySelectorAll(".maxBedsBar");

    for (let i = 0; i < availableBedsDivs.length; i++){
        let availableBedsValue = parseInt(availableBedsDivs[i].innerText);
        let maxBedsValue = parseInt(maxBedsDivs[i].innerText);

        let colorPercentage = availableBedsValue / maxBedsValue;

        if (colorPercentage <= 0.5){
            colorPercentage = colorPercentage / 0.5;
            availableBedsDivs[i].style.backgroundColor = `rgb(${Math.round(228 + (21 * colorPercentage))}, ${Math.round(94 + (99 * colorPercentage))}, ${Math.round(45 + (8 * colorPercentage))}`;
        } else {
            colorPercentage = (colorPercentage - 0.5) / 0.5;
            availableBedsDivs[i].style.backgroundColor = `rgb(${Math.round(249 + (152 * -1 * colorPercentage))}, ${Math.round(193 + (31 * colorPercentage))}, ${Math.round(53 + (65 * colorPercentage))}`;
        }
    }