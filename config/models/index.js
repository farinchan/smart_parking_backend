let model = {}

const user = require("./users")
const saldo = require("./saldo")
const voucher = require("./voucher")
const IsiSaldo = require("./isi_saldo")
const LokasiParkir = require("./lokasi_parkir")
const parkir = require("./parkir")

model.user = user
model.saldo = saldo
model.voucher = voucher
model.IsiSaldo = IsiSaldo
model.LokasiParkir = LokasiParkir
model.parkir = parkir

module.exports = model; 