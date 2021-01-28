const mongoose = require('mongoose');

//User table
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, index: true },
    contact: {
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            phone: String,
            address: String,
            index: true,
        },
        phone: { type: String },
    },
    address: {
        address: { type: String },
        short_address: { type: String },
        zipCode: { type: String },
        location: {
            latitude: { type: String },
            longitude: { type: String },
        },
        city: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },    // city ID
        state: { type: String },
        country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },      //country ID
    },
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
    "contact.email": 1,
});

module.exports = mongoose.model('User', userSchema);