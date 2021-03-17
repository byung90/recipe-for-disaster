// Call spoonacular API to get recipe detail. https://spoonacular.com/food-api/docs#Get-Recipe-Information
let request = new XMLHttpRequest();
request.open("GET", "https://spoonacular.com/food-api/docs#Get-Recipe-Information");
request.send();
request.onload = () => {
    console.log(request);
    if (request.status === 200) {
        console.log(request.response);
    } else {
        console.log('error ${request.status} ${request.statusText}')
    }
}

