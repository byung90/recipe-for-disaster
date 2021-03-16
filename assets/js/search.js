// Load foundations JS plugins
$(document).foundation();

var url = " https://api.spoonacular.com/recipes/findByIngredients";
var apikey = "54f9d0ffffd344e6907e1cb3683f501c";
var tabNavigationEl = $(".tab-navigation-container");
var currentTab = $("#search-criteria").children(".is-active").text();
var previousBtn = $("#previous-btn");
var nextBtn = $("#next-btn");
var recipeSearchBtn = $("#recipe-search-btn");
var searchCriteria = {
  ingredients: [],
  cuisines: [],
  diet: [],
  allergies: []
}

// Search for Recipe - This will need to move to recipie_list.js later
$(document).ready(function () {
  fetch(url + "?ingredients=apples,flour&apiKey=" + apikey)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    })
});

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
    var originalCard = $(event.relatedTarget);
    var cardInPot = originalCard.clone().appendTo(".new-location");
    originalCard.remove();

    // clear out style and draggable from cloned cards
    // var cardsInPot = $(".new-location").children(".ingredient-card");
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
  var reinstalledCard = originalCard.clone().appendTo(".search-result-container");
  originalCard.remove();

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
  var cardsInPot = $(".new-location").children('.ingredient-card');
  cardsInPot.each(function (index) {
    searchCriteria.ingredients.push($(cardsInPot[index]).children('.card-section').children().text());
  });
  $.each($("input[name='cuisine']:checked"), function () {
    searchCriteria.cuisines.push($(this).next().text());
  });
  $.each($("input[name='diet']:checked"), function () {
    searchCriteria.diet.push($(this).next().text());
  });
  $.each($("input[name='allergies']:checked"), function () {
    searchCriteria.allergies.push($(this).next().text());
  });

  localStorage.setItem("searchCriteria", JSON.stringify(searchCriteria));

  console.log(searchCriteria);

});

//set button status
buttonStatuses();