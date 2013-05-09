var http = require('http')
    , url = require("url")
    , fs = require('fs')
    , twitter  = require("ntwitter")
    , redis = require('redis');

/* Establish Twitter connection */

var twitter = new twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
});

/* Establisn Redis connection (using Redis Cloud) for caching */

if (process.env.REDISCLOUD_URL) {
  var redisURL = url.parse(process.env.REDISCLOUD_URL);
  var redis = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
  redis.auth(redisURL.auth.split(":")[1]);
} else {
  var redis = redis.createClient();
}

redis.on("error", function (err) {
    console.log("Redis client error: ", err);
});

/* Server */

http.createServer(function (request, response) {

  var path_parts = url.parse(request.url, true).pathname.split('/');
  
  if (path_parts[1] == 'search') {
    // Create a searchphrase by joining the parts with a space for each slash
    // Note: I then split the string to remove the 'search' text
    // Usage: /search/foo/AND/bar
    // Becomes: 'foo AND bar'
    var searchphrase = path_parts.join(' ').split('search ')[1];

    // Add in a URL search if specified
    // /search/foo/?url=http://example.com
    // Becomes: 'foo http://example.com'
    if (url.parse(request.url, true).query.url !== undefined) {
      searchphrase += ' ' + url.parse(request.url, true).query.url;
    }

    response.writeHead(200, {'Content-Type': 'application/json'});

    // Check if cached
    var redisKey = searchphrase.replace(' ', '');
    redis.get(redisKey, function (err, result) {
      if (err) {
        console.log('Error: '+err);
        return;
      }
      if (result) {
        response.end(result);
      } else {
        // No result, get search from Twitter and save to Redis
        twitter.search(searchphrase.trim(), {count: 1}, function(err, data) {
          data = JSON.stringify(data);
          redis.setex(redisKey, 900, data);
          response.end(data);
        });
      }
        
    });

    
  } else {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("Twitter Node app: See http://github.com/donovanh/tweets");
    response.end();
  }
  
}).listen(process.env.PORT || 5000);

console.log('Server running at http://127.0.0.1:5000/');