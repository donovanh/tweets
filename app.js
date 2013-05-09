var http = require('http')
    , url = require("url")
    , twitter  = require("ntwitter")

/* Establish Twitter connection */

var twitter = new twitter({
  consumer_key: 'TkWQBGYHO7r8zPF8rjg',
  consumer_secret: 'YxLhq6R9v3BOGgWofggkSx61a6YbzoJVN1cQ61zPAE',
  access_token_key: '280135383-4evP3U5FLSaBfw1HZ81orKBK85qTc9f2xcekSwlk',
  access_token_secret: 'rpyDgoDgAruoNkAHfNscMKNEjUIDiCn3rYq0sYK6Zg'
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
  
}).listen(4020, '127.0.0.1');

console.log('Server running at http://127.0.0.1:4020/');