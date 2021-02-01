const CityCollection = require("../../models/city");

//delete a city by id
exports.deleteCity = (req, res, next) => {
  const id = req.params.cityId;
  // City.remove().exec();
  CityCollection.findById(id).exec().then(doc => {
    if(doc){
      CityCollection.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            status: 200,
            message: "City deleted",
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 500,
            error: err,
        });
      });
    }
    else {
      res
        .status(404).json({
            status: 404,
            message: "city not found",
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