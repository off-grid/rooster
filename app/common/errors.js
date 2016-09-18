"use strict";

var util = require("util");
var _ = require("lodash");

function UserExists(userName) {
    this.message = "User exists: " + userName;
}
util.inherits(UserExists, Error);

function UserNotFound(userName) {
    this.message = "User does not exist: " + userName;
}
util.inherits(UserNotFound, Error);

function Validation(errs) {
    this.message = _.pluck(errs, "message").join("; ");
}
util.inherits(Validation, Error);

function MissingArgument(argName) {
    this.message = "Missing argument: " + argName;
}
util.inherits(MissingArgument, Error);

module.exports = {
    UserExistsError: UserExists,
    UserNotFoundError: UserNotFound,
    ValidationError: Validation,
    MissingArgumentError: MissingArgument,
};
