var spoonacularUrl = " https://api.spoonacular.com/";
var spoonacularApiKey = "de4d428423dc4d72926835be0dc5a8e5";
var queryString = location.search.substring(1);
let backgroundImageObject = JSON.parse(localStorage.getItem('recipeForDisasterLocalImage'));
var youtubeApiKey = "AIzaSyCxei-rMDsIELyAVAQtGE1bDmEFUuW5KuQ";
var youtubeApiUrl = "https://www.googleapis.com/youtube/v3/search";
var videoPlayerEl = $("#videoPlayer");
var giphyAPIUrl = "https://api.giphy.com/v1/gifs/search";
var giphyApiKey = "1gDdg77XRTquH6zu7e2ZuCqJwnPqT0De";

// Call Recipe Detail API
fetch(spoonacularUrl + 'recipes/' + queryString + '/information?apiKey=' + spoonacularApiKey + '&includeNutrition=true')
  .then(function (response) {
    console.log(response);
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    //Assign Header Data
    $('#title').text(data.title);
    $('#credit-and-link').append(data.sourceName + '<br />' + 'Click <a href="' + data.sourceUrl + '">here</a> to see original recipe');
    $('#recipe-image').children('img').attr("src", data.image);
    $('#recipe-image').children('img').attr("alt", data.title);

    //Summary
    $('#recipe-summary').children('p').html(data.summary);


    //Ingredients
    let ingredientsEl = $('#recipe-ingredients');
    let ingredientList = data.extendedIngredients;

    $(ingredientList).each(function (index) {
      fetch(giphyAPIUrl + "?api_key=" + giphyApiKey + "&q=" + ingredientList[index].name + "&limit=1")
        .then(function (response2) {
          return response2.json();
        })
        .then(function (data2) {
          console.log(data2);
          if (ingredientsEl.children('.grid-x').last().children('.ingredient-card').length === 4) {
            ingredientsEl.append('<div class="grid-x align-justify" style="width: 100%"></div>');
          }
          else {
            ingredientsEl.children('.grid-x').last().children('.fill-card').remove();
          }

          if (data2.data.length > 0) {
            ingredientsEl.children('.grid-x').last().append('<div class="ingredient-card card"><div class="image-container"><img src="' + data2.data[0].images.original.url + '" alt="' + ingredientList[index].name + '"></div><div class="card-section"><p>' + ingredientList[index].name + '</p></div></div>');
          }
          else {
            ingredientsEl.children('.grid-x').last().append('<div class="ingredient-card card"><div class="image-container"><img src="https://media.giphy.com/media/11gZBGuDnYwdpu/giphy.gif" alt="' + ingredientList[index].name + '"></div><div class="card-section"><p>' + ingredientList[index].name + '</p></div></div>');
          }

          if (ingredientsEl.children('.grid-x').last().children('.ingredient-card').length !== 4) {
            let gridLength = ingredientsEl.children('.grid-x').last().children().length;
            let gapCount = 4 - gridLength;
            for (let i = 0; i < gapCount; i++) {
              console.log(i);
              ingredientsEl.children('.grid-x').last().append('<div class="card fill-card"></div>');
            }
          }

        })
    })

    //Instructions
    let instructions = data.instructions;
    let instructionsArray = instructions.split('.');
    $(instructionsArray).each(function (index) {
      console.log(instructionsArray[index]);
      $('#recipe-instructions').children('ol').append('<li>' + instructionsArray[index] + '</li>')
    });
    if ($('#recipe-instructions').children('ol').children('li').last().text() === "") {
      $('#recipe-instructions').children('ol').children('li').last().remove();
    }

    //Wine Pairing
    $('#wine-pairing').children('p').text(data.winePairing.pairingText);
    if (data.winePairing.productMatches.length > 0) {
      console.log(data.winePairing.productMatches.length);
      let loopLength;
      if (data.winePairing.productMatches.length < 4) {
        loopLength = data.winePairing.productMatches.length;
      }
      else {
        loopLength = 4;
      }
      for (let i = 0; i < loopLength; i++) {
        if (data.winePairing.productMatches[i].imageUrl !== "") {
          $('#wine-grid').append('<div class="cell card wine-card"><div class="image-container"><img src="' + data.winePairing.productMatches[i].imageUrl + '"></div><div class="card-section"><p>' + data.winePairing.productMatches[i].title + '</p></div></div>')
        }
        else {
          $('#wine-grid').append('<div class="cell card wine-card"><div class="image-container"><img src="https://media.giphy.com/media/11gZBGuDnYwdpu/giphy.gif"></div><div class="card-section"><p>' + data.winePairing.productMatches[i].title + '</p></div></div>')
        }
      }
    }
    else {
      $('#wine-grid').remove();
    }

    searchVideo(data.title);
  })

//Search Videos from Youtube
function searchVideo(recipe) {
  fetch(youtubeApiUrl + "?key=" + youtubeApiKey + "&part=snippet&q=" + recipe + "&order=viewCount&type=video&maxResults=1")
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log(data);
      video = {
        channel: data.items[0].snippet.channelTitle,
        id: data.items[0].id.videoId,
        thumbnail: data.items[0].snippet.thumbnails.high.url,
        title: data.items[0].snippet.title
      }
      videoPlayerEl.attr('src', 'https://www.youtube.com/embed/' + video.id);
    })
}

// Set background image
$('body').attr('style', 'background-image:url(' + backgroundImageObject.image + ')');