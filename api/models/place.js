const mongoose = require('mongoose');

//Place table
const placeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    short_address: { type: String },
    address: { type: String },
    city: { type: String },     //city ID
    country: { type: String },      //country ID
    about: { type: String },
    phone: { type: String },
    website: { type: String },
    thumbnail: { type: String },
    picture: { type: String },
    photos: { type: String },   //photo(s) name in json form
    videos: { type: String },   //video(s) name in json form
});

module.exports = mongoose.model('Place', placeSchema);