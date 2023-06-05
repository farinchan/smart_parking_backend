const router = require("express").Router()
const tokenValidate = require("../helpers/verify_token")


//routes
const controller = require("../controller/index")

router.get('/example', tokenValidate, controller.example.test);

router.post('/register', controller.auth.register);
router.post('/login', controller.auth.login);
router.get('/profile', tokenValidate, controller.profile.index);
router.put('/profile/update', controller.profile.update);

module.exports = router