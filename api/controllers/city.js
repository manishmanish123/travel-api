const mongoose = require("mongoose");
const City = require("../models/city");
const country = require("../models/country");
// const country = require("../models/country");


// const [user, post] = await Promise.all([user.save(), post.save()])

//get all cities
exports.get_all_city = (req, res, next) => {
  // const query = City.find();
  // query.select("_id name short_address picture")
  // query.setOptions({ lean: true });
  // query.collection(City.collection);
  // query.exec();

    City.find()
    .select("_id name country about picture").lean()
    .exec()
    .then(docs => {
      const response = {
        status: 200,
        cities: docs.map(doc => {
          return {
            id: doc._id,
            name: doc.name,
            country: doc.country,
            about: doc.about,
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
//get details of a city by id
exports.get_city_details = (req, res, next) => {
  const id = req.params.cityId;
  City.findById(id)
  .populate({ path: 'country.id', select: 'name picture' })
  .exec((err, city) => {      
      res.status(200).json({
        city: city
      });
  });
};

//get details of a city by id
exports.get_city_details1 = (req, res, next) => {
  const id = req.params.cityId;
  City.findById(id)
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          status: 200,
          data: {
            id: doc._id,
            name: doc.name,
            country: doc.country,
            about: doc.about,
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
            message: "No city found for this ID"
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//create city with form details
exports.create_city = (req, res, next) => {
  console.log(req.body)
  const city = new City({
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

//delete a city by id
exports.delete_city = (req, res, next) => {
  const id = req.params.cityId;
  // City.remove().exec();
  City.findById(id).exec().then(doc => {
    if(doc){
      City.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "City deleted",
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
        .json({ message: "city not found" });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: err });
  });
};