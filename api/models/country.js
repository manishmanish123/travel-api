const mongoose = require('mongoose');

//Country table
const countrySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    about: { type: String },
    thumbnail: { type: String },
    picture: { type: String },
    photos: { type: String },
    videos: { type: String },
});

module.exports = mongoose.model('Country', countrySchema);