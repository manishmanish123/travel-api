const mongoose = require('mongoose');

//Adventure table - things to do
const adventureSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    about: {
        description: { type: String },
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
});

adventureSchema.index({  // indexing at schema level
    name: 1,
    tags: 1
});

module.exports = mongoose.model('Adventure', adventureSchema);