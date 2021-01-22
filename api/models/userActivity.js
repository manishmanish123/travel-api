const mongoose = require('mongoose');

//User Activity table
const userActivitySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },   //user ID
    activityData: { type: String, required: true },
});

module.exports = mongoose.model('UserActivity', userActivitySchema);