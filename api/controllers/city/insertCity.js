const mongoose = require("mongoose");
const CityCollection = require("../../models/city");

//for random data generation - dev only
var casual = require('casual');

//create city with form details
exports.createCity = (req, res, next) => {
  console.log(req.body)
  const city = new CityCollection({
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
  city
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "City created successfully",
        createdCity: {
          _id: result._id,
          name: result.name,
          country: result.country,
          short_address: result.short_address,
          picture: result.picture,
          city: result.city,
          city: result.city,
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


//create dummy city(s)
exports.createDummyCity = (req, res, next) => {
    const num = parseInt(req.params.total);

    Promise.all([CityCollection.deleteMany({})]).then(result => {        //first delete all places

        const dummyCity = populateDBWithDummyData(num);
        Promise.all([CityCollection.insertMany(dummyCity)]).then(r => {     //insert dummy data
            res.status(200).json({
                status: 200,
                "Dummy city(s) created": num
            });
        });
    
    });

}

function populateDBWithDummyData(numberOfItems) {
const docs = [...new Array(numberOfItems)].map(_ => ({
    name: casual.city,
    address: {
        state: casual.state,
        country: {
          id: "600e99a65d8b330b5c4d3d1a",
          name: casual.country,
        },
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
      topReviews: [
        {
          feedback: {
            rating: casual.random_value(from = 1, to = 5),
            review: casual.description,
            date: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
          },
          user: {
            id: "600926d969ae0d202854b0b8",
            name: casual.name,
            userPic: "1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg",
          },
        },
        {
          feedback: {
            rating: casual.random_value(from = 1, to = 5),
            review: casual.short_description,
            date: casual.date(format = 'YYYY-MM-DD HH:mm:ss'),
          },
          user: {
            id: "6009270d69ae0d202854b0b9",
            name: casual.name,
            userPic: "1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg",
          },
        }
      ],
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