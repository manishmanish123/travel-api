const mongoose = require('mongoose');

//Category table - best selected places
const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // name: famous cities, famous attraction places, adventurous experiences, places you may visit at least once, favourable and economical tours etc.
    name: { type: String, required: true, unique: true, index: true },
    place: [{
        id: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String },
        shortAddress: { type: String },
        thumbnail: { type: String },
    }],
    placeType: { type: String, index: true },    // eg. place/city/country etc. name of the collection
});

categorySchema.index({  // indexing at schema level
    name: 1,
    placetype: 1,
});

module.exports = mongoose.model('Category', categorySchema);