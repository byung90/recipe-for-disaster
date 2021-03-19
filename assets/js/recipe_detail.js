var spoonacularUrl = " https://api.spoonacular.com/";
// var apikey = "54f9d0ffffd344e6907e1cb3683f501c";
var spoonacularApiKey = "7eba54b90be749259b03f159287e801b";
var queryString = location.search.substring(1);
let backgroundImageObject = JSON.parse(localStorage.getItem('recipeForDisasterLocalImage'));
var youtubeApiKey = "AIzaSyCxei-rMDsIELyAVAQtGE1bDmEFUuW5KuQ";
var youtubeApiUrl = "https://www.googleapis.com/youtube/v3/search";
var videoPlayerEl = $("#videoPlayer");

// Call Recipe Detail API
fetch(spoonacularUrl + 'recipes/' + queryString + '/information?apiKey=' + spoonacularApiKey)
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
      let loopLength;
      if (data.winePairing.productMatches.length < 4) {
        loopLength = data.winePairing.productMatches.length;
      }
      else {
        loopLength = 4;
      }
      for (let i = 0; i < loopLength; i++) {
        $('#wine-grid').append('<div class="cell card wine-card"><div class="image-container"><img src="' + data.winePairing.productMatches[i].imageUrl + '"></div><div class="card-section"><p>' + data.winePairing.productMatches[i].title + '</p></div></div>')
      }
    }
    else {
      $('#wine-grid').remove();
    }

    searchVideo(data.title);
    // Set background image
    $("#background-image").attr("src", backgroundImageObject.image);
    $("#background-image").attr("alt", backgroundImageObject.alt);
    $("#background-image").attr("style", 'height:' + $("body").height() + 'px');
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