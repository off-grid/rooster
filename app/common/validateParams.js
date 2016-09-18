"use strict";

var Promise = require('bluebird');
var _ = require('lodash');
var errors = require('./errors');

module.exports = function (params) {
    var exists = function (value) {
        return !(_.isUndefined(value) || _.isNull(value) || _.isEmpty(value));
    };

    if (process.env.NODE_ENV !== "production") {
        _.forEach(params, function (param) {
            if (!_.has(param, "required") && !(_.has(param, "validator") && _.has(param, "error"))) {
                throw "Validator for " + param.name + " must be required and/or define a validator.";
            }
        });
    }

    var validate = function (param) {
        var value = param.in[param.name];
        if (exists(value) && param.validator) {
            return Promise.resolve(param.validator(value)).then(function (result) {
                if (!result) {
                    return Promise.reject(new param.error(param.name));
                }
                return result;
            });
        } else if (param.required && !exists(value)) {
            return Promise.reject(new errors.MissingArgumentError(param.name));
        } else {
            return true;
        }
    };

    return Promise.settle(_.map(params, validate)).then(function (results) {
        var rejections = _.filter(results, function (r) {
            return r.isRejected();
        });
        if (!_.isEmpty(rejections)) {
            throw new errors.ValidationError(_.map(rejections, function (r) {
                return r.reason();
            }));
        }
    });
};
