"use strict";

var request = require('supertest');

var server = require('../../server');
var sequelize = server.db.sequelize;
var models = server.db.models;
var _ = require('lodash');
var expect = require('chai').expect;

describe('API - User Handler', function () {
    var api = request(server);

    before(function () {
        return sequelize.sync({force: true});
    });

    afterEach(function () {
        return sequelize.sync({force: true});
    });

    describe('GET /v1/users/', function () {

        var getEndpoint = function () {
            return '/v1/users/';
        };

        var testVariables = {
            hashedPassword: "$2a$10$rk0xPfrcfLkUwPyUuWBqpeE6FEX1WqrT.uVq6zbLnjNuJbKl3UhSO",
            name: "test-user",
            email: "test@user.com",
            unHashedPassword: "password",
            token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGVzdDEiLCJwYXNzd29yZCI6InBhc3N3b3JkIiwiZW1haWwiOiJ3cmFobWFuMEBnbWFpbC5jb20ifQ.dEfp5Gwe7t4ERDWu9T5KMOgKU8VM1emL6JMC8VPH4mY"
        };

        before(function () {
            return models.User.create({
                name: testVariables.name,
                password: testVariables.hashedPassword,
                email: testVariables.email,
                token: testVariables.token
            });
        });

        it('should return a user object when the credentials are valid', function (done) {
            api.get(getEndpoint())
                .auth(testVariables.name, testVariables.unHashedPassword)
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function (res) {
                    expect(res.body).to.have.all.keys('name', 'email', 'createdAt', 'updatedAt', 'id', 'password', 'token', 'entries');
                    expect(res.body.name).to.equal(testVariables.name);
                    expect(res.body.password).to.equal(testVariables.hashedPassword);
                    expect(res.body.email).to.equal(testVariables.email);
                })
                .end(done);
        });

        it('should return 401 when the username is invalid', function (done) {
            api.get(getEndpoint())
                .auth('invalid', testVariables.unHashedPassword)
                .expect('Content-Type', /json/)
                .expect(401, done);
        });

        it('should return 401 when the password is invalid', function (done) {
            api.get(getEndpoint())
                .auth(testVariables.name, 'invalid')
                .expect('Content-Type', /json/)
                .expect(401, done);
        });
    });

    describe('POST /v1/users/register', function () {

        var testVariables = {
            userObject: {
                name: "test1",
                email: "test@user.com",
                password: "password"
            }
        };

        var getEndpoint = function () {
            return '/v1/users/register';
        };

        it('should register a user when the correct parameters are sent', function(done){
             api.post(getEndpoint())
                 .send(testVariables.userObject)
                 .expect('Content-Type', /json/)
                 .expect(200)
                 .end(function(){
                     models.User.find({where:{name:testVariables.userObject.name}})
                         .then(function (user){
                             expect(user).to.not.equal(null);
                             expect(user.dataValues).to.have.all.keys('name', 'email', 'createdAt', 'updatedAt', 'id', 'password', 'token');
                             expect(user.name).to.equal(testVariables.userObject.name);
                             expect(user.email).to.equal(testVariables.userObject.email);
                             expect(user.password).to.not.equal(testVariables.userObject.password);
                             done();
                         });
                 })
        });

        it('should send error when the username are not sent', function(done){
            api.post(getEndpoint())
                .send(_.pick(testVariables.userObject, ['password', 'email']))
                .expect('Content-Type', /json/)
                .expect(400, done);
        });

        it('should send error when the email are not sent', function(done){
            api.post(getEndpoint())
                .send(_.pick(testVariables.userObject, ['password', 'name']))
                .expect('Content-Type', /json/)
                .expect(400, done);
        });

        it('should send error when the password are not sent', function(done){
            api.post(getEndpoint())
                .send(_.pick(testVariables.userObject, ['name', 'email']))
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
    });

    describe('DEL /v1/users/', function () {

        var getEndpoint = function () {
            return '/v1/users/';
        };

        var testVariables = {
            hashedPassword: "$2a$10$rk0xPfrcfLkUwPyUuWBqpeE6FEX1WqrT.uVq6zbLnjNuJbKl3UhSO",
            name: "test-user",
            email: "test@user.com",
            unHashedPassword: "password",
            token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidGVzdDEiLCJwYXNzd29yZCI6InBhc3N3b3JkIiwiZW1haWwiOiJ3cmFobWFuMEBnbWFpbC5jb20ifQ.dEfp5Gwe7t4ERDWu9T5KMOgKU8VM1emL6JMC8VPH4mY"
        };

        beforeEach(function () {
            return models.User.create({
                name: testVariables.name,
                password: testVariables.hashedPassword,
                email: testVariables.email,
                token: testVariables.token
            });
        });

        afterEach(function () {
            return sequelize.sync({force: true});
        });

        it('should delete a user when valid credentials are sent', function(done){
            api.del(getEndpoint())
                .auth(testVariables.name, testVariables.unHashedPassword)
                .expect(204)
                .end(function(){
                    models.User.find({where:{name: testVariables.name}})
                        .then(function(user){
                            expect(user).to.equal(null);
                            done();
                        })
                });
        });

        it('should not delete a user when invalid credentials are sent', function(done){
            api.del(getEndpoint())
                .auth('invalid', testVariables.unHashedPassword)
                .expect(401, done);
        });
    });
});
