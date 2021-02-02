const express = require("express");
const router = express.Router();
const multer = require('multer');

const GetAdventureController = require('../controllers/adventure/getAdventure');
const InsertAdventureController = require('../controllers/adventure/insertAdventure');
const DeleteAdventureController = require('../controllers/adventure/deleteAdventure');

//file storage constrain
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/adventure');
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


router.get("/", GetAdventureController.getAllAdventure);
router.get("/:adventureId", GetAdventureController.getAdventureDetails);

router.post("/", upload.single('picture'), InsertAdventureController.createAdventure);
router.post("/dummy/:total", InsertAdventureController.createDummyAdventure);     //to insert dummy adventure(s)

router.delete("/:adventureId", DeleteAdventureController.deleteAdventure);

module.exports = router;