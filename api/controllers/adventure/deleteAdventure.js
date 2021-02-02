const AdventureCollection = require("../../models/adventure");

//delete a adventure by id
exports.deleteAdventure = (req, res, next) => {
  const id = req.params.adventureId;
  // Adventure.remove().exec();
  AdventureCollection.findById(id).exec().then(doc => {
    if(doc){
      AdventureCollection.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            status: 200,
            message: "Adventure deleted",
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
            message: "adventure not found",
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