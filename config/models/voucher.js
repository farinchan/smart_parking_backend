const { DataTypes } = require('sequelize');
const db = require("../database/mysql");

const voucher = db.define('voucher', {
    // Model attributes are defined here
    voucher_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    voucher_nomor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    voucher_nominal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    voucher_expired: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    voucher_digunakan: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    uid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    voucher_status: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    // Other model options go here
    freezeTableName: true,
    timestamps: false
});

// console.log(User === db.models.User); // true

module.exports = voucher