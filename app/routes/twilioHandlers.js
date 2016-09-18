"use strict";

var _ = require('lodash');
var httpErrors = require('restify').errors;
var errors = require('../common/errors');
var sendError = require('../common/sendError');
var validateParams = require('../common/validateParams');

var accountSid = 'ACfdbfa61c4e8e51354235ebeaeb1088a9';
var authToken = '0477ba33e8b8fc8480ea0250c87841f8';
var twilio = require('twilio')(accountSid, authToken);

module.exports = function (twilioHelpers) {

    var receive = function receive(req, res, next) {
        res.setHeader('content-type', 'application/xml');
        var phoneNo = req.params.From;
        var fromCountry = req.params.FromCountry;
        var fromState = req.params.FromState;
        var fromCity = req.params.FromCity;

        twilioHelpers.getUserByPhoneNumber(phoneNo)
            .then(function(user){
                res.end(twilioHelpers.generateTwilioMessage("User already exists"));
                next();
            }).catch(errors.UserNotFoundError, function() {
                console.log("Creating a new user: ", phoneNo, fromCountry, fromState, fromCity);
                twilio.outgoingCallerIds.create({
                    phoneNumber: phoneNo,
                }, function(err, callerId){
                    if (err){
                        console.log('error registering the number: ', err);
                        next();
                    } else {
                        twilioHelpers.registerUser(phoneNo, fromCountry, fromState, fromCity)
                            .then(function (user) {
                                res.end(twilioHelpers.generateTwilioMessage("New user registered"));
                                next();
                            }).catch(errors.UserExistsError, sendError(httpErrors.ConflictError, next));
                    }
                });
            });
    };

    return {
        receive: receive,
    };
};
