const Place = require("../../models/place");

//delete place by id
exports.deletePlace = (req, res, next) => {
  const id = req.params.placeId;
  // Place.remove().exec();
  Place.findById(id).exec().then(place => {
    if(place){
      Place.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            status: 200,
            message: "Place deleted",
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
            message: "place not found",
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