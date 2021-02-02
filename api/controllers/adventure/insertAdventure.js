const mongoose = require("mongoose");
const AdventureCollection = require("../../models/adventure");

//for random data generation - dev only
var casual = require('casual');

//create adventure with form details
exports.createAdventure = (req, res, next) => {
  console.log(req.body)
  const adventure = new AdventureCollection({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    country: req.body.country,
    country: {
        id: req.body.country.id,
        name: req.body.country.name,
    },
    // country: req.body.country,
    about: req.body.about,
    picture: req.file.filename,
    photos: req.body.photos,
    videos: req.body.videos,
  });
  adventure
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Adventure created successfully",
        createdAdventure: {
          _id: result._id,
          name: result.name,
          country: result.country,
          short_address: result.short_address,
          picture: result.picture,
          adventure: result.adventure,
          adventure: result.adventure,
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


//create dummy adventure(s)
exports.createDummyAdventure = (req, res, next) => {
    const num = parseInt(req.params.total);

    Promise.all([AdventureCollection.deleteMany({})]).then(result => {        //first delete all places

        const dummyAdventure = populateDBWithDummyData(num);
        Promise.all([AdventureCollection.insertMany(dummyAdventure)]).then(r => {     //insert dummy data
            res.status(200).json({
                status: 200,
                "Dummy adventure(s) created": num
            });
        });
    
    });

}

function populateDBWithDummyData(numberOfItems) {
const docs = [...new Array(numberOfItems)].map(_ => ({
    name: casual.random_value({
      0: "Sightseeing",
      1: "Botaing",
      2: "Mountaineering",
    }),
    about: {
      description: casual.description,
      famousFor: "Best place for adventure.",
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