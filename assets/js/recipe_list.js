var url = " https://api.spoonacular.com/";
var apikey = "de4d428423dc4d72926835be0dc5a8e5";
var apiOffsetCount = JSON.parse(localStorage.getItem('apiOffsetCount'));

let backgroundImageObject = JSON.parse(localStorage.getItem('recipeForDisasterLocalImage'));
let recipeList = JSON.parse(localStorage.getItem('searchedRecipies'));
let searchCriteria = JSON.parse(localStorage.getItem('searchCriteria'));

// Display recipe cards function
function displayRecipeCards(recipeList) {
  let recipeListContainerEl = $(".recipe-list-container");

  if (recipeListContainerEl.children('.grid-x').last().children('.fill-card').length > 0) {
    recipeListContainerEl.children('.grid-x').last().children('.fill-card').remove();
  }

  $(recipeList).each(function (index) {


    if (recipeListContainerEl.children('.grid-x').last().children('.recipe-card').length === 4) {
      recipeListContainerEl.append('<div class="grid-x align-justify" style="width: 100%"></div>')
    }
    else if (recipeListContainerEl.children('.grid-x').last().children('.fill-card').length > 0) {
      recipeListContainerEl.children('.grid-x').last().children('.fill-card').remove();
    }
    recipeListContainerEl.children('.grid-x').last().append('<div class="cell card recipe-card"><a href="./recipe_detail.html?' + recipeList[index].id + '"><div class="image-container"><img src="' + recipeList[index].image + '" alt="' + recipeList[index].title + '"></div><div class="card-section recipe-info"><h3>' + recipeList[index].title + '</h3><p>Calories: ' + recipeList[index].calories + '</p><p>Protein: ' + recipeList[index].protein + '</p><p>Fat: ' + recipeList[index].fat + '</p></div></a></div>');
  });

  if (recipeListContainerEl.children('.grid-x').last().children().length !== 4) {
    let gridLength = recipeListContainerEl.children('.grid-x').last().children().length;
    let gapCount = 4 - gridLength;
    for (let i = 0; i < gapCount; i++) {
      console.log(i);
      recipeListContainerEl.children('.grid-x').last().append('<div class="cell card fill-card"></div>');
    }
  }

  $('.entire-container').height(recipeListContainerEl.height() + 226);
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
$('body').attr('style', 'background-image:url(' + backgroundImageObject.image + ')');

$('.load-more').on("click", function (e) {
  e.preventDefault();
  searchRecipe(searchCriteria);
});


if ($('.entire-container').height() < $(window).height()) {
  $('.entire-container').height($(window).height());
  console.log($('.entire-container').height());
}