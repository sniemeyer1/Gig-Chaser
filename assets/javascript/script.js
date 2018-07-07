 // Initialize Firebase
//  var config = {
//     apiKey: "AIzaSyCLXyUhUnq6KT3IOsYNvWKYtnrGVXqZt08",
//     authDomain: "nrfpc-fdbbd.firebaseapp.com",
//     databaseURL: "https://nrfpc-fdbbd.firebaseio.com",
//     projectId: "nrfpc-fdbbd",
//     storageBucket: "nrfpc-fdbbd.appspot.com",
//     messagingSenderId: "455767813152"
//   };

var config = {
  apiKey: "AIzaSyCnGXOVqempZj1dED-p5ECHUexvHzFt-wU",
  authDomain: "my-first-firebase-projec-250a7.firebaseapp.com",
  databaseURL: "https://my-first-firebase-projec-250a7.firebaseio.com",
  projectId: "my-first-firebase-projec-250a7",
  storageBucket: "my-first-firebase-projec-250a7.appspot.com",
  messagingSenderId: "62207198057"
};

  firebase.initializeApp(config);

  var database = firebase.database();


function displayGigs() {
  console.log("The click worked");
  var artistName = $("#band-input").val().trim();
  var dateRange = moment($("#start-date-input").val().trim()).format("YYYY-MM-DD") +
    "," + moment($("#end-date-input").val().trim()).format("YYYY-MM-DD");
  console.log(artistName);
  console.log(dateRange);

  var queryURL = "https://rest.bandsintown.com/artists/" +
    artistName + "/events?app_id=codingbootcamp&date=" + dateRange
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function (response) {
      for (i = 0; i < response.length; i++) {
        var eventCity = $("<h5>");
        eventCity.text(response[i].venue.city + ", " + response[i].venue.region);
        var eventDate = $("<p>");
        eventDate.text(moment(response[i].datetime).format("llll"));
        var displayEvent = $("<button class='col-3 btn-sm'>");
        displayEvent.append(eventCity);
        displayEvent.append(eventDate);
        displayEvent.attr("data-latitude", response[i].venue.latitude);
        displayEvent.attr("data-longitude", response[i].venue.longitude);
        displayEvent.attr("data-keyword", response[i].venue.name);
        displayEvent.attr("data-city-state", response[i].venue.city + ", " + response[i].venue.region);
        displayEvent.addClass("click-venue");
        console.log(displayEvent);
        $("#search-results").append(displayEvent);
      }
    })
    // console.log(displayEvent);
}

// this function adds a new artist from the input boxes as a new child object in firebase
function addArtist() {
  // remove what is in the database
  database.ref().remove();

  // grab the artist in the input box
  var artistName = $("#band-input").val().trim();

  database.ref().push({
    artistName: artistName
  });
}

// this method senses when a new artist is added to firebase and updates the list of previous artists
database.ref().on("child_added", function(childSnapshot) {
  $("#previous-artists").empty();

  // Log stuff from snapshot
  console.log("artistName: " + childSnapshot.val().artistName);
  console.log("dateAdded: " + childSnapshot.val().dateAdded);
  
  // create a new div to receive the artist name
  var previousArtist = $("<button class='btn-sm'>");

  // add the text of the artist name to the div
  previousArtist.text(childSnapshot.val().artistName);

  // append the artist name to the html
  $("#previous-artists").append(previousArtist);
});

// // Click on artist name from previous artist list to reload the artist and search again
// $("#previous-artists").on("click", function() {
//   // var tempName = $(this).attr("data-state")
//   $("#band-input").text(this);
//   // ("#band-input").text(tempName);
//   // printSongs(addVideo);
//   // displayGigs();
// })

// // Click the button to clear list of previous artists 
// $("#clear-list").on("click", function() {
//   database.ref().remove();
// })

$("#submit-search").on("click", function() {
  console.log("CLICKED");
  // event.preventDefault();
  $("#search-results").empty();
  displayGigs();
  addArtist();
  $(".show-on-click").show();
})



$(document).on("click", ".click-venue", function() {
  $(".show-on-click-venue").show();
  // var venueLat = $(this).attr("data-latitude");
  // var venueLong = $(this).attr("data-longitude");
  // var venueName = $(this).attr("data-keyword");
  // var venueCityState = $(this).attr("data-city-state")
  var venueQuery = $(this).attr("data-keyword") + " " + $(this).attr("data-city-state");
  // var queryURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyCN6p-zygNG_t-KHdAHG_juKUT_X_AMFYo&radius=50&location=" +
  //   venueLat + "," + venueLong + "&keyword=" + venueName;
  // $.ajax({
  //   url: queryURL,
  //   method: "GET"
  // }).then(function(response) {
    
  // })
  $("#embed-venue").html("<iframe width='100%' height='400px' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/place?q=" + 
    venueQuery + "&key=AIzaSyCN6p-zygNG_t-KHdAHG_juKUT_X_AMFYo' allowfullscreen></iframe>");
  $("#nearby-hotels-div").html("<button class='btn btn-sm' data-venue='" + venueQuery + 
    "' data-toggle='modal' data-target='#hotels-modal' id='nearby-hotels-button'>Nearby hotels!</button>");
  $("#nearby-bars-div").html("<button class='btn btn-sm' data-venue='" + venueQuery + 
    "' data-toggle='modal' data-target='#bars-modal' id='nearby-bars-button'>Nearby bars!</button>");
});

$(document).on("click", "#nearby-hotels-button", function() {
  var searchReference = $(this).attr("data-venue");
  $("#hotels-map").html("<iframe width='100%' height='400px' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/search?q=hotels+near+" + 
  searchReference + "&key=AIzaSyCN6p-zygNG_t-KHdAHG_juKUT_X_AMFYo' allowfullscreen></iframe>");
});

$(document).on("click", "#nearby-bars-button", function() {
  var searchReference = $(this).attr("data-venue");
  $("#bars-map").html("<iframe width='100%' height='400px' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/search?q=bars+near+" + 
  searchReference + "&key=AIzaSyCN6p-zygNG_t-KHdAHG_juKUT_X_AMFYo' allowfullscreen></iframe>");
});
