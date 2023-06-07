const model = require("../config/models/index")

let controller = {}

controller.index = async function (req, res) {

    const uid = req.body.uid
    const parkir_masuk = req.body.parkir_masuk

    let user = await model.user.findOne({ where: { uid: uid }, })
    if (user !== null) {
        let saldo = await model.saldo.findOne({ where: { uid: uid }, })
        console.log("Sisa Saldo : " + saldo.saldo_sisa);
        if (saldo.saldo_sisa < 4000) {
            res.json({
                status: "failed",
                messsage: "Saldo Kamu Tidak Mencukupi"
            })
        }
        else {
            let parkir = await model.parkir.create({
                uid: uid,
                parkir_jenis_kendaraan: "",
                parkir_masuk: parkir_masuk,
                parkir_keluar: "",
                parkir_foto_kendaraan: "",
                parkir_tarif: 0,
                parkir_status: 1,
                lokasi_id: 0
            })
            res.json({
                messsage: "success",
                parkir
            })
        }

    } else {
        res.json({
            status: "failed",
            messsage: "User Tidak Ada"
        })
    }



};

module.exports = controller;