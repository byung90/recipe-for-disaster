var url = " https://api.spoonacular.com/";
// var apikey = "54f9d0ffffd344e6907e1cb3683f501c";
var apikey = "7eba54b90be749259b03f159287e801b";
var apiOffsetCount = JSON.parse(localStorage.getItem('apiOffsetCount'));

let backgroundImageObject = JSON.parse(localStorage.getItem('recipeForDisasterLocalImage'));
let recipeList = JSON.parse(localStorage.getItem('searchedRecipies'));
let searchCriteria = JSON.parse(localStorage.getItem('searchCriteria'));

// Display recipe cards function
function displayRecipeCards(recipeList) {
  let recipeListContainerEl = $(".recipe-list-container");

  $(recipeList).each(function (index) {
    if (index % 4 === 0) {
      recipeListContainerEl.append('<div class="grid-x align-justify" style="width: 100%"></div>')
    }
    recipeListContainerEl.children('.grid-x').last().append('<div class="cell card recipe-card"><a href="./recipe_detail.html?' + recipeList[index].id + '"><div class="image-container"><img src="' + recipeList[index].image + '" alt="' + recipeList[index].title + '"></div><div class="card-section recipe-info"><h3>' + recipeList[index].title + '</h3><p>' + recipeList[index].calories + '</p><p>' + recipeList[index].protein + '</p><p>' + recipeList[index].fat + '</p></div></a></div>');
  });

  if (recipeListContainerEl.children('.grid-x').last().children().length !== 4) {
    let gridLength = recipeListContainerEl.children('.grid-x').last().children().length;
    let gapCount = 4 - gridLength;
    for (let i = 0; i < gapCount; i++) {
      console.log(i);
      recipeListContainerEl.children('.grid-x').last().append('<div class="cell card fill-card"></div>');
    }
  }
}

//Search for recipe and store to local data
function searchRecipe(searchCriterias) {
  let ingredients = searchCriterias.ingredients.toString();
  let cuisines = searchCriterias.cuisines.toString();
  let diet = searchCriterias.diet.toString();
  let allergies = searchCriterias.allergies.toString();
  let newList = [];
  apiOffsetCount += 10;
  localStorage.setItem("apiOffsetCount", JSON.stringify(apiOffsetCount));
  console.log(apiOffsetCount);

  fetch(url + "recipes/complexSearch?apiKey=" + apikey + "&cuisine=" + cuisines + "&diet=" + diet + "&intolerances=" + allergies + "&includeIngreients=" + ingredients + "&includeIngreients=10&sort=popularity&sortDirection=asc&minFat=0&minProtein=0&minCalories=0&instructionsRequired=true&offset=" + apiOffsetCount)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      $(data.results).each(function (index) {
        let recipe = {
          id: "",
          title: "",
          image: "",
          fat: "",
          protein: "",
          calories: ""
        };
        recipe.id = data.results[index].id;
        recipe.title = data.results[index].title;
        recipe.image = data.results[index].image;
        recipe.calories = data.results[index].nutrition.nutrients[0].amount +
          data.results[index].nutrition.nutrients[0].unit;
        recipe.protein = data.results[index].nutrition.nutrients[1].amount +
          data.results[index].nutrition.nutrients[1].unit;
        recipe.fat = data.results[index].nutrition.nutrients[2].amount +
          data.results[index].nutrition.nutrients[2].unit;
        newList.push(recipe);
        recipeList.push(recipe);
      });
      localStorage.setItem("searchedRecipies", JSON.stringify(recipeList));
      displayRecipeCards(newList);
    })
}

displayRecipeCards(recipeList);

// Set background image
$("#background-image").attr("src", backgroundImageObject.image);
$("#background-image").attr("alt", backgroundImageObject.alt);
$("#background-image").attr("style", 'height:' + $("body").height() + 'px');

$('.load-more').on("click", function (e) {
  e.preventDefault();
  searchRecipe(searchCriteria);
});