// Load foundations JS plugins
$(document).foundation();

var url = " https://api.spoonacular.com/";
var apikey = "de4d428423dc4d72926835be0dc5a8e5";
var giphyAPIUrl = "https://api.giphy.com/v1/gifs/search";
var giphyApiKey = "1gDdg77XRTquH6zu7e2ZuCqJwnPqT0De";
var tabNavigationEl = $(".tab-navigation-container");
var currentTab = $("#search-criteria").children(".is-active").text();
var previousBtn = $("#previous-btn");
var nextBtn = $("#next-btn");
var recipeSearchBtn = $("#recipe-search-btn");
var localSearchCriteria = {
  ingredients: [],
  cuisines: [],
  diet: [],
  allergies: []
};
var localSearchedRecipes = [];
let backgroundImageObject = JSON.parse(localStorage.getItem('recipeForDisasterLocalImage'));

// Autocomplete Ingredient Search
$("#ingredient-search-button").on("click", function (e) {
  e.preventDefault();
  autocompleteIngredientSearch();
})

$("#ingredientSearch").on("submit", function (e) {
  e.preventDefault();
  autocompleteIngredientSearch();
})

// Autocomplete Ingredient Search Function
function autocompleteIngredientSearch() {
  removeLeftOverIngredients();
  let ingredientSearchValue = $('#ingredientSearchInput').val();
  fetch(url + "food/ingredients/autocomplete?apiKey=" + apikey + "&number=5&query=" + ingredientSearchValue)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      $('.search-instructions').hide();
      $('.click-and-drag-instructions').show();
      displayIngredientCards(data);
    })
}


// Remove unused ingredient cards
function removeLeftOverIngredients() {
  var searchResultContainerEl = $('.search-result-container');
  searchResultContainerEl.children().remove();
}

// Display Ingredients into Ingredient Card
function displayIngredientCards(listOfIngredients) {
  var searchResultContainerEl = $('.search-result-container');
  // create cards
  $(listOfIngredients).each(function (index) {
    if (index % 4 === 0) {
      searchResultContainerEl.append('<div class="grid-x align-justify" style="width: 100%"></div>');
    }
    searchResultContainerEl.children('.grid-x').last().append('<div class=\'card ingredient-card draggable\'><div class="image-container" data-ingredient=\'' + listOfIngredients[index].name + '\'><img></div><div class=\'card-section\'><p>' + listOfIngredients[index].name + '</p></div></div>');
    fetch(giphyAPIUrl + "?api_key=" + giphyApiKey + "&q=" + listOfIngredients[index].name + "&limit=1")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        let thumbnailImage = data.data[0].images.original.url;
        let altTitle = data.data[0].title;
        $('div[data-ingredient=\'' + listOfIngredients[index].name + '\'').children('img').attr("src", thumbnailImage);
        $('div[data-ingredient=\'' + listOfIngredients[index].name + '\'').children('img').attr("alt", altTitle);
      });
  })
  if (searchResultContainerEl.children('.grid-x').last().children().length !== 4) {
    let gridLength = searchResultContainerEl.children('.grid-x').last().children().length;
    let gapCount = 4 - gridLength;
    for (let i = 0; i < gapCount; i++) {
      console.log(i);
      searchResultContainerEl.children('.grid-x').last().append('<div class="cell card fill-card"></div>');
    }
  }
}

// Get Current Tab
function getCurrentTab() {
  currentTab = $("#search-criteria").children(".is-active").text();
}

// Draggable
// target elements with the "draggable" class
interact('.ingredient-card')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: '.is-active',
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // call this function on every dragend event
      end(event) {

      }
    }
  })

function dragMoveListener(event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.webkitTransform =
    target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

// enable draggables to be dropped into this
interact('#pot-container').dropzone({
  // only accept elements matching this CSS selector
  accept: '.ingredient-card',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.75,

  // listen for drop related events:
  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add('drop-active')
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget
    var dropzoneElement = event.target

    // feedback the possibility of a drop
    dropzoneElement.classList.add('drop-target')
    draggableElement.classList.add('can-drop')
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove('drop-target')
    event.relatedTarget.classList.remove('can-drop')
  },
  ondrop: function (event) {
    // clone current card to new location and remove current card
    let newLocationEl = $('.new-location');
    if (newLocationEl.children().last().children('.added-ingredient-card').length < 4) {
      newLocationEl.children().last().children('.fill-card').remove();
    }
    if (newLocationEl.children().last().children('.added-ingredient-card').length % 4 === 0) {
      newLocationEl.append('<div class="grid-x align-justify" style="width: 100%"></div>');
    }

    var originalCard = $(event.relatedTarget);
    var cardInPot = originalCard.clone().appendTo($(".new-location").children().last());
    originalCard.remove();

    let searchResultContainerEl = $('.search-result-container');

    if (searchResultContainerEl.children('.grid-x').length > 1) {
      searchResultContainerEl.children('.grid-x').last().children('.ingredient-card').clone().appendTo(searchResultContainerEl.children('.grid-x').first());
      searchResultContainerEl.children('.grid-x').last().children('.ingredient-card').remove();
      if (searchResultContainerEl.children('.grid-x').last().children('.ingredient-card').length === 0) {
        searchResultContainerEl.children('.grid-x').last().remove();
      }
    }
    else if (searchResultContainerEl.children('.grid-x').length === 1) {
      searchResultContainerEl.children('.grid-x').last().append('<div class="cell card fill-card"></div>');
      if (searchResultContainerEl.children('.grid-x').last().children('.ingredient-card').length === 0) {
        searchResultContainerEl.children('.grid-x').last().remove();
      }
    }

    if (newLocationEl.children('.grid-x').last().children().length !== 4) {
      let gridLength = newLocationEl.children('.grid-x').last().children().length;
      let gapCount = 4 - gridLength;
      for (let i = 0; i < gapCount; i++) {
        console.log(i);
        newLocationEl.children('.grid-x').last().append('<div class="cell card fill-card"></div>');
      }
    }

    // clear out style and draggable from cloned cards
    cardInPot.addClass('added-ingredient-card');
    cardInPot.removeClass('ingredient-card');
    cardInPot.removeClass('draggable');
    cardInPot.removeAttr("style");
    cardInPot.removeAttr("data-x");
    cardInPot.removeAttr("data-y");
    cardInPot.attr("data-closable", "");

    // Add remove from pot button to card
    cardInPot.prepend('<button class=\"close-button\" aria-label=\"Close alert\" id="remove-ingredient-button" type=\"button\" data-close><span aria-hidden=\"true\">&times;</span></button>');
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active')
    event.target.classList.remove('drop-target')
  }
})

