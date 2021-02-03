const express = require("express");
const router = express.Router();

const AutoSuggestController = require('../controllers/search/autoSuggest');
const PlaceSearchController = require('../controllers/search/placeSearch');


router.get("/auto-suggest", AutoSuggestController.getAutoSuggest);
router.get("/place-search", PlaceSearchController.getPlaceSearch);

module.exports = router;