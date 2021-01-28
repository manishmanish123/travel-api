const express = require("express");
const router = express.Router();
const multer = require('multer');
// const checkAuth = require('../middleware/check-auth');
const CountryController = require('../controllers/country');

// const UserController = require('../controllers/user');
// const checkAuth = require('../middleware/check-auth');

//file storage constrain
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/country');
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


router.get("/", CountryController.get_all_country);

router.post("/", upload.single('picture'), CountryController.create_country);

router.get("/:countryId", CountryController.get_country_details);

router.delete("/:countryId", CountryController.delete_country);

module.exports = router;