const mongoose = require('mongoose');

//Place table
const placeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    short_address: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    about: { type: String },
    phone: { type: String },
    website: { type: String },
    thumbnail: { type: String },
    picture: { type: String },
    photos: { type: String },
    videos: { type: String },
});

module.exports = mongoose.model('Place', placeSchema);