const model = require("../config/models/index")

const currentDate = new Date();
const formattedDate = currentDate.toISOString().split('T')[0];

let controller = {}

controller.topup = async (req, res) => {

    const noVoucher = req.body.no_voucher

    const voucher = await model.voucher.findOne({ where: { voucher_nomor: noVoucher } })
    if (voucher !== null) {
        voucher.update({
            voucher_digunakan: formattedDate,
            uid: req.user.user_id,
            voucher_status: 1
        })

        let saldo = await model.saldo.findOne({
            where: { uid: req.user.user_id },
        })

        saldo.update({
            saldo_sisa: saldo.saldo_sisa + voucher.voucher_nominal
        })
        let isi_saldo = await model.IsiSaldo.create({
            uid: req.user.user_id,
            isi_saldo_tanggal: formattedDate,
            isi_saldo_jumlah: voucher.voucher_nominal,
            admin_id: 555
        })


        res.json({
            status: "success",
            message: "Voucher Used Sucessfully",
            voucher,
            saldo,
            isi_saldo
        });
    } else {
        res.status(400).json({ status: "failed", message: "Voucher Not Found" })
    }

};

module.exports = controller;