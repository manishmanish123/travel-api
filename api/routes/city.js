const express = require("express");
const router = express.Router();
const multer = require('multer');

const GetCityController = require('../controllers/city/getCity');
const DeleteCityController = require('../controllers/city/deleteCity');

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


router.get("/", GetCityController.getAllCity);
router.get("/:cityId", GetCityController.getCityDetails);

router.delete("/:cityId", DeleteCityController.deleteCity);

module.exports = router;
