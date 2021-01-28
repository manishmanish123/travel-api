const mongoose = require('mongoose');

//Place collection schema
const placeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, index: true },
    address: {
        address: { type: String },
        short_address: { type: String },
        zip: { type: String },
        city: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'City', index: true },      //city ID
            name: { type: String },
        },
        state: { type: String },
        country: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', index: true },      //country ID
            name: { type: String },
        },
        continent: { type: String },
    },
    about: {
        description: { type: String },
        famousFor: { type: String },
        timings: { type: String },
    },
    contact: {
        phone: { type: String },
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
                rating: Number,
                review: String,
                date: { type: mongoose.Mongoose.type.date },
            },
            user: {
                id: { type: mongoose.Mongoose.type.ObjectId, ref: 'User' },
                name: { type: String },
                userPic: { type: String },
            },
        }],
    },
    tags: { type: [String], index: true }, // like boating, surfing(things to do) etc.
});

placeSchema.index({  // indexing at schema level
    name: 1,
    "address.city.id": 1,
    "address.country.id": 1,
    tags: 1
});

// compile our model
const Place = mongoose.model('Place', placeSchema);

module.exports = Place;