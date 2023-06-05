const { DataTypes } = require('sequelize');
const db = require("../database/mysql");

const User = db.define('user', {
    // Model attributes are defined here
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    user_nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_telegram: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    // Other model options go here
    freezeTableName: true,
    timestamps: false
});

// console.log(User === db.models.User); // true

module.exports = User