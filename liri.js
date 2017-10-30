const fs = require('fs');
const request = require('request');
const twitter = require('twitter');
const spotify = require('spotify');
const omdb = require('omdb');
const inputOne = process.argv[2];
const inputTwo = process.argv.splice(3).join(" ");

function log() {
    fs.appendFile('./log.txt', inputOne + " " + inputTwo + ", ", function(err) {
        if (err) {
            console.log(err);
        } else {
            // console.log("Succesful!");
        }
    });
};

const keys = require('./keys.js');
const client = new Twitter(keys.twitterKeys);
const params = {
    screen_name: 'izzykeanu',
    count: 20
};

run();

function run() {
    if (inputOne === "my-tweets") {
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                console.log('');
                console.log('My Last 20 Tweets: ');
                console.log('--------------------------');
                tweets.forEach(function(individualTweet) {
                    console.log('Time Posted: ' + individualTweet.created_at);
                    console.log('Tweet: ' + individualTweet.text);
                    console.log('--------------------------');
                });
            } else {
                console.log(error);
            };
        });
        log();
    } else if (inputOne === "spotify-this-song") {
        if (inputTwo.length < 1) {

            inputTwo = "Middle";
        };
        spotify.search({ type: 'track', query: inputTwo }, function(err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }
            console.log('');
            console.log('Spotify Song Information Results: ');
            console.log('--------------------------');
            console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
            console.log("Track Title: " + data.tracks.items[0].name);
            console.log("Link to Song: " + data.tracks.items[0].preview_url);
            console.log("Album Title: " + data.tracks.items[0].album.name);
            console.log('--------------------------');
        });
        log();
    } else if (inputOne === "movie-this") {
        if (inputTwo.length < 1) {
            inputTwo = "Fight Club";
        };
        request("http://www.omdbapi.com/?t=" + inputTwo + "&y=&plot=short&r=json&tomatoes=true", function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log('');
                console.log('OMDB Movie Information: ');
                console.log('--------------------------');
                console.log("Movie Title: " + JSON.parse(body).Title);
                console.log("Year of Release: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Countries produced in: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Movie Plot: " + JSON.parse(body).Plot);
                console.log("Actor(s): " + JSON.parse(body).Actors);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
                console.log('--------------------------');
            } else {
                console.log(error);
            }
        });
        log();
    } else if (inputOne === "do-what-it-says") {
        log();
        fs.readFile('random.txt', 'utf8', function(err, data) {
            if (err) throw err;
            let arr = data.split(',');
            inputOne = arr[0].trim();
            inputTwo = arr[1].trim();
            run();
        });
    }
};