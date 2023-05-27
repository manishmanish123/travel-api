const PlaceCollection = require("../../models/place");
const helper = require("../../middleware/helper");

// const [user, post] = await Promise.all([user.save(), post.save()])

//get all places
exports.getAllPlace = (req, res, next) => {
  // const query = Place.find();
  // query.select("_id name short_address picture")
  // query.setOptions({ lean: true });
  // query.collection(Place.collection);
  // query.exec();

  const response = {"status":200,"data":[{"id":"646f39eb44a6b7162cc5a59f","name":"Possimus pariatur officia"},{"id":"646f39eb44a6b7162cc5a585","name":"Sunt et dolore"},{"id":"646f39eb44a6b7162cc5a58b","name":"Atque error sunt"},{"id":"646f39eb44a6b7162cc5a58d","name":"Non et voluptatem"},{"id":"646f39eb44a6b7162cc5a5a0","name":"Nobis deserunt"}]};
        console.log(response);
      res.status(200).json(response);
};

//get details of a place by id
exports.getPlaceDetails = (req, res, next) => {
  const id = req.params.placeId;
  
  /*url redirection*/
  if(id.includes(":")){
    res.redirect('https://soovio.com/place/'+id).end();
  }
  /*url redirection*/

  const response = {"status":200,"data":{"id":"646f39eb44a6b7162cc5a59f","name":"Possimus pariatur officia","address":"437 Schmitt Avenue\nWest Alden, AZ 52981-1565","country":"Heard Island and McDonald Islands","rating":4,"website":"http://Veum.ca/","phone":"400-760-5752","about":"Cum blanditiis ab vel praesentium accusamus. Harum maiores enim quis voluptates sit molestiae quo repellat. Culpa aut mollitia placeat nemo repudiandae veritatis est autem. Ad qui dolorum eos sunt fuga iure.","thumbnail":"http://weary-erin-abalone.cyclic.app/1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg","tags":["Sightseeing","Zipline","Balooning"]}};
        console.log(response);
      res.status(200).json(response);
};