// Add removed card back to search container
$('#pot-container').on("click", '#remove-ingredient-button', function (e) {
  e.preventDefault();
  var originalCard = $(this).parent();
  let searchResultContainerEl = $('.search-result-container');
  let newLocationEl = $('.new-location');
  if (searchResultContainerEl.children('.grid-x').last().children('.fill-card').length > 0) {
    searchResultContainerEl.children('.grid-x').last().children('.fill-card').remove();
  }
  else if (searchResultContainerEl.children('.grid-x').length === 0 || searchResultContainerEl.children('.grid-x').last().children('.ingredient-card').length === 4) {
    searchResultContainerEl.append('<div class="grid-x align-justify" style="width: 100%"></div>');
  }
  var reinstalledCard = originalCard.clone().appendTo(searchResultContainerEl.children('.grid-x').last());
  console.log(searchResultContainerEl.children('.grid-x').last().children().length);
  if (searchResultContainerEl.children('.grid-x').last().children().length !== 4) {
    let gridLength = searchResultContainerEl.children('.grid-x').last().children().length;
    let gapCount = 4 - gridLength;
    for (let i = 0; i < gapCount; i++) {
      searchResultContainerEl.children('.grid-x').last().append('<div class="cell card fill-card"></div>');
    }
  }

  originalCard.remove();

  if (newLocationEl.children('.grid-x').last().children('.added-ingredient-card').length === 0) {
    newLocationEl.children('.grid-x').last().remove();
  }
  else if (newLocationEl.children('.grid-x').last().children('.added-ingredient-card').length !== 4) {
    let gridLength = newLocationEl.children('.grid-x').last().children().length;
    let gapCount = 4 - gridLength;
    for (let i = 0; i < gapCount; i++) {
      newLocationEl.children('.grid-x').last().append('<div class="cell card fill-card"></div>');
    }
  }

  reinstalledCard.removeClass('added-ingredient-card');
  reinstalledCard.addClass('ingredient-card');
  reinstalledCard.removeClass('draggable');

  reinstalledCard.children('#remove-ingredient-button').remove();
});


// Button Statuses
function buttonStatuses() {
  if (currentTab === "Ingredients") {
    previousBtn.hide();
    nextBtn.show();
    recipeSearchBtn.hide();
  }
  else if (currentTab === "Cuisine") {
    previousBtn.show();
    nextBtn.show();
    recipeSearchBtn.hide();
  }
  else if (currentTab === "Diet") {
    previousBtn.show();
    nextBtn.show();
    recipeSearchBtn.hide();
  }
  else {
    previousBtn.show();
    nextBtn.hide();
    recipeSearchBtn.show();
  }
}

nextBtn.on("click", function (e) {
  e.preventDefault();

  if (currentTab === "Ingredients") {
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

// Update button and current tab on tab change
$("#search-criteria").on('change.zf.tabs', function () {
  getCurrentTab();
  buttonStatuses();
});

//Collect Search Criteria
$('#recipe-search-btn').on("click", function (e) {
  e.preventDefault();
  var cardsInPot = $(".new-location").children('.added-ingredient-card');
  cardsInPot.each(function (index) {
    localSearchCriteria.ingredients.push($(cardsInPot[index]).children('.card-section').children().text());
  });
  $.each($("input[name='cuisine']:checked"), function () {
    localSearchCriteria.cuisines.push($(this).next().text());
  });
  $.each($("input[name='diet']:checked"), function () {
    localSearchCriteria.diet.push($(this).next().text());
  });
  $.each($("input[name='allergies']:checked"), function () {
    localSearchCriteria.allergies.push($(this).next().text());
  });

  localStorage.setItem("searchCriteria", JSON.stringify(localSearchCriteria));

  console.log(localSearchCriteria);
  searchRecipe(localSearchCriteria);
});

//Search for recipe and store to local data
function searchRecipe(searchCriterias) {
  let ingredients = searchCriterias.ingredients.toString();
  let cuisines = searchCriterias.cuisines.toString();
  let diet = searchCriterias.diet.toString();
  let allergies = searchCriterias.allergies.toString();

  fetch(url + "recipes/complexSearch?apiKey=" + apikey + "&cuisine=" + cuisines + "&diet=" + diet + "&intolerances=" + allergies + "&includeIngreients=" + ingredients + "&includeIngreients=10&sort=popularity&sortDirection=asc&minFat=0&minProtein=0&minCalories=0&instructionsRequired=true")
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
        localSearchedRecipes.push(recipe);
      });
      localStorage.setItem("searchedRecipies", JSON.stringify(localSearchedRecipes));
      window.location = './recipe_list.html';
    })
}

// Set background image
$('body').attr('style', 'background-image:url(' + backgroundImageObject.image + ')');

//set button status
buttonStatuses();
$('.click-and-drag-instructions').hide();
