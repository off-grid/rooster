"use strict";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        phone: {type: DataTypes.STRING},
        city: {type: DataTypes.STRING},
        country: {type: DataTypes.STRING},
        state: {type: DataTypes.STRING},
    }, {
        timestamps: true,
        indexes: [
            {fields: ['id'], method: 'BTREE'},
            {fields: ['phone'], method: 'BTREE'},
        ]
    });
};
