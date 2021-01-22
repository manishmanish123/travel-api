const mongoose = require('mongoose');

//Review table
const reviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    placeType: { type: String, required: true },    //like place, city, country
    rating: { type: Number },       //rating at scale of 1 to 10
    comment: { type: String },      //comment added by user
    photos: { type: String },   //photo(s) name in json form
    videos: { type: String },   //video(s) name in json form
});

module.exports = mongoose.model('Review', reviewSchema);