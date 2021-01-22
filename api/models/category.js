const mongoose = require('mongoose');

//Category table - best selected places
const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, unique: true, },
    place: { type: String, required: true, }
});

module.exports = mongoose.model('Category', categorySchema);