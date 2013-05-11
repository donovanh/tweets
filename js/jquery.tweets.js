// Tweets
// A plugin to process a JSON feed of tweets into a HTML container
// Requires:
//  jQuery
//  Handlebars (for templating)
// Full instructions: http://hop.ie/tweets/plugin/
// Based on: jQuery Plugin Boilerplate by Stefan Gabos

;(function($) {

    $.tweets = function(options) {

        var defaults = {
            searchPhrase: 'hop.ie',
            templateID: 'tweet-template-default',
            destinationID: 'tweet-container',
            tweetSource: 'Your source URL, eg. tweets.example.com'
        }

        var plugin = this;

        plugin.settings = {}

        var init = function() {
            plugin.settings = options || defaults;

            // Check if the destination exists
            if ($('#'+plugin.settings.destinationID).length == 0) {
              console.log('Tweets plugin error: Please supply a destination element for the tweets.');
              return;
            }
            // Check if there's a source to get the tweets (essential)
            if (plugin.settings.tweetSource.length == 0) {
              console.log('Tweets plugin error: This plugin requires a server component specified. Please check github.com/donovanh/tweets/ for details.');
              return;
            }

            // Get the tweet template
            if ($('#'+plugin.settings.templateID).length == 0) {
              // Use the default template
              plugin.settings.templateHTML = tweet_template_default;
            } else {
              plugin.settings.templateHTML = $('#'+plugin.settings.templateID).html();
            }

            if (plugin.settings.searchPhrase.length > 0) {
              $.get(plugin.settings.tweetSource+'/search/'+plugin.settings.searchPhrase, function(data) {
                var outputHTML = '';
                $.each(data.results, function(index, tweet) {
                  tweet.text = replaceURLWithHTMLLinks(tweet.text);
                  tweet.created_at = time_ago(tweet.created_at);
                  var template = Handlebars.compile(plugin.settings.templateHTML);
                  outputHTML += template(tweet);
                });
                $("#"+plugin.settings.destinationID).html(outputHTML);
              });
            } else {
              console.log('Tweets plugin error: Please supply a searchPhrase.');
              return;
            }

        }

        // Default handlebars template
        var tweet_template_default = '<article class="tweet"><section class="user-details"><a href="http://twitter.com/{{from_user}}"><div class="user-image" style="background-image: url({{profile_image_url}})"></div><p><strong>{{from_user_name}}</strong><span>{{from_user}}</span></p></a></section><p class="text">{{{text}}}</p><p class="timing"><a href="http://twitter.com/{{from_user}}/statuses/{{id_str}}">{{created_at}}</a></p></article>';


        // plugin.foo_public_method = function() {
        //     // code goes here
        // }

        // Private methods

        var replaceURLWithHTMLLinks = function(text) {
          var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
          return text.replace(exp,"<a href='$1'>$1</a>"); 
        }

        var time_ago = function(time){

          switch (typeof time) {
              case 'number': break;
              case 'string': time = +new Date(time); break;
              case 'object': if (time.constructor === Date) time = time.getTime(); break;
              default: time = +new Date();
          }
          var time_formats = [
              [60, 'seconds', 1], // 60
              [120, '1 minute ago', '1 minute from now'], // 60*2
              [3600, 'minutes', 60], // 60*60, 60
              [7200, '1 hour ago', '1 hour from now'], // 60*60*2
              [86400, 'hours', 3600], // 60*60*24, 60*60
              [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
              [604800, 'days', 86400], // 60*60*24*7, 60*60*24
              [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
              [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
              [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
              [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
              [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
              [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
              [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
              [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
          ];
          var seconds = (+new Date() - time) / 1000,
              token = 'ago', list_choice = 1;

          if (seconds == 0) {
              return 'Just now'
          }
          if (seconds < 0) {
              seconds = Math.abs(seconds);
              token = 'from now';
              list_choice = 2;
          }
          var i = 0, format;
          while (format = time_formats[i++])
              if (seconds < format[0]) {
                  if (typeof format[2] == 'string')
                      return format[list_choice];
                  else
                      return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
              }
          return time;
        }

        init();

    }

})(jQuery);
