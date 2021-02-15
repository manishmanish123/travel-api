const mongoose = require('mongoose');

//State table
const stateSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, index: true },
    address: {
        location: {
            latitude: { type: String },
            longitude: { type: String },
            boundingBox: {
                south: { type: String },
                west: { type: String },
                north: { type: String },
                east: { type: String },
            },
            quadkey: { type: String },
        },
        country: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', index: true },      //country ID
            name: { type: String },
        },
        continent: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Continent', index: true },      //continent ID
            name: { type: String },
        },
    },
    about: {
        description: { type: String },
        area: { type: String },
        population: { type: String },
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
        topReviews: [{          // some top reviews about this place
            feedback: {
                rating: { type: Number },
                review: { type: String },
                date: { type: mongoose.Schema.Types.Date },
            },
            user: {
                id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                name: { type: String },
                userPic: { type: String },
            },
        }],
    },
    tags: { type: [String], index: true }, // like boating, surfing(things to do) etc.
    references: [{
        supplier: { type: String },
        type: { type: String },
        url: { type: String },
    }],
});

stateSchema.index({  // indexing at schema level
    name: 1,
    "address.country.id": 1,
    "address.continent.id": 1,
    tags: 1
});

module.exports = mongoose.model('State', stateSchema);