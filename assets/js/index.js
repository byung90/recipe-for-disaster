var giphyAPIUrl = "https://api.giphy.com/v1/gifs/search";
var apiKey = "1gDdg77XRTquH6zu7e2ZuCqJwnPqT0De";
var apiOffsetCount = 0;
// Call a giphy for background
$(document).ready(function () {
  // Calling giphy search query of "food" and returning only 1 result
  fetch(giphyAPIUrl + "?api_key=" + apiKey + "&q=food&limit=1")
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      let backgroundImage = data.data[0].images.original.url;
      let altTitle = data.data[0].title;
      $('body').attr('style', 'background-image:url(' + backgroundImage + ')');

      let backgroundObject = {
        image: backgroundImage,
        alt: altTitle
      }
      localStorage.setItem("recipeForDisasterLocalImage", JSON.stringify(backgroundObject));
    });
});

localStorage.setItem("apiOffsetCount", JSON.stringify(apiOffsetCount));