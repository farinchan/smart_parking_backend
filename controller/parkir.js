const { Op } = require('sequelize');
const model = require("../config/models/index")

let controller = {}

controller.index = async function (req, res) {


    let parkir = await model.parkir.findOne({
        where: { uid: req.user.user_id, parkir_status: 1 },
        order: [['parkir_masuk', 'DESC']],
    })

    let lokasiParkir = await model.LokasiParkir.findByPk(parkir.lokasi_id)
    //

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Mengatur waktu ke awal hari ini

    console.log(today);

    const count = await model.parkir.count({
        where: {
            lokasi_id: parkir.lokasi_id,
            parkir_status: 1,
            parkir_masuk: {
                [Op.gte]: today,
                [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Ditambahkan 1 hari ke waktu akhir untuk mencakup data hingga akhir hari ini
            },
        },
    });

    res.json({
        status: "success",
        message: "Berhasil Mengambil Data Tracking Parkir",
        parkir: { ...parkir.dataValues, ...lokasiParkir.dataValues, lokasi_slot_tersedia: lokasiParkir.lokasi_jumlah_slot - count }
    })

}

module.exports = controller;