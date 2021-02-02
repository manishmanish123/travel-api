const express = require("express");
const router = express.Router();
const multer = require('multer');

const GetCategoryController = require('../controllers/category/getCategory');
const InsertCategoryController = require('../controllers/category/insertCategory');
const DeleteCategoryController = require('../controllers/category/deleteCategory');

//file storage constrain
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/category');
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


router.get("/", GetCategoryController.getAllCategory);
router.get("/:categoryId", GetCategoryController.getCategoryDetails);

router.post("/", upload.single('picture'), InsertCategoryController.createCategory);
router.post("/dummy/:total", InsertCategoryController.createDummyCategory);     //to insert dummy category(s)

router.delete("/:categoryId", DeleteCategoryController.deleteCategory);

module.exports = router;