const mongoose = require('mongoose');

//City table
const citySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    country: { type: String, required: true },      //country ID
    about: { type: String },
    thumbnail: { type: String },
    picture: { type: String },
    photos: { type: String },
    videos: { type: String },
});

module.exports = mongoose.model('City', citySchema);