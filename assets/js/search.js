$(document).foundation();

var url = " https://api.spoonacular.com/recipes/findByIngredients";
var apikey = "54f9d0ffffd344e6907e1cb3683f501c";

$(document).ready(function () {
console.log (1);
fetch(url + "?ingredients=apples,flour&apiKey=" + apikey)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
     console.log(data)

    })
}
)