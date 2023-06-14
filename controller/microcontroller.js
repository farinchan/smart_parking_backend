const model = require("../config/models/index")
var admin = require("firebase-admin");
const { Op } = require('sequelize');

var serviceAccount = require("../smart-paarking-firebase-adminsdk-nr2hq-4c48e47ee7.json");
const { parkir } = require(".");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


let controller = {}

controller.index = async function (req, res) {
    console.log(req.body);

    const uid = req.body.uid
    const parkir_masuk = req.body.parkir_masuk
    const jenis_kendaraan = req.body.jenis_kendaraan
    const tarif_kendaraan = parseInt(req.body.tarif_kendaraan)
    const foto_kendaraan = req.file !== undefined ? req.file.originalname : ''

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
                parkir_jenis_kendaraan: jenis_kendaraan,
                parkir_masuk: parkir_masuk,
                parkir_keluar: "",
                parkir_foto_kendaraan: foto_kendaraan,
                parkir_tarif: tarif_kendaraan,
                parkir_status: 0,
                lokasi_id: 0
            })
            saldo.update({
                saldo_sisa: saldo.saldo_sisa - tarif_kendaraan,
                saldo_terpakai: saldo.saldo_terpakai + tarif_kendaraan
            })

            function fuzzy_sugeno_roda2(input_jarak, input_kapasitas) {
                // Input variabel jarak
                let j_dekat, j_sedang, j_jauh;
                if (input_jarak <= 155) {
                    j_dekat = 1;
                } else if (input_jarak >= 155 && input_jarak <= 310) {
                    j_dekat = (310 - input_jarak) / 155;
                } else if (input_jarak >= 310) {
                    j_dekat = 0;
                }

                if (input_jarak <= 155 || input_jarak >= 465) {
                    j_sedang = 0;
                } else if (input_jarak >= 155 && input_jarak <= 310) {
                    j_sedang = (input_jarak - 155) / 155;
                } else if (input_jarak >= 310 && input_jarak <= 465) {
                    j_sedang = (465 - input_jarak) / 155;
                }

                if (input_jarak <= 310) {
                    j_jauh = 0;
                } else if (input_jarak >= 310 && input_jarak <= 465) {
                    j_jauh = (input_jarak - 310) / 155;
                } else if (input_jarak >= 465) {
                    j_jauh = 1;
                }

                // Input variabel kapasitas
                let k_longgar, k_cukup, k_padat;
                if (input_kapasitas <= 20) {
                    k_longgar = 1;
                } else if (input_kapasitas >= 20 && input_kapasitas <= 50) {
                    k_longgar = (50 - input_kapasitas) / 30;
                } else if (input_kapasitas >= 50) {
                    k_longgar = 0;
                }

                if (input_kapasitas <= 20 || input_kapasitas >= 80) {
                    k_cukup = 0;
                } else if (input_kapasitas >= 20 && input_kapasitas <= 50) {
                    k_cukup = (input_kapasitas - 20) / 30;
                } else if (input_kapasitas >= 50 && input_kapasitas <= 80) {
                    k_cukup = (80 - input_kapasitas) / 30;
                }

                if (input_kapasitas <= 50) {
                    k_padat = 0;
                } else if (input_kapasitas >= 50 && input_kapasitas <= 80) {
                    k_padat = (input_kapasitas - 50) / 30;
                } else if (input_kapasitas >= 80) {
                    k_padat = 1;
                }

                // Nilai jarak
                let nilai_jarak, nilai_kapasitas;
                if (j_dekat > j_sedang) {
                    nilai_jarak = j_dekat;
                } else if (j_sedang > j_jauh) {
                    nilai_jarak = j_sedang;
                } else {
                    nilai_jarak = j_jauh;
                }

                // Nilai kapasitas
                if (k_longgar > k_cukup) {
                    nilai_kapasitas = k_longgar;
                } else if (k_cukup > k_padat) {
                    nilai_kapasitas = k_cukup;
                } else {
                    nilai_kapasitas = k_padat;
                }

                const rendah = 40;
                const sedang = 60;
                const tinggi = 80;

                // Rule
                const a_rule1 = Math.min(k_longgar, j_dekat);
                const a_rule2 = Math.min(k_longgar, j_sedang);
                const a_rule3 = Math.min(k_longgar, j_jauh);
                const a_rule4 = Math.min(k_cukup, j_dekat);
                const a_rule5 = Math.min(k_cukup, j_sedang);
                const a_rule6 = Math.min(k_cukup, j_jauh);
                const a_rule7 = Math.min(k_padat, j_dekat);
                const a_rule8 = Math.min(k_padat, j_sedang);
                const a_rule9 = Math.min(k_padat, j_jauh);

                // Jumlah ai.zi
                const jml_aizi =
                    a_rule1 * tinggi +
                    a_rule2 * tinggi +
                    a_rule3 * sedang +
                    a_rule4 * tinggi +
                    a_rule5 * sedang +
                    a_rule6 * rendah +
                    a_rule7 * sedang +
                    a_rule8 * rendah +
                    a_rule9 * rendah;
                // Jumlah ai
                const jml_ai =
                    a_rule1 +
                    a_rule2 +
                    a_rule3 +
                    a_rule4 +
                    a_rule5 +
                    a_rule6 +
                    a_rule7 +
                    a_rule8 +
                    a_rule9;

                // Difuzzyfikasi
                const hasil_fuzzy_sugeno = jml_aizi / jml_ai;
                return hasil_fuzzy_sugeno;
            }

            function fuzzy_sugeno_roda4(input_jarak, input_kapasitas) {
                // Input variabel jarak
                let j_dekat, j_sedang, j_jauh;
                if (input_jarak <= 155) {
                    j_dekat = 1;
                } else if (input_jarak >= 155 && input_jarak <= 310) {
                    j_dekat = (310 - input_jarak) / 155;
                } else if (input_jarak >= 310) {
                    j_dekat = 0;
                }

                if (input_jarak <= 155 || input_jarak >= 465) {
                    j_sedang = 0;
                } else if (input_jarak >= 155 && input_jarak <= 310) {
                    j_sedang = (input_jarak - 155) / 155;
                } else if (input_jarak >= 310 && input_jarak <= 465) {
                    j_sedang = (465 - input_jarak) / 155;
                }

                if (input_jarak <= 310) {
                    j_jauh = 0;
                } else if (input_jarak >= 310 && input_jarak <= 465) {
                    j_jauh = (input_jarak - 310) / 155;
                } else if (input_jarak >= 465) {
                    j_jauh = 1;
                }

                // Input variabel kapasitas
                let k_longgar, k_cukup, k_padat;
                if (input_kapasitas <= 8) {
                    k_longgar = 1;
                } else if (input_kapasitas >= 8 && input_kapasitas <= 16) {
                    k_longgar = (16 - input_kapasitas) / 8;
                } else if (input_kapasitas >= 16) {
                    k_longgar = 0;
                }

                if (input_kapasitas <= 8 || input_kapasitas >= 32) {
                    k_cukup = 0;
                } else if (input_kapasitas >= 8 && input_kapasitas <= 16) {
                    k_cukup = (input_kapasitas - 8) / 8;
                } else if (input_kapasitas >= 16 && input_kapasitas <= 32) {
                    k_cukup = (32 - input_kapasitas) / 16;
                }

                if (input_kapasitas <= 16) {
                    k_padat = 0;
                } else if (input_kapasitas >= 16 && input_kapasitas <= 32) {
                    k_padat = (input_kapasitas - 16) / 16;
                } else if (input_kapasitas >= 32) {
                    k_padat = 1;
                }

                // Nilai jarak
                let nilai_jarak, nilai_kapasitas;
                if (j_dekat > j_sedang) {
                    nilai_jarak = j_dekat;
                } else if (j_sedang > j_jauh) {
                    nilai_jarak = j_sedang;
                } else {
                    nilai_jarak = j_jauh;
                }

                // Nilai kapasitas
                if (k_longgar > k_cukup) {
                    nilai_kapasitas = k_longgar;
                } else if (k_cukup > k_padat) {
                    nilai_kapasitas = k_cukup;
                } else {
                    nilai_kapasitas = k_padat;
                }

                const rendah = 40;
                const sedang = 60;
                const tinggi = 80;

                // Rule
                const a_rule1 = Math.min(k_longgar, j_dekat);
                const a_rule2 = Math.min(k_longgar, j_sedang);
                const a_rule3 = Math.min(k_longgar, j_jauh);
                const a_rule4 = Math.min(k_cukup, j_dekat);
                const a_rule5 = Math.min(k_cukup, j_sedang);
                const a_rule6 = Math.min(k_cukup, j_jauh);
                const a_rule7 = Math.min(k_padat, j_dekat);
                const a_rule8 = Math.min(k_padat, j_sedang);
                const a_rule9 = Math.min(k_padat, j_jauh);

                // Jumlah ai.zi
                const jml_aizi =
                    a_rule1 * tinggi +
                    a_rule2 * tinggi +
                    a_rule3 * sedang +
                    a_rule4 * tinggi +
                    a_rule5 * sedang +
                    a_rule6 * rendah +
                    a_rule7 * sedang +
                    a_rule8 * rendah +
                    a_rule9 * rendah;
                // Jumlah ai
                const jml_ai =
                    a_rule1 +
                    a_rule2 +
                    a_rule3 +
                    a_rule4 +
                    a_rule5 +
                    a_rule6 +
                    a_rule7 +
                    a_rule8 +
                    a_rule9;

                // Difuzzyfikasi
                const hasil_fuzzy_sugeno = jml_aizi / jml_ai;
                return hasil_fuzzy_sugeno;
            }



            const slot_tersedia = async (lokasiId) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Mengatur waktu ke awal hari ini
                return await model.parkir.count({
                    where: {
                        lokasi_id: lokasiId,
                        parkir_status: 1,
                        parkir_masuk: {
                            [Op.gte]: today,
                            [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Ditambahkan 1 hari ke waktu akhir untuk mencakup data hingga akhir hari ini
                        },
                    },
                });
            }

            let lokasi_parkir = []
            if (jenis_kendaraan == "roda 4" || jenis_kendaraan == "roda 4\\n") {
                const lokasi = await model.LokasiParkir.findAndCountAll({ where: { lokasi_jenis: "roda 4" } });
                for (let index = 0; index < lokasi.count; index++) {
                    let slotTersedia = await slot_tersedia(lokasi.rows[index].lokasi_id)
                    lokasi_parkir.push({
                        lokasi_id: lokasi.rows[index].lokasi_id,
                        nama: lokasi.rows[index].lokasi_nama,
                        jenis: lokasi.rows[index].lokasi_jenis,
                        slot_tersedia: lokasi.rows[index].lokasi_jumlah_slot - slotTersedia,
                        jumlah_slot: lokasi.rows[index].lokasi_jumlah_slot,
                        nilai_rekomendasi: fuzzy_sugeno_roda4(lokasi.rows[index].lokasi_jarak, slotTersedia)
                    })
                }
                lokasi_parkir.sort((a, b) => b.nilai_rekomendasi - a.nilai_rekomendasi);
            } else if (jenis_kendaraan == "roda 2" || jenis_kendaraan == "roda 2\\n") {
                const lokasi = await model.LokasiParkir.findAndCountAll({ where: { lokasi_jenis: "roda 2" } });
                for (let index = 0; index < lokasi.count; index++) {
                    let slotTersedia = await slot_tersedia(lokasi.rows[index].lokasi_id)
                    lokasi_parkir.push({
                        lokasi_id: lokasi.rows[index].lokasi_id,
                        nama: lokasi.rows[index].lokasi_nama,
                        jenis: lokasi.rows[index].lokasi_jenis,
                        slot_tersedia: lokasi.rows[index].lokasi_jumlah_slot - slotTersedia,
                        jumlah_slot: lokasi.rows[index].lokasi_jumlah_slot,
                        nilai_rekomendasi: fuzzy_sugeno_roda2(lokasi.rows[index].lokasi_jarak, slotTersedia)
                    })
                }
                lokasi_parkir.sort((a, b) => b.nilai_rekomendasi - a.nilai_rekomendasi);
            }


            // This registration token comes from the client FCM SDKs.
            const registrationToken = user.user_fcm;

            const message = {
                notification: {
                    title: 'Scan Parkir Berhasil',
                    body: 'Berhasil Mendapatkan Rekomendasi Tempat Parkir'
                },
                data: {
                    parkir_id: JSON.stringify(parkir.parkir_id),
                    lokasi_parkir: JSON.stringify(lokasi_parkir)
                },
                token: registrationToken
            };
            console.log(message);

            // Send a message to the device corresponding to the provided
            // registration token.
            admin.messaging().send(message)
                .then((response) => {
                    // Response is a message ID string.
                    console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });


            res.json({
                messsage: "success",
                parkir,
                saldo
            })
        }

    } else {
        res.json({
            status: "failed",
            messsage: "User Tidak Ada"
        })
    }



};

controller.pesanParkir = async function (req, res) {

    const id_parkir = req.body.id_parkir
    const lokasi_id = req.body.lokasi_id


    let parkir = await model.parkir.findOne({
        where: { parkir_id: id_parkir, uid: req.user.user_id }
    })

    parkir.update({
        lokasi_id
    })

    res.json({
        status: "success",
        message: "Berhasil Mengambil Lokasi Parkir",
        parkir
    })

}

controller.gate2 = async function (req, res) {

    const uid = req.body.uid

    console.log(req.body);

    let parkir = await model.parkir.findOne({
        where: { uid: uid, parkir_status: 1 },
        order: [['parkir_masuk', 'DESC']],
    })
    console.log(parkir);

    let lokasiParkir = await model.LokasiParkir.findByPk(parkir.lokasi_id)

    const CheckParkir = { ...parkir.dataValues, ...lokasiParkir.dataValues }

    if (CheckParkir.lokasi_nama == "A1") {
        res.status(200).json({
            status: "success",
            message: "Silahkan Masuk"
        })
    } else {
        res.status(400).json({
            status: "failed",
            message: "Anda Salah Tempat"
        })
    }


}
controller.gate3 = async function (req, res) {

    const uid = req.body.uid

    let parkir = await model.parkir.findOne({
        where: { uid: uid, parkir_status: 1 },
        order: [['parkir_masuk', 'DESC']],
    })
    console.log(parkir);
    let lokasiParkir = await model.LokasiParkir.findByPk(parkir.lokasi_id)

    const CheckParkir = { ...parkir.dataValues, ...lokasiParkir.dataValues }

    if (CheckParkir.lokasi_nama == "A2") {
        res.status(200).json({
            status: "success",
            message: "Silahkan Masuk"
        })
    } else {
        res.status(400).json({
            status: "failed",
            message: "Anda Salah Tempat Parkir"
        })
    }


}

controller.gate4 = async function (req, res) {

    const uid = req.body.uid

    let parkir = await model.parkir.findOne({
        where: { uid: uid, parkir_status: 1 },
        order: [['parkir_masuk', 'DESC']],
    })
    console.log(parkir);
    let lokasiParkir = await model.LokasiParkir.findByPk(parkir.lokasi_id)

    const CheckParkir = { ...parkir.dataValues, ...lokasiParkir.dataValues }

    if (CheckParkir.lokasi_nama == "B1") {
        res.status(200).json({
            status: "success",
            message: "Silahkan Masuk"
        })
    } else {
        res.status(400).json({
            status: "failed",
            message: "Anda Salah Tempat Parkir"
        })
    }


}

controller.gate5 = async function (req, res) {

    const uid = req.body.uid

    let parkir = await model.parkir.findOne({
        where: { uid: uid, parkir_status: 1 },
        order: [['parkir_masuk', 'DESC']],
    })
    console.log(parkir);
    let lokasiParkir = await model.LokasiParkir.findByPk(parkir.lokasi_id)

    const CheckParkir = { ...parkir.dataValues, ...lokasiParkir.dataValues }

    if (CheckParkir.lokasi_nama == "B2") {
        res.status(200).json({
            status: "success",
            message: "Silahkan Masuk"
        })
    } else {
        res.status(400).json({
            status: "failed",
            message: "Anda Salah Tempat Parkir"
        })
    }


}

controller.gate6 = async function (req, res) {

    const uid = req.body.uid

    let parkir = await model.parkir.findOne({
        where: { uid: uid, parkir_status: 1 },
        order: [['parkir_masuk', 'DESC']],
    })




    console.log(parkir);
    let lokasiParkir = await model.LokasiParkir.findByPk(parkir.lokasi_id)

    const CheckParkir = { ...parkir.dataValues, ...lokasiParkir.dataValues }

    if (CheckParkir.lokasi_nama == "C1") {

        if (parkir_done == false) {
            if (parkir.parkir_status == 0) {
                parkir.update({
                    parkir_status: 1
                })

            } else if (parkir.parkir_status == 1) {
                parkir.update({
                    parkir_status: 0,
                    parkir_done: 1
                })
            }
            res.status(200).json({
                status: "success",
                message: "Silahkan Masuk"
            })
        } else {
            res.status(400).json({
                status: "failed",
                message: "anda sudah melakukan parkir"
            })
        }

    } else {
        res.status(400).json({
            status: "failed",
            message: "Anda Salah Tempat Parkir"
        })
    }
}


controller.gate7 = async function (req, res) {

    const uid = req.body.uid

    let parkir = await model.parkir.findOne({
        where: { uid: uid, parkir_status: 1 },
        order: [['parkir_masuk', 'DESC']],
    })
    console.log(parkir);
    let lokasiParkir = await model.LokasiParkir.findByPk(parkir.lokasi_id)

    const CheckParkir = { ...parkir.dataValues, ...lokasiParkir.dataValues }

    if (CheckParkir.lokasi_nama == "C2") {
        res.status(200).json({
            status: "success",
            message: "Silahkan Masuk"
        })
    } else {
        res.status(400).json({
            status: "failed",
            message: "Anda Salah Tempat Parkir"
        })
    }
}


module.exports = controller;