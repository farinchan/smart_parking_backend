const validation = require("../helpers/validation")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const model = require("../config/models/index");

let controller = {}

controller.register = async (req, res) => {

    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const password = req.body.password

    //validation Data Check Before create new user
    const validationError = validation.registerValidation(req.body).error
    if (validationError) return res.status(400).json({ message: validationError.details[0].message })

    const checkEmail = await model.user.findOne({ where: { user_email: email } });
    if (checkEmail !== null) {
        res.status(400).json({
            message: "Email Already Exist"
        })

    } else {
        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashingPassword = await bcrypt.hash(password, salt)
        let random = (Math.random() + 1).toString(36).substring(7);
        const result = await model.user.create({
            uid: random,
            user_nama: name,
            user_phone: phone,
            user_email: email,
            user_password: hashingPassword,
            user_telegram: "",
            user_status: 1
        })

        const saldo = await model.saldo.create({
            uid: random,
            saldo_sisa: 0,
            saldo_terpakai: 0
        })

        res.json({
            message: "User Added Succesfully",
            result
        })
    }

};

controller.login = async (req, res) => {

    const email = req.body.email
    const password = req.body.password
    const fcm = req.body.fcm

    //validation Data Check
    const validationError = validation.loginValidation(req.body).error
    if (validationError) return res.status(400).json({ message: validationError.details[0].message })

    const result = await model.user.findOne({ where: { user_email: email } })
    if (result !== null) {
        // //check password
        const validPassword = await bcrypt.compare(password, result.user_password)
        if (!validPassword) return res.status(400).json({ status: "failed", message: "Email or password wrong!" })

        result.update({
            user_fcm: fcm
        })

        //create an assign a token
        const token = jwt.sign({ user_id: result.uid }, process.env.TOKEN_SECRET)
        res.header("auth-token", token)

        res.json({
            status: "success",
            messsage: "logged In",
            token: token,
            name: result.user_nama,
            email: result.user_email
        });
    } else {
        res.status(400).json({ status: "failed", message: "Email or password wrong!" })
    }

};

controller.fcm = async (req, res) => {

    const fcm = req.body.fcm

    let user = await model.user.findByPk(req.user.user_id);
    if (user !== null) {
        user.update({
            user_fcm: fcm
        })
        res.json({
            status: "success",
            messsage: "FCM is Update",
            user
        });
    } else {
        res.status(400).json({ status: "failed", message: "User Not Found" })
    }

};

module.exports = controller;