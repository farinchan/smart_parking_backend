const { DataTypes } = require('sequelize');
const db = require("../database/mysql");

const IsiSaldo = db.define('isi_saldo', {
    // Model attributes are defined here
    isi_saldo_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
    },
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isi_saldo_tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    isi_saldo_jumlah: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
}, {
    // Other model options go here
    freezeTableName: true,
    timestamps: false
});

// console.log(User === db.models.User); // true

module.exports = IsiSaldo