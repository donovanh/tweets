# Nodetwooter

A simple JSON end point for Twitter searching. This was developed to allow for the inclusion of Tweet search content on static web pages, available via a JavaScript AJAX GET request.

## Installation

Clone the app to a local directory. You'll need to [register a new application](https://dev.twitter.com/apps/new) with Twitter. Once registered, create a file called <code>.env</code> to store your app details for local testing. It should contain the following (replace the XXX with your details):

    consumer_key=XXX
    consumer_secret=XXX
    access_token_key=XXX
    access_token_secret=XXX

## Running the app

Ensure you have [Node.js](http://nodejs.org) installed. Install any dependencies first:

    $ npm install

Then run the app:

    $ node app

By default, the app runs on port <code>4020</code>. Usage is as follows:

    http://localhost:4020/search/foo

This will search Twitter for the phrase "foo" and return a JSON response containing the results. You can create more complex queries:

    http://localhost:4020/search/this/AND/that

The search in this case will be "this AND that".

## License

[MIT](http://en.wikipedia.org/wiki/MIT_License) license applied. Have fun. Pull requests and improvements much appreciated.