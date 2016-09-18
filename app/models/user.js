"use strict";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        name: {type: DataTypes.STRING},
        password: {type: DataTypes.STRING},
        token: {type: DataTypes.STRING},
        email: {type: DataTypes.STRING}
    }, {
        timestamps: true,
        indexes: [
            {fields: ['name'], method: 'BTREE'},
            {fields: ['id'], method: 'BTREE'},
            {fields: ['token'], method: 'BTREE'}
        ]
    });
};
