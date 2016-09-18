"use strict";

var _ = require('lodash');
var httpErrors = require('restify').errors;
var errors = require('../common/errors');
var sendError = require('../common/sendError');
var validateParams = require('../common/validateParams');
var twilio = require('twilio');

module.exports = function (userHelpers) {

    var receive = function receive(req, res, next) {
        res.setHeader('content-type', 'application/xml');
        res.end("<Response><Message>Wasiur is the best!</Message></Response>");
        next();
    };

    return {
        receive: receive,
    };
};
