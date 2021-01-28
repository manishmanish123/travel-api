const express = require("express");
const router = express.Router();
const multer = require('multer');
// const checkAuth = require('../middleware/check-auth');
const CityController = require('../controllers/city');

// const UserController = require('../controllers/user');
// const checkAuth = require('../middleware/check-auth');

//file storage constrain
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/city');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname )
    }
});

//file type constrain
const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error("Please upload jpeg/png image"), false);
    }
};

//file constrains
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10      //restrict file size more than 10MB
    },
    fileFilter: fileFilter
});


router.get("/", CityController.get_all_city);

router.post("/", upload.single('picture'), CityController.create_city);

router.get("/:cityId", CityController.get_city_details);

router.delete("/:cityId", CityController.delete_city);

module.exports = router;