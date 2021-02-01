const CountryCollection = require("../../models/country");

//get all countries
exports.getAllCountry = (req, res, next) => {
    CountryCollection.find()
    .select("_id name about picture").lean()
    .limit(5)
    .exec()
    .then(countries => {
      const response = {
        status: 200,
        countries: countries.map(country => {
          return {
            id: country._id,
            name: country.name,
            about: country.about,
            picture: country.picture,
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
          status: 500,
          error: err,
      });
    });
};

//get details of a country by id
exports.getCountryDetails = (req, res, next) => {
  const id = req.params.countryId;
  CountryCollection.findById(id)
    .exec()
    .then(country => {
      if (country) {
        res.status(200).json({
          status: 200,
          data: {
            id: country._id,
            name: country.name,
            about: country.about,
            picture: country.picture,
            photos: country.photos,
            videos: country.videos,
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
      res.status(500).json({
          status: 500,
          error: err,
      });
    });
};