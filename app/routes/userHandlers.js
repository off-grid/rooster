"use strict";

var _ = require('lodash');
var httpErrors = require('restify').errors;
var errors = require('../common/errors');
var sendError = require('../common/sendError');
var validateParams = require('../common/validateParams');

module.exports = function (userHelpers) {

    var index = function index(req, res, next) {
        userHelpers.getUsers().then(function (users) {
            res.json(users);
            next();
        });
    };

    var view = function view(req, res, next) {
        res.json(200, req.user);
        next();
    };

    var createUser = function createUser(req, res, next) {
        validateParams([
            {name: 'name', in: req.body, required: true},
            {name: 'email', in: req.body, required: true},
            {name: 'password', in: req.body, required: true}
        ]).then(function () {
            var userInfo = _.pick(req.body, 'name', 'password', 'email');
            userHelpers.createUser(userInfo)
                .then(function (user) {
                    res.json(200, user);
                    next();
                })
                .catch(errors.UserExistsError, sendError(httpErrors.ConflictError, next));
        }).catch(errors.ValidationError, sendError(httpErrors.BadRequestError, next));

    };

    var del = function del(req, res, next) {
        userHelpers.deleteUser(req.user.name)
            .then(function () {
                res.send(204);
                next();
            });
    };

    return {
        index: index,
        view: view,
        createUser: createUser,
        del: del
    };
};
