const CategoryCollection = require("../../models/category");

//get all cities
exports.getAllCategory = (req, res, next) => {
    CategoryCollection.find()
    .select("_id name country about picture").lean()
    .limit(5)
    .exec()
    .then(categories => {
      const response = {
        status: 200,
        categories: categories.map(category => {
          return {
            id: category._id,
            name: category.name,
            about: category.about,
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
            about: category.about,
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