const { DataTypes } = require('sequelize');
const db = require("../database/mysql");

const LokasiParkir = db.define('lokasi_parkir', {
    // Model attributes are defined here
    lokasi_id : {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true
    },
    lokasi_nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lokasi_Longtitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lokasi_Latitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lokasi_jarak: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lokasi_slot_tersedia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lokasi_jumlah_slot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lokasi_jumlah_slot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lokasi_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    // Other model options go here
    freezeTableName: false,
    timestamps: false
});

// console.log(User === db.models.User); // true

module.exports = LokasiParkir