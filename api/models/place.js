const mongoose = require('mongoose');

//Place collection schema
const placeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, index: true },
    short_address: { type: String },
    address: { type: String },
    city: { type: String },     //city ID
    country: { type: String },      //country ID
    about: { type: String },
    phone: { type: String },
    website: { type: String },
    thumbnail: { type: String },
    picture: { type: String },
    photos: { type: [String] },   //photo(s) name in array type
    videos: { type: [String] },   //video(s) name in array type
    tags: { type: [String], index: true },  //indexing tags
});

placeSchema.index({ name: 1, tags: 1 });  // indexing at schema level

// compile our model
const Place = mongoose.model('Place', placeSchema);

module.exports = Place;