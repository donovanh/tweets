var http = require('http')
    , url = require("url")
    , fs = require('fs')
    , twitter  = require("ntwitter")

/* Establish Twitter connection */

var twitter = new twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
});

http.createServer(function (request, response) {

  var path_parts = url.parse(request.url, true).path.split('?')[0].split('/');
  
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

    twitter.search(searchphrase.trim(), {}, function(err, data) {
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify(data));
    });
  } else if (path_parts[1] == 'stream') {
    // Similar to search but returns a live stream for use with sockety yokes
    var searchphrase = path_parts.join(' ').split('stream ')[1];

    // Add in a URL search if specified
    // /search/foo/?url=http://example.com
    // Becomes: 'foo http://example.com'
    if (url.parse(request.url, true).query.url !== undefined) {
      searchphrase += ' ' + url.parse(request.url, true).query.url;
    }

    response.writeHead(200, {'Content-Type': 'application/json'});
    twitter.stream('statuses/filter', {'track':searchphrase}, function(stream) {
      stream.on('data', function (data) {
        response.write(JSON.stringify(data));
      });
    });
  } else {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("Twitter Node app: See http://github.com/donovanh/nodetwooter");
    response.end();
  }
  
}).listen(process.env.PORT || 5000);

console.log('Server running at http://127.0.0.1:5000/');