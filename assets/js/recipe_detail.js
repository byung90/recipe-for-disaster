// Call spoonacular API to get recipe detail. https://spoonacular.com/food-api/docs#Get-Recipe-Information
var apikey = "7eba54b90be749259b03f159287e801b";

fetch('https://spoonacular.com/food-api/docs#Get-Recipe-Information')
    .then(response => {
        return response.json();
    })
    .then(users => {
        console.log(users);
    });


