const mongoose = require('mongoose');

//Adventure table - things to do
const adventureSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    about: { type: String },
    thumbnail: { type: String },
    picture: { type: String },
    photos: { type: String },
    videos: { type: String },
});

module.exports = mongoose.model('Adventure', adventureSchema);