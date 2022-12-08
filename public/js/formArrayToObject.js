// Function to convert form data to an object
function formArrayToObject(values){
    const jsonObj = {};
    for (const v of values){
        jsonObj[v.name] = v.value;
    }
    return jsonObj;
}