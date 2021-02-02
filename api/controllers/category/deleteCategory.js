const CategoryCollection = require("../../models/category");

//delete a category by id
exports.deleteCategory = (req, res, next) => {
  const id = req.params.categoryId;
  // Category.remove().exec();
  CategoryCollection.findById(id).exec().then(doc => {
    if(doc){
      CategoryCollection.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            status: 200,
            message: "Category deleted",
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
            message: "category not found",
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