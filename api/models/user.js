const mongoose = require('mongoose');

//User table
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, index: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        phone: String,
        address: String,
    },
    phone: { type: String },
    password: { type: String, required: true },
    suggestions: {
        notification: { type: [String] },
        settings: {
            name: { type: String },
            value: { type: String },
        },
        places: {
            recommended: {
                place: { type: [mongoose.Mongoose.type.ObjectId] },
                placetype: { type: String },    // eg. place/city/country etc. name of the collection
            },
            nearBy: {
                place: { type: [mongoose.Mongoose.type.ObjectId] },
                placetype: { type: String },    // eg. place/city/country etc. name of the collection
            },
            more: {     // user may like to visit these places
                place: { type: [mongoose.Mongoose.type.ObjectId] },
                placetype: { type: String },    // eg. place/city/country etc. name of the collection
            },
        },
    },
});

userSchema.index({  // indexing at schema level
    name: 1,
    userId: 1
});

module.exports = mongoose.model('User', userSchema);