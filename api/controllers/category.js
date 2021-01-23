const mongoose = require("mongoose");
const Category = require("../models/category");
const Place = require("../models/place");

//get all category
exports.get_all_category = (req, res, next) => {
    Category.find()
    .exec()
    .then(docs => {
      const response = {
        status: 200,
        categories: docs.map(doc => {
          return {
            id: doc._id,
            name: doc.name,
            place: doc.place,
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
