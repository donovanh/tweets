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

If you have <code>foreman</code> installed, run the app like so:

    $ foreman start

Since I wanted it to work with Heroku, the app runs by default on port <code>5000</code>.

## Usage

Currently the app will return a 404 unless the path contains either <code>search</code> or <code>stream</code>.

### Search

Search is as follows:

    http://localhost:4020/search/foo

This will search Twitter for the phrase "foo" and return a JSON response containing the results. You can create more complex queries:

    http://localhost:4020/search/this/AND/that

The search in this case will be "this AND that".

### Stream

The <code>stream</code> function follows a similar pattern and uses Twitter's <code>track</code> filter for creating a stream.

    http://localhost:4020/stream/foo

This will return a streamed JSON response that could be hooked into a socket on the browser.

## Hosting

I have deployed it to Heroku using [these instructions](https://devcenter.heroku.com/articles/nodejs). Since it's a light, database-free app, it could just as well live on a free Appfog instance also.

You'll need to add the environment variables listed above when setting up your app with Heroku etc.

## Dependencies

This app relies on [ntwitter](https://github.com/AvianFlu/ntwitter).

## TODO

Tweet streaming would be nice, so that a socket-enabled static site could show a dynamically updating list.

## License

[MIT](http://en.wikipedia.org/wiki/MIT_License) license applied. Have fun. Pull requests and improvements much appreciated.