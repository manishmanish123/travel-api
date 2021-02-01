const CountryCollection = require("../../models/country");

//delete a country by id
exports.deleteCountry = (req, res, next) => {
  const id = req.params.countryId;
  // Country.remove().exec();
  CountryCollection.findById(id).exec().then(country => {
    if(country){
      CountryCollection.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            status: 200,
            message: "Country deleted",
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
        .status(404)
        .json({
            status: 404,
            message: "country not found",
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