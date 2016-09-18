"use strict";

var _ = require('lodash');
var errors = require('../common/errors');

module.exports = function (models, authenticationHelpers) {

    var getUserByPhoneNumber = function getUserByPhoneNumber(phoneNo) {
        return models.User.findAll({
            where: {phone: phoneNo}
        }).then(function (user) {
            if (user.length === 0) throw new errors.UserNotFoundError(phoneNo);
            else return user[0];
        })
    }

    var registerUser = function registerUser(phoneNo, country, state, city) {
        return getUserByPhoneNumber(phoneNo)
            .then(function () {
                throw new errors.UserExistsError(phoneNo)
            }).catch(errors.UserNotFoundError, function () {
                return models.User.create({
                    phone: phoneNo,
                    city: city,
                    country: country,
                    state: state
                });
            });
    }

    var generateTwilioMessage = function generateTwilioMessage(message){
        // TODO: @Wasiur fix it: possible code injection
        return "<Response><Message>" + message + "</Message></Response>";
    }

    return {
        getUserByPhoneNumber: getUserByPhoneNumber,
        registerUser: registerUser,
        generateTwilioMessage: generateTwilioMessage,
    };
};
