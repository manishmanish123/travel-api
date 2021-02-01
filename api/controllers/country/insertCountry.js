const mongoose = require("mongoose");
const CountryCollection = require("../../models/country");

//for random data generation - dev only
var casual = require('casual');

//create country with form details
exports.createCountry = (req, res, next) => {
  console.log(req.file)
  const country = new CountryCollection({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    about: req.body.about,
    picture: req.file.filename,
    photos: req.body.photos,
    videos: req.body.videos,
  });
  country
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Country created successfully",
        createdCountry: {
          _id: result._id,
          name: result.name,
          short_address: result.short_address,
          picture: result.picture,
          city: result.city,
          country: result.country,
          about: result.about,
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


//create dummy country(s)
exports.createDummyCountry = (req, res, next) => {
    const num = parseInt(req.params.total);

    Promise.all([CountryCollection.deleteMany({})]).then(result => {        //first delete all places

        const dummyCountries = populateDBWithDummyData(num);
        Promise.all([CountryCollection.insertMany(dummyCountries)]).then(r => {     //insert dummy data
            res.status(200).json({
                "Dummy country(s) created": num
            });
        });
    
    });

}

function populateDBWithDummyData(numberOfItems) {
const docs = [...new Array(numberOfItems)].map(_ => ({
    name: casual.country,
    address: {
        continent: "Asia",
    },
    about: {
      description: casual.description,
      famousFor: "Sightseeing, Botaing, Mountaineering",
    },
    contact: {
        website: casual.url,
    },
    media: {
      thumbnail: "1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg",
      picture: "1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg",
      photos: [
        "1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg",
        "1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg"
      ],
      videos: [
        "1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg",
        "1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg",
      ],
    },
    userFeedback: {
      avgRating: casual.integer(from = 4.0, to = 5.0),
      ratingCount: casual.integer(from = 500, to = 1000),
    },
    tags: [
      casual.random_value({
        0: "Sightseeing",
        1: "Mountaineering",
      }),
      casual.random_value({
        0: "Kayaking",
        1: "Zipline",
      }),
      casual.random_value({
        0: "Balooning",
        1: "Surfing",
      }),
    ],
}));

return docs;
}