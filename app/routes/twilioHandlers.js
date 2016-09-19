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
                twilio.outgoingCallerIds.create({
                    phoneNumber: phoneNo,
                }, function(err, callerId){
                    if (err && err.code !== twilioHelpers.NUMBER_EXISTS_ERR_CODE){
                        console.log('Error registering the number: ', err);
                        next();
                    } else if (err && err.code === twilioHelpers.NUMBER_EXISTS_ERR_CODE){
                        // Number is registered but not in our db
                        res.end(twilioHelpers.generateTwilioMessage("User already exists. Syncing with db..."));
                        twilioHelpers.registerUser(phoneNo, fromCountry, fromState, fromCity)
                            .then(function (user) {
                                res.end(twilioHelpers.generateTwilioMessage("New user registered"));
                                next();
                            }).catch(errors.UserExistsError, sendError(httpErrors.ConflictError, next));
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

    var register = function register(req, res, next){
        twilio.outgoingCallerIds.list(function(err, data) {
            var phone = req.params.phone;
            var response = {
                verified: false,
                validationCode: null
            };

            data.outgoingCallerIds.forEach(function(callerId) {
                if (callerId.phoneNumber === phone){
                    response.verified = true;
                }
            });

            if (!response.verified) {
                twilio.outgoingCallerIds.create({
                    phoneNumber: phone,
                }, function(err, callerId){
                    console.log("CallerID: ", callerId);
                    response.validationCode = callerId.validationCode;
                    res.json(200, response);
                    next();
                });
            } else {
                res.json(200, response);
                next();
            }
        });
    };

    var statusCheck = function statusCheck(req, res, next){

    };

    return {
        receive: receive,
        register: register,
        statusCheck: statusCheck,
    };
};
