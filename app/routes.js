const router = require("express").Router()
const tokenValidate = require("../helpers/verify_token")

//MULTER - File Upload
const multer = require('multer')
var storage = multer.diskStorage(
    {
        destination: './uploads/',
        filename: function (req, file, cb) {
            let extArray = file.mimetype.split("/");
            let extension = extArray[extArray.length - 1];
            // cb(null, file.originalname + '-' + Date.now() + "." + extension);
            cb(null, file.originalname);
        }
    }
);
const upload = multer({ storage })

//routes
const controller = require("../controller/index")


router.post('/register', controller.auth.register);
router.post('/login', controller.auth.login);
router.get('/profile', tokenValidate, controller.profile.index);
router.put('/profile/update', controller.profile.update);

router.put('/profile/fcm', tokenValidate, controller.auth.fcm);

router.get('/saldo', tokenValidate, controller.saldo.index);
router.post('/voucher/topup', tokenValidate, controller.voucher.topup);

//API From Rapberry PI - Gate 1
router.post('/scan', upload.single('picture'), controller.microcontroller.index);
//From App - Api untuk konfirmasi Lokasi Parkir
router.post('/scan/confirm', tokenValidate, controller.microcontroller.pesanParkir);

//testing fuzzy
router.get('/test', controller.example.index);

module.exports = router