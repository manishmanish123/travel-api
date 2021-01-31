const express = require("express");
const router = express.Router();
const UserController = require('../controllers/user');

router.get("/", UserController.get_all_user);

router.post("/", UserController.create_user);

// router.get("/:userId", UserController.get_user_details);

// router.delete("/:userId", UserController.delete_user);

module.exports = router;