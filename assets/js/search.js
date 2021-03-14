// Load foundations JS plugins
$(document).foundation();

var url = " https://api.spoonacular.com/recipes/findByIngredients";
var apikey = "54f9d0ffffd344e6907e1cb3683f501c";
var tabNavigationEl = $(".tab-navigation-container");
var currentTab = $("#search-criteria").children(".is-active").text();
var previousBtn = $("#previous-btn");
var nextBtn = $("#next-btn");
var recipeSearchBtn = $("#recipe-search-btn");

// Search for Recipe - This will need to move to recipie_list.js later
$(document).ready(function () {
  console.log(1);
  fetch(url + "?ingredients=apples,flour&apiKey=" + apikey)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data)

    })
});

// Get Current Tab
function getCurrentTab() {
  var currentTab = $("#search-criteria").children(".is-active").text();
  console.log(currentTab);
}

// Button Statuses
function buttonStatuses() {
  if (currentTab === "Ingredients") {
    previousBtn.hide();
    nextBtn.show();
    recipeSearchBtn.hide();
  }
  else if (currentTab === "Cuisine") {
    previousBtn.hide();
    nextBtn.show();
    recipeSearchBtn.hide();
  }
  else if (currentTab === "Diet") {
    previousBtn.hide();
    nextBtn.show();
    recipeSearchBtn.hide();
  }
  else {
    previousBtn.hide();
    nextBtn.hide();
    recipeSearchBtn.show();
  }
}

nextBtn.on("click", function (e) {
  e.preventDefault();

  if (currentTab === "Ingredients") {
    // window.location.href = "#cuisine";
    $("#search-criteria").foundation('selectTab', "#cuisine");
  }
  else if (currentTab === "Cuisine") {
    $("#search-criteria").foundation('selectTab', "#diet");
  }
  else {
    $("#search-criteria").foundation('selectTab', "#allergies");
  }

});

previousBtn.on("click", function (e) {
  e.preventDefault();
  getCurrentTab();
  if (currentTab === "Cuisine") {
    $("#search-criteria").foundation('selectTab', "#ingredients");
  }
  else if (currentTab === "Diet") {
    $("#search-criteria").foundation('selectTab', "#cuisine");
  }
  else {
    $("#search-criteria").foundation('selectTab', "#diet");
  }
});

$("#search-criteria").on('change.zf.tabs', function () {
  getCurrentTab();
  buttonStatuses();
});