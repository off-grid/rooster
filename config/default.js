"use strict";

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var configs = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
var dbConfigs = JSON.parse(fs.readFileSync(path.join(__dirname, 'database.json')));
var auth = JSON.parse(fs.readFileSync(path.join(__dirname, 'auth.json')));
var env = process.env.envName || 'local';

var loadEnvVars = function (config) {
    return _.mapValues(config, function (val) {
        if (_.isObject(val) && _.has(val, 'ENV')) {
            return process.env[val.ENV];
        }
        return val;
    });
};

var config = loadEnvVars(configs[env]);
config.db = loadEnvVars(dbConfigs[env]);
config.auth = loadEnvVars(auth[env]);
config.envName = env;

console.log(' --- Configuring for ' + config.name + ' --- ');

module.exports = config;
