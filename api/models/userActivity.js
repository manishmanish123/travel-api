const mongoose = require('mongoose');

//User Activity table
const userActivitySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: String, required: true },
    activityData: { type: String, required: true },
});

module.exports = mongoose.model('UserActivity', userActivitySchema);