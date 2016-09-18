"use strict";

var Sequelize = require('sequelize');

module.exports = function (config) {
    return new Sequelize(config.db.database, config.db.user, config.db.password, {
        host: config.db.host,
        dialect: config.db.driver,
        port: config.db.port
    });
};
