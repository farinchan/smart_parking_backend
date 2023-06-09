const { DataTypes } = require('sequelize');
const db = require("../database/mysql");

const Saldo = db.define('saldo', {
    // Model attributes are defined here
    saldo_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    saldo_sisa: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    saldo_terpakai: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    // Other model options go here
    freezeTableName: true,
    timestamps: false
});

// console.log(User === db.models.User); // true

module.exports = Saldo