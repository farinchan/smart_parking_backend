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

router.get('/parkir/tracking', tokenValidate, controller.parkir.index);

//API From Rapberry PI - Gate 1
router.post('/scan', upload.single('picture'), controller.microcontroller.index);
//From App - Api untuk konfirmasi Lokasi Parkir
router.post('/scan/confirm', tokenValidate, controller.microcontroller.pesanParkir);

router.post('/scan/a1', controller.microcontroller.gate2);
router.post('/scan/a2', controller.microcontroller.gate3);
router.post('/scan/b1', controller.microcontroller.gate4);
router.post('/scan/b2', controller.microcontroller.gate5);
router.post('/scan/c1', controller.microcontroller.gate6);
router.post('/scan/c2', controller.microcontroller.gate7);

//testing fuzzy
router.get('/test', controller.example.index);

module.exports = router