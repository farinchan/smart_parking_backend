const model = require("../config/models/index")

let controller = {}

controller.index = async function (req, res) {

    let result = await model.saldo.findOne({
        where: { uid: req.user.user_id },
    })
    res.json({
        messsage: "success",
        result
    })

};

module.exports = controller;