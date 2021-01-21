const mongoose = require("mongoose");
const Place = require("../models/place");

//get all places
exports.get_all_place = (req, res, next) => {
    Place.find()
    .select("_id name short_name thumbnail")
    .exec()
    .then(docs => {
      const response = {
        status: 200,
        places: docs.map(doc => {
          return {
            id: doc._id,
            name: doc.name,
            short_address: doc.short_address,
            thumbnail: doc.thumbnail,
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

//create place with form details
exports.create_place = (req, res, next) => {
  console.log(req.file)
  const place = new Place({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    short_address: req.body.short_address,
    picture: req.file.path,
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
          thumbnail: result.thumbnail,
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

//get details of a place by id
exports.get_place_details = (req, res, next) => {
  const id = req.params.placeId;
  Place.findById(id)
    .select("_id name address thumbnail about")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
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