const mongoose = require('mongoose');

//Continent table
const continentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, index: true },
    officialName: { type: String },
    continentCode: { type: String },
    address: {
        location: {
            latitude: { type: String },
            longitude: { type: String },
            satelliteImage: { type: String },
            boundingBox: {
                south: { type: String },
                west: { type: String },
                north: { type: String },
                east: { type: String },
            },
            quadkey: { type: String },
        },
    },
    about: {
        description: { type: String },
        area: { type: String },
        population: { type: String },
        famousFor: { type: String },
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
        provider: { type: String },
        type: { type: String },
        data: { type: String },
    }],
});

continentSchema.index({  // indexing at schema level
    name: 1,
    tags: 1
});

module.exports = mongoose.model('Continent', continentSchema);