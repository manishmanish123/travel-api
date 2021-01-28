const mongoose = require('mongoose');

//Adventure table - things to do
const userFeedbackSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    placeId: { type: mongoose.Mongoose.type.ObjectId, required: true, index: true },
    placetype: { type: String },    // eg. place/city/country etc. name of the collection
    feedback: {
        rating: { type: Number },
        review: { type: String },
        date: { type: mongoose.Mongoose.type.date },
    },
    user: {
        id: { type: mongoose.Mongoose.type.ObjectId, ref: 'User', required: true, index: true },
        name: { type: String },
        userPic: { type: String },
    },
});

userFeedbackSchema.index({  // indexing at schema level
    placeId: 1,
    "user.id": 1
});

module.exports = mongoose.model('Adventure', userFeedbackSchema);