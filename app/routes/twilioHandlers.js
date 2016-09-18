"use strict";

var _ = require('lodash');
var httpErrors = require('restify').errors;
var errors = require('../common/errors');
var sendError = require('../common/sendError');
var validateParams = require('../common/validateParams');
var twilio = require('twilio');
var reddit = require('../api/redditApi')();

module.exports = function (userHelpers) {

    var receive = function receive(req, res, next) {
        res.setHeader('content-type', 'application/xml');
        var url = "http://reddit.com/r/{subreddit}.json";

        reddit.getJsonByUrl(url.replace("{subreddit}",req.params.Body), function(message){
                res.end("<Response><Message>" + JSON.stringify(message) + "</Message></Response>");
            }
        );
        next();
    };

    return {
        receive: receive,
    };
};
