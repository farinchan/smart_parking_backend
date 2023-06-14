const { Op } = require('sequelize');
const model = require("../config/models/index")

var admin = require("firebase-admin");

let controller = {}

controller.index = async function (req, res) {


    let parkir = await model.parkir.findOne({
        where: { uid: req.user.user_id, parkir_done: 0 },
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

controller.riwayat = async function (req, res) {

    const filter = req.body.filter
    const uid = req.user.user_id

    let parkirFilter
    if (filter == 1) {
        //filter untuk hari ini
        parkirFilter = await model.parkir.findAll({
            where: {
                uid: req.user.user_id,
                parkir_masuk: {
                    [Op.gte]: new Date(new Date().setHours(0, 0, 0)), // Tanggal mulai hari ini
                    [Op.lt]: new Date(new Date().setHours(23, 59, 59)),
                }

            },
        })
    } else if (filter == 2) {
        // filter untuk besok
        parkirFilter = await model.parkir.findAll({
            where: {
                uid: req.user.user_id,
                parkir_masuk: {
                    [Op.gte]: new Date(new Date().setHours(0, 0, 0)) - 24 * 60 * 60 * 1000, // Tanggal mulai kemarin
                    [Op.lt]: new Date(new Date().setHours(23, 59, 59)) - 24 * 60 * 60 * 1000, // Tanggal akhir kemarin
                },
            }
        });
    } else if (filter == 3) {
        // filter untuk minggu ini
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Mengatur hari menjadi hari Minggu
        startOfWeek.setHours(0, 0, 0); // Mengatur jam menjadi 00:00:00
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 7); // Mengatur akhir minggu
        endOfWeek.setHours(23, 59, 59); // Mengatur jam menjadi 23:59:59
        parkirFilter = await model.parkir.findAll({
            where: {
                uid: req.user.user_id,
                parkir_masuk: {
                    [Op.gte]: startOfWeek,
                    [Op.lt]: endOfWeek,
                }
            }
        });
    } else if (filter == 4) {
        // filter untuk bulan ini
        const startOfMonth = new Date();
        startOfMonth.setDate(1); // Mengatur hari menjadi tanggal 1
        startOfMonth.setHours(0, 0, 0); // Mengatur jam menjadi 00:00:00
        const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0, 23, 59, 59); // Mengatur akhir bulan
        parkirFilter = await model.parkir.findAll({
            where: {
                uid: req.user.user_id,
                parkir_masuk: {
                    [Op.gte]: startOfMonth,
                    [Op.lt]: endOfMonth,
                },
            }
        });
    } else if (filter == 5) {
        // filter untuk Tahun ini
        const startOfYear = new Date(new Date().getFullYear(), 0, 1); // Mengatur tanggal menjadi 1 Januari
        startOfYear.setHours(0, 0, 0); // Mengatur jam menjadi 00:00:00
        const endOfYear = new Date(new Date().getFullYear() + 1, 0, 0, 23, 59, 59); // Mengatur akhir tahun
        parkirFilter = await model.parkir.findAll({
            where: {
                uid: req.user.user_id,
                parkir_masuk: {
                    [Op.gte]: startOfYear,
                    [Op.lt]: endOfYear,
                },
            }
        });
    }


    res.json({
        status: "success",
        message: "Berhasil Mendapatkan Filter Parkir",
        riwayat: parkirFilter
    })

}


controller.changeParkir = async function (req, res) {

    const parkirId = req.body.parkir_id

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

    const parkir = await model.parkir.findByPk(parkirId)
    let user = await model.user.findOne({ where: { uid: req.user.user_id }, })

    if (parkir.parkir_status == false && parkir.parkir_done == false) {


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
        if (parkir.jenis_kendaraan == "roda 4" || parkir.jenis_kendaraan == "roda 4\\n") {
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
        } else if (parkir.jenis_kendaraan == "roda 2" || parkir.jenis_kendaraan == "roda 2\\n") {
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

    }

    res.json({
        status: "success",
        message: "berhasil",
        parkir
    })
}

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

module.exports = controller;