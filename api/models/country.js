const mongoose = require('mongoose');

//Country table
const countrySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true, index: true },
    officialName: { type: String },
    capital: { type: String },
    countryCode: {
        countryCode: { type: String },
        fips: { type: String },
        isoAlpha3: { type: String },
        isoNumeric: { type: String },
    },
    address: {
        location: {
            latitude: { type: String },
            longitude: { type: String },
            satelliteImage: { type: String },
            boundingBox: {
                south: { type: String },
                west: { type: String },
                north: { type: String },
                east: { type: String },
            },
            quadkey: { type: String },
        },
        continent: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Continent', index: true },      //continent ID
            name: { type: String, index: true },
            continentCode: { type: String },
        },
    },
    about: {
        languages: { type: String },
        population: { type: String },
        areaInSqKm: { type: String },
        currencyCode: { type: String },
        description: { type: String },
        famousFor: { type: String },
    },
    contact: {
        website: { type: String },
    },
    media: {
        thumbnail: { type: String },
        picture: { type: String },
        photos: { type: [String] },   //photo(s) name in array type
        videos: { type: [String] },   //video(s) name in array type
    },
    userFeedback: {
        avgRating: Number,
        ratingCount: Number,
    },
    tags: { type: [String], index: true }, // like boating, surfing(things to do) etc.
    references: [{
        provider: { type: String },
        type: { type: String },
        data: { type: String },
    }],
});

countrySchema.index({  // indexing at schema level
    name: 1,
    "address.continent.id": 1,
    "address.continent.name": 1,
    tags: 1
});

module.exports = mongoose.model('Country', countrySchema);