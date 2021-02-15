const mongoose = require('mongoose');

//Country table
const countrySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, index: true },
    address: {
        continent: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Continent', index: true },      //continent ID
            name: { type: String, index: true },
        },
    },
    about: {
        description: { type: String },
        famousFor: { type: String },
    },
    contact: {
        website: { type: String },
    },
    media: {
        thumbnail: { type: String },
        picture: { type: String },
        photos: { type: [String] },   //photo(s) name in array type
        videos: { type: [String] },   //video(s) name in array type
    },
    userFeedback: {
        avgRating: Number,
        ratingCount: Number,
    },
    tags: { type: [String], index: true }, // like boating, surfing(things to do) etc.
    references: [{
        supplier: { type: String },
        type: { type: String },
        url: { type: String },
    }],
});

countrySchema.index({  // indexing at schema level
    name: 1,
    "address.continent.id": 1,
    "address.continent.name": 1,
    tags: 1
});

module.exports = mongoose.model('Country', countrySchema);