"use strict";

/**
 * Creates a helper function to send an error response back when catching an error.
 *
 * @param httpError The HTTP error to send back. See `restify.errors` for the available errors.
 * @param next The next middleware function to move to with the error.
 * @returns {Function} The function that handles the error sending
 */
module.exports = function sendError(httpError, next) {
    return function (err) {
        var errorInstance = new httpError(err.message);
        next(errorInstance);
    };
};
