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
      
      
  const response = {"status":200,"data":{"id":"646f3a6344a6b7162cc5a5e9","name":"Famous attraction places","places":[{"id":"6017d3efe937590ba0be1477","name":"Jed_Heller","shortAddress":"Korea","thumbnail":"http://weary-erin-abalone.cyclic.app/1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg"},{"id":"6017d3efe937590ba0be1478","name":"Effertz_Gregorio","shortAddress":"Portugal","thumbnail":"http://weary-erin-abalone.cyclic.app/1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg"}]}};
        console.log(response);
      res.status(200).json(response);
};
