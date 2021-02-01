const CityCollection = require("../../models/city");

//get all cities
exports.getAllCity = (req, res, next) => {
    CityCollection.find()
    .select("_id name country about picture").lean()
    .limit(5)
    .exec()
    .then(cities => {
      const response = {
        status: 200,
        cities: cities.map(city => {
          return {
            id: city._id,
            name: city.name,
            country: city.country,
            about: city.about,
            picture: city.picture,
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

//get details of a city by id
exports.getCityDetails = (req, res, next) => {
  const id = req.params.cityId;
  CityCollection.findById(id)
    .populate({ path: 'country.id', select: 'name picture' })
    .exec()
    .then(city => {
      if (city) {
        res.status(200).json({
          status: 200,
          data: {
            id: city._id,
            name: city.name,
            country: city.country,
            about: city.about,
            picture: city.picture,
            photos: city.photos,
            videos: city.videos,
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