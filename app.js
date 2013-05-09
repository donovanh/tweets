var http = require('http')
    , url = require("url")
    , twitter  = require("ntwitter")

/* Establish Twitter connection */

var twitter = new twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
});

http.createServer(function (request, response) {

  var path_parts = url.parse(request.url, true).path.split('/');
  if (path_parts[1] == 'search') {
    // Create a searchphrase by joining the parts with a space for each slash
    // Note: I then split the string to remove the 'search' text
    // Usage: /search/foo/and/poo
    // Becomes: 'foo and poo'
    var searchphrase = path_parts.join(' ').split('search ')[1];

    twitter.search(searchphrase, {}, function(err, data) {
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify(data));
    });
  } else {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("I'm sorry, Dave. I'm afraid I can't do that.");
    response.end();
  }
  
}).listen(process.env.PORT || 5000);

console.log('Server running at http://127.0.0.1:5000/');