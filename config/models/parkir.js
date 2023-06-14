const { DataTypes } = require('sequelize');
const db = require("../database/mysql");

const Parkir = db.define('parkir', {
    // Model attributes are defined here
    parkir_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    },
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    parkir_jenis_kendaraan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    parkir_masuk: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    parkir_keluar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parkir_foto_kendaraan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parkir_tarif: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    parkir_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    parkir_done: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    lokasi_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    // Other model options go here
    freezeTableName: true,
    timestamps: false
});

// console.log(User === db.models.User); // true

module.exports = Parkir