// Javascript for Code that Dynamically Writes the Artist's Top Songs to the HTML

// Add JS Code below
var videoIdent = "";

$(document).ready(function() {

    // clear out any prior song lists and videos
    $("#top-songs").empty();
    $("#top-video").empty();

    // Grabbing and storing the selected artist property value from the button
    var bandInput = "";
    var results = "";
    var topSong = "";
    // var videoIdent = "";

    $(".search-button").on("click", function() {
        console.log("Button clicked");

        bandInput = $("#band-input").val().trim();
        console.log("Artist Requested: " + bandInput);

        printSongs(addVideo);

        console.log("------ end of on-click -------------");
    });



    function printSongs(callback) {
        //Empty the div with the top-songs ID
        $("#top-songs").empty();
    
        var queryURL1 = "https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + bandInput + 
        "&api_key=8ebc9b04f203d069a8e6992620b4b37b&format=json";
        
        // Performing an AJAX request with the queryURL
        $.ajax({
        url: queryURL1,
        method: "GET"
        }).then(function(response) {
            console.log("queryURL1: " + queryURL1);
            console.log(response);

            results = response.toptracks.track;
            console.log(response.toptracks.track);

            topSong = results[0].name;
            console.log("Top Song: " + topSong);

            // Looping through the top 3 songs of each result
            for (var i = 0; i < 3; i++) {

                // Creating and storing a div tag
                var trackDiv = $("<h3>");

                // Create a new anchor tag with the result item's name
                var trackLink = $("<a>");

                // Give the new anchor element some text
                trackLink.text((i+1) + ". " + results[i].name);

                // Give the new anchor element an href attribute of the url from the result item
                trackLink.attr("href", results[i].url);

                // Give the element an attribute to open a new window when clicking on the element
                trackLink.attr("target", "_blank");

                trackLink.addClass("btn-sm btn-songs");

                console.log(results[i].url);

                // Appending the paragraph to the trackDiv
                trackDiv.append(trackLink);
        
                // Prependng the trackDiv to the HTML page in the "#top-songs" div
                $("#top-songs").append(trackDiv);
            }

            //            bandInput.attr("top-song", topSong);
            console.log("------ end of printSongs function -------------");

            //RWS: have to call addVideo at the end of the ajax call (and not outside the ajax call) 
            //to avoid addVideo being done before this ajax call is complete 
            addVideo();    
        });

    }

    function addVideo() {
        //Empty the div with the top-video ID
        $("#top-video").empty();


        // youtube key: AIzaSyCN6p-zygNG_t-KHdAHG_juKUT_X_AMFYo
        console.log("Artist: " + bandInput);
        console.log("Top Song: " + topSong);
        var queryURL2 = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + bandInput + " " + topSong + "&type=video&key=AIzaSyCN6p-zygNG_t-KHdAHG_juKUT_X_AMFYo"; 

        // Performing an AJAX request with the queryURL
        $.ajax({
        url: queryURL2,
        method: "GET"
        }).then(function(response) {
            console.log("queryURL2: " + queryURL2);
            console.log(response);

            videoIdent = response.items[0].id.videoId;

            console.log("videoID: " + videoIdent);

            var tempUrl = "https://www.youtube.com/embed/" + videoIdent;
            console.log("video src: " + tempUrl);

            var videoDiv = $("<iframe id='video' type='text/html' width='320' height='160' frameborder='0'></iframe>");
            videoDiv.attr("src", tempUrl);
            $("#top-video").append(videoDiv);            
        });

        console.log("------ end of addVideo function -------------");

    }
});