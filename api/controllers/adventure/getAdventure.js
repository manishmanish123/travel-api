const AdventureCollection = require("../../models/adventure");

//get all adventures
exports.getAllAdventure = (req, res, next) => {
    AdventureCollection.find()
    .select("_id name country about picture").lean()
    .limit(5)
    .exec()
    .then(adventures => {
      const response = {
        status: 200,
        data: adventures.map(adventure => {
          return {
            id: adventure._id,
            name: adventure.name,
            about: adventure.about,
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

//get details of a adventure by id
exports.getAdventureDetails = (req, res, next) => {
  const id = req.params.adventureId;
  AdventureCollection.findById(id)
    .exec()
    .then(adventure => {
      if (adventure) {
        res.status(200).json({
          status: 200,
          data: {
            id: adventure._id,
            name: adventure.name,
            about: adventure.about,
          }
        });
      } else {
        res
          .status(404)
          .json({
            status: 404, 
            message: "No adventure found for this ID"
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};