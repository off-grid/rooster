"use strict";

var _ = require('lodash');
var expect = require('chai').expect;
var authenticationHelpers = require('../../app/common/authentication');
var bcrypt = require('bcryptjs');

describe('Authentication Helpers', function () {

    var testVariables = {
        password: 'password',
        payload: {
            key: "value"
        },
        testUser: {
            dataValues: {
                name: "test",
                email: "test@email.com",
                token: "testToken",
                password: "testPassword1"
            }
        }
    };

    before(function () {
        var configMock = {};
        configMock.auth = {};
        configMock.auth.secret = 'testsuitesecret';
        authenticationHelpers = authenticationHelpers(configMock);
    });

    describe('Password hashing', function () {
        it('should hash the password when a valid password is sent in', function (done) {
            var hash = authenticationHelpers.generateHashedPassword(testVariables.password);
            expect(bcrypt.compareSync(testVariables.password, hash)).to.equal(true);
            done();
        });

        it('should return true when the plaintext password and the corresponding hash is sent', function (done) {
            var hash = authenticationHelpers.generateHashedPassword(testVariables.password);
            expect(authenticationHelpers.isValidPassword(testVariables.password, hash)).to.equal(true);
            done();
        });

        it('should return false when the plaintext password doesnt match hash', function (done) {
            expect(authenticationHelpers.isValidPassword(testVariables.password, '')).to.equal(false);
            done();
        });
    });

    describe('Payload encoding and decoding', function () {
        it('should encode the payload into a token when a valid payload is sent', function (done) {
            var token = authenticationHelpers.encodePayload(testVariables.payload);
            expect(token).to.not.equal(testVariables.payload);
            done();
        });

        it('should decode to payload when a valid token corresponding to the payload is sent', function (done) {
            var token = authenticationHelpers.encodePayload(testVariables.payload);
            var payload = authenticationHelpers.decodePayload(token);
            expect(_.isEqual(payload, testVariables.payload)).to.equal(true);
            done();
        });
    });

    describe('Validate two users', function () {
        it('should return true when the two users are the same', function (done) {
            expect(authenticationHelpers.validateUser(testVariables.testUser, testVariables.testUser)).to.equal(true);
            done();
        });

        it('should return false when the two users have different names', function (done) {
            var modified = {};
            modified.dataValues = {};
            _.assign(modified.dataValues, testVariables.dataValues);
            modified.name = "";
            expect(authenticationHelpers.validateUser(testVariables.testUser, modified)).to.equal(false);
            done();
        });

        it('should return false when the two users have different email', function (done) {
            var modified = {};
            modified.dataValues = {};
            _.assign(modified.dataValues, testVariables.dataValues);
            modified.email = "";
            expect(authenticationHelpers.validateUser(testVariables.testUser, modified)).to.equal(false);
            done();
        });

        it('should return false when the two users have different token', function (done) {
            var modified = {};
            modified.dataValues = {};
            _.assign(modified.dataValues, testVariables.dataValues);
            modified.token = "";
            expect(authenticationHelpers.validateUser(testVariables.testUser, modified)).to.equal(false);
            done();
        });

        it('should return false when the two users have different password', function (done) {
            var modified = {};
            modified.dataValues = {};
            _.assign(modified.dataValues, testVariables.dataValues);
            modified.password = "";
            expect(authenticationHelpers.validateUser(testVariables.testUser, modified)).to.equal(false);
            done();
        });
    });

});
