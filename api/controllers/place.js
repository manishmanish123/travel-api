const mongoose = require("mongoose");
const Place = require("../models/place");


// const [user, post] = await Promise.all([user.save(), post.save()])

//get all places
exports.get_all_place = (req, res, next) => {
    Place.find()
    .select("_id name short_address picture")
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