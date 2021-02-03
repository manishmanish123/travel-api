const CategoryCollection = require("../../models/category");

//get all cities
exports.getAllCategory = (req, res, next) => {
    CategoryCollection.find()
    .select().lean()
    .limit(5)
    .exec()
    .then(categories => {
        const data = {};
        categories.map(category => {
            data[category.name] = {
              id: category._id,
              places: category.place.map(place => {
                  return {
                    id: place.id,
                    name: place.name,
                    shortAddress: place.shortAddress,
                    thumbnail: req.protocol + '://' + req.get('host') + "/" + process.env.UPLOAD_FOLDER + place.thumbnail,
                  }
              }),
              placeType: category.placeType,
            };
        })

      const response = {
        status: 200,
        data: data
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

//get details of a category by id
exports.getCategoryDetails = (req, res, next) => {
  const id = req.params.categoryId;
  CategoryCollection.findById(id)
    .exec()
    .then(category => {
      if (category) {
        res.status(200).json({
          status: 200,
          data: {
            id: category._id,
            name: category.name,
            places: category.place.map(place => {
                return {
                  id: place.id,
                  name: place.name,
                  shortAddress: place.shortAddress,
                  thumbnail: req.protocol + '://' + req.get('host') + "/" + process.env.UPLOAD_FOLDER + place.thumbnail,
                }
            }),
          }
        });
      } else {
        res
          .status(404)
          .json({
            status: 404, 
            message: "No category found for this ID"
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};