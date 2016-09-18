"use strict";

// TODO: Remove
var getBasicAuthHeader = function (username, password){
    return "Basic " + new Buffer(username + ":" + password).toString("base64");
};

module.exports = {
    getBasicAuthHeader: getBasicAuthHeader
}