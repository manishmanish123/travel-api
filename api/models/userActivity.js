const mongoose = require('mongoose');

//User Activity table
const userActivitySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },   //user ID
    activityData: { type: String, required: true },
    date: { type: mongoose.Mongoose.type.date, required: true },
});

userActivitySchema.index({  // indexing at schema level
    userId: 1,
});

module.exports = mongoose.model('UserActivity', userActivitySchema);