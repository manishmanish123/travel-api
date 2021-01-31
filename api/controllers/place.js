const mongoose = require("mongoose");
const Place = require("../models/place");

//for random data generation - dev only
var casual = require('casual');

// const [user, post] = await Promise.all([user.save(), post.save()])

//get all places
exports.getAllPlace = (req, res, next) => {
  // const query = Place.find();
  // query.select("_id name short_address picture")
  // query.setOptions({ lean: true });
  // query.collection(Place.collection);
  // query.exec();

    // const num = 1;

    // // Promise.all([Place.deleteMany({})]);
    // const docs = populateDBWithDummyData(num);
    
    // // console.log(docs);
    // Promise.all([Place.insertMany(docs)]);
    // res.status(200).json({
    //     "Place created": num
    // });

    Place.find()
    .select("_id name short_address picture").lean()
    .limit(1)
    .exec()
    .then(docs => {
      const response = {
        status: 200,
        places: docs.map(doc => {
          return {
            // test_url: "http://localhost:3000/place/" + doc._id,
            // test_picture: "http://localhost:3000/uploads/" + doc.picture,
            id: doc._id,
            name: doc.name,
            short_address: doc.short_address,
            picture: doc.picture,
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//get details of a place by id
exports.get_place_details = (req, res, next) => {
  const id = req.params.placeId;
  Place.findById(id)
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          status: 200,
          data: {
            id: doc._id,
            name: doc.name,
            short_address: doc.short_address,
            address: doc.address,
            city: doc.city,
            country: doc.country,
            about: doc.about,
            phone: doc.phone,
            website: doc.website,
            thumbnail: doc.thumbnail,
            picture: doc.picture,
            photos: doc.photos,
            videos: doc.videos,
          }
        });
      } else {
        res
          .status(404)
          .json({
            status: 404, 
            message: "No place found for this ID"
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//create place with form details
exports.create_place = (req, res, next) => {
  console.log(req.file)
  const place = new Place({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    short_address: req.body.short_address,
    picture: req.file.filename,
    city: req.body.city,
    country: req.body.country,
    about: req.body.about,
  });
  place
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Place created successfully",
        createdPlace: {
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

//delete a place by id
exports.delete_place = (req, res, next) => {
  const id = req.params.placeId;
  // Place.remove().exec();
  Place.findById(id).exec().then(doc => {
    if(doc){
      Place.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Place deleted",
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    }
    else {
      res
        .status(404)
        .json({ message: "place not found" });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: err });
  });
};


function populateDBWithDummyData(numberOfItems) {
  const docs = [...new Array(numberOfItems)].map(_ => ({
      name: casual.title,
      address: {
          address: casual.address,
          short_address: casual.address1,
          zipCode: casual.zip(),
          location: {
              latitude: casual.latitude,
              longitide: casual.longitude,
          },
          city: {
            id: "600e99a65d8b330b5c4d3d1a",
            name: casual.city,
          },
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
        timings: casual.time(format = 'HH:mm:ss') + " to " + casual.time(format = 'HH:mm:ss'),
      },
      contact: {
          phone: casual.phone,
          website: casual.website,
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
        ratingCount: casual.integer(from = 500, to = 1000) ,
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