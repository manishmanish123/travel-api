const express = require("express");
const router = express.Router();
const CategoryController = require('../controllers/category');

router.get("/", CategoryController.get_all_category);

router.post("/", CategoryController.create_category);

router.get("/:categoryId", CategoryController.get_category_details);

router.delete("/:categoryId", CategoryController.delete_category);

module.exports = router;