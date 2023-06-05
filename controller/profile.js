const model = require("../config/models/index")


let controller = {}


controller.index = async function (req, res) {

    let result = await model.user.findByPk(req.user.user_id);

    res.json({
        messsage: "success",
        result
    })

};

controller.update = async (req, res) => {

    let user = await model.user.findByPk(req.user.user_id);
    req.body.name !== undefined ? user.user_nama = req.body.name : ''
    req.body.email !== undefined ? user.user_email = req.body.email : ''
    req.body.phone !== undefined ? user.user_phone = req.body.phone : ''
    req.body.password !== undefined ? user.user_password = req.body.password : ''
    req.file !== undefined ? user.picture = req.file.originalname : ''

    user.save()

    res.json({
        messsage: "success",
        result: user
    })

};

module.exports = controller;