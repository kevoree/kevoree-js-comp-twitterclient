var AbstractComponent = require('kevoree-entities').AbstractComponent;
var Twitter = require('twitter');

/**
 * Kevoree component
 * @type {TwitterClient}
 */
var TwitterClient = AbstractComponent.extend({
    toString: 'TwitterClient',

    out_data: function () {},
    out_error: function () {},

    construct: function () {
        this.stream = null;
    },

    /* This is an example of dictionary attribute that you can set for your entity */
    dic_follow: {
        optional: true,
        defaultValue: ''
    },

    dic_track: {
        optional: true,
        defaultValue: ''
    },

    dic_consumer_key: {
        optional: false,
        defaultValue: ''
    },

    dic_consumer_secret: {
        optional: false,
        defaultValue: ''
    },

    dic_access_token_key: {
        optional: false,
        defaultValue: ''
    },

    dic_access_token_secret: {
        optional: false,
        defaultValue: ''
    },

    /**
     * this method will be called by the Kevoree platform when your component has to start
     * @param {Function} done
     */
    start: function (done) {
        this.log.debug(this.toString(), 'START');

        var client = new Twitter({
            consumer_key: this.dictionary.getString('consumer_key', ''),
            consumer_secret: this.dictionary.getString('consumer_secret', ''),
            access_token_key: this.dictionary.getString('access_token_key', ''),
            access_token_secret: this.dictionary.getString('access_token_secret', '')
        });

        var track = this.dictionary.getString('track', '');
        var follow = this.dictionary.getString('follow', '');
        var that = this;
        this.stream = client.stream('statuses/filter', {track: track, follow: follow});

        this.stream.on('data', function(tweet) {
            var jsonTweet = JSON.stringify(tweet);
            that.out_data(jsonTweet);
        });

        this.stream.on('error', function(error) {
            var jsonError = JSON.stringify(error);
            that.out_data(jsonError);
        });

        done();
    },

    update: function (done) {
        this.stop(function () {
            this.start(done);
        }.bind(this));
    },

    /**
     * this method will be called by the Kevoree platform when your component has to stop
     * @param {Function} done
     */
    stop: function (done) {
        this.log.debug(this.toString(), 'STOP');
        this.stream.destroy();
        done();
    }
    
});

module.exports = TwitterClient;
