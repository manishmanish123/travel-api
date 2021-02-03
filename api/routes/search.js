const express = require("express");
const router = express.Router();

const AutoSuggestController = require('../controllers/search/autoSuggest');
// const InsertPlaceController = require('../controllers/search/insertPlace');
// const DeletePlaceController = require('../controllers/search/deletePlace');


router.get("/auto-suggest", AutoSuggestController.getAutoSuggest);
// router.get("/:placeId", GetPlaceController.getPlaceDetails);

module.exports = router;