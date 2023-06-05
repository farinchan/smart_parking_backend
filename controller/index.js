const controller = {}

//inisialisasi controller yang dibuat kesini
const auth = require("./auth")
const profile = require("./profile")
const saldo = require("./saldo")
const example = require("./example")

controller.auth = auth;
controller.profile = profile;
controller.saldo = saldo;
controller.example = example;


module.exports = controller