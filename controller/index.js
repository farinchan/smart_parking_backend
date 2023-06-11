const controller = {}

//inisialisasi controller yang dibuat kesini
const auth = require("./auth")
const profile = require("./profile")
const saldo = require("./saldo")
const voucher = require("./voucher")
const parkir = require("./parkir")
const microcontroller = require("./microcontroller")
const example = require("./example")

controller.auth = auth;
controller.profile = profile;
controller.saldo = saldo;
controller.voucher = voucher;
controller.parkir = parkir;
controller.microcontroller = microcontroller;
controller.example = example;


module.exports = controller