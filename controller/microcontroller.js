const model = require("../config/models/index")
var admin = require("firebase-admin");

var serviceAccount = require("../smart-paarking-firebase-adminsdk-nr2hq-4c48e47ee7.json");

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
                parkir_status: 1,
                lokasi_id: 0
            })
            saldo.update({
                saldo_sisa: saldo.saldo_sisa - tarif_kendaraan,
                saldo_terpakai: saldo.saldo_terpakai + tarif_kendaraan
            })

            function fuzzy_sugeno(input_jarak, input_kapasitas) {
                // Input variabel jarak
                let j_dekat, j_sedang, j_jauh;
                if (input_jarak <= 200) {
                    j_dekat = 1;
                } else if (input_jarak >= 200 && input_jarak <= 400) {
                    j_dekat = (400 - input_jarak) / 200;
                } else if (input_jarak >= 400) {
                    j_dekat = 0;
                }

                if (input_jarak <= 200 || input_jarak >= 600) {
                    j_sedang = 0;
                } else if (input_jarak >= 200 && input_jarak <= 400) {
                    j_sedang = (input_jarak - 200) / 200;
                } else if (input_jarak >= 400 && input_jarak <= 600) {
                    j_sedang = (600 - input_jarak) / 200;
                }

                if (input_jarak <= 400) {
                    j_jauh = 0;
                } else if (input_jarak >= 400 && input_jarak <= 600) {
                    j_jauh = (input_jarak - 400) / 200;
                } else if (input_jarak >= 600) {
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

            const lokasi = await model.LokasiParkir.findAndCountAll();

            let lokasi_parkir = []
            if (lokasi != {}) {
                lokasi.rows.forEach(element => {
                    lokasi_parkir.push({
                        lokasi_id: element.lokasi_id,
                        nama: element.lokasi_nama,
                        jenis: element.lokasi_jenis,
                        slot_tersedia: element.lokasi_slot_tersedia,
                        jumlah_slot: element.lokasi_jumlah_slot,
                        nilai_rekomendasi: fuzzy_sugeno(element.lokasi_jarak, element.lokasi_slot_tersedia)
                    })
                });
            }
            lokasi_parkir.sort((a, b) => b.nilai_rekomendasi - a.nilai_rekomendasi);
            // This registration token comes from the client FCM SDKs.
            const registrationToken = user.user_fcm;

            const message = {
                notification: {
                    title: 'Scan Parkir Berhasil',
                    body: 'Berhasil Mendapatkan Rekomendasi Tempat Parkir'
                },
                data: {

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
        messsage: "Parkir Successfully",
        parkir
    })

}

module.exports = controller;