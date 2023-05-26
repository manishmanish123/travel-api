const CategoryCollection = require("../../models/category");
const helper = require("../../middleware/helper")

//get all cities
exports.getAllCategory = (req, res, next) => {

      const response = {"status":200,"data":{"Famous attraction places":{"id":"646f3a6344a6b7162cc5a5e9","places":[{"id":"6017d3efe937590ba0be1477","name":"Jed_Heller","shortAddress":"Korea","thumbnail":"http://localhost:3000/uploads/1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg"},{"id":"6017d3efe937590ba0be1478","name":"Effertz_Gregorio","shortAddress":"Portugal","thumbnail":"http://localhost:3000/uploads/1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg"}],"placeType":"city"},"adventurous experiences":{"id":"646f3a6344a6b7162cc5a5ea","places":[{"id":"6017d3efe937590ba0be1477","name":"Greg_Fahey","shortAddress":"Russian Federation","thumbnail":"http://localhost:3000/uploads/1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg"},{"id":"6017d3efe937590ba0be1478","name":"Maureen.Murray","shortAddress":"Aruba","thumbnail":"http://localhost:3000/uploads/1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg"}],"placeType":"place"},"places you may visit at least once":{"id":"646f3a6344a6b7162cc5a5ec","places":[{"id":"6017d3efe937590ba0be1477","name":"Bailee.Schneider","shortAddress":"Congo","thumbnail":"http://localhost:3000/uploads/1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg"},{"id":"6017d3efe937590ba0be1478","name":"Sallie.Gibson","shortAddress":"Zambia","thumbnail":"http://localhost:3000/uploads/1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg"}],"placeType":"place"}}};
        console.log(response);
      res.status(200).json(response);
};

//get details of a category by id
exports.getCategoryDetails = (req, res, next) => {
  const id = req.params.categoryId;
  const page = (req.query.page && req.query.page > 0)? req.query.page: 1;
  const maxResults = 10;
  CategoryCollection.findById(id)
    .exec()
    .then(category => {
      if (category) {
        res.status(200).json({
          status: 200,
          data: {
            id: category._id,
            name: category.name,
            places: category.place.slice(maxResults*(page-1), maxResults*page).map(place => {
                return {
                  id: place.id,
                  name: place.name,
                  shortAddress: place.shortAddress,
                  thumbnail: helper.getUploadUrl(req, place.thumbnail),
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
