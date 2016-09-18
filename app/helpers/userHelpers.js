"use strict";

var _ = require('lodash');
var errors = require('../common/errors');

module.exports = function (models, authenticationHelpers) {

    var getUsers = function getUsers() {
        return models.User.findAll({include: [{model: models.Entry}]});
    };

    var getUser = function getUser(name) {
        return models.User.findAll({
            where: {name: name},
            include: [{model: models.Entry}]
        }).then(function (user) {
            if (user.length === 0) throw new errors.UserNotFoundError(name);
            else return user[0];
        });
    };

    var getUserByFilter = function getUserByFilter(filter) {
        return models.User.find({
            where: filter,
            include: [{model: models.Entry}]
        })
            .then(function (user) {
                if (user === null) {
                    throw new errors.UserNotFoundError(filter);
                } else {
                    return user;
                }
            });
    };

    var createUser = function createUser(userInfo) {
        return getUser(userInfo.name)
            .then(function () {
                throw new errors.UserExistsError(userInfo.name);
            }).catch(errors.UserNotFoundError, function () {
                // TODO: Validate params
                userInfo.token = authenticationHelpers.encodePayload(userInfo);
                userInfo.password = authenticationHelpers.generateHashedPassword(userInfo.password);
                return models.User.create({
                    name: userInfo.name,
                    password: userInfo.password,
                    email: userInfo.email,
                    token: userInfo.token
                });
            });
    };

    var deleteUser = function deleteUser(userName) {
        return models.User.find({where: {name: userName}})
            .then(function (user) {
                if (!_.isNull(user)) {
                    return user.destroy();
                }
            });
    };

    return {
        getUsers: getUsers,
        getUser: getUser,
        getUserByFilter: getUserByFilter,
        createUser: createUser,
        deleteUser: deleteUser
    };
};
