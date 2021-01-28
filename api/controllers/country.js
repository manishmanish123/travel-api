const mongoose = require("mongoose");
const Country = require("../models/country");


// const [user, post] = await Promise.all([user.save(), post.save()])

//get all countries
exports.get_all_country = (req, res, next) => {
  // const query = Country.find();
  // query.select("_id name short_address picture")
  // query.setOptions({ lean: true });
  // query.collection(Country.collection);
  // query.exec();

    Country.find()
    .select("_id name about picture").lean()
    .exec()
    .then(docs => {
      const response = {
        status: 200,
        countries: docs.map(doc => {
          return {
            id: doc._id,
            name: doc.name,
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

//get details of a country by id
exports.get_country_details = (req, res, next) => {
  const id = req.params.countryId;
  Country.findById(id)
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          status: 200,
          data: {
            id: doc._id,
            name: doc.name,
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
            message: "No country found for this ID"
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

//create country with form details
exports.create_country = (req, res, next) => {
  console.log(req.file)
  const country = new Country({
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

//delete a country by id
exports.delete_country = (req, res, next) => {
  const id = req.params.countryId;
  // Country.remove().exec();
  Country.findById(id).exec().then(doc => {
    if(doc){
      Country.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Country deleted",
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
        .json({ message: "country not found" });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: err });
  });
};