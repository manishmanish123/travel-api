const PlaceCollection = require("../../models/place");

// const [user, post] = await Promise.all([user.save(), post.save()])

//get all places
exports.getAllPlace = (req, res, next) => {
  // const query = Place.find();
  // query.select("_id name short_address picture")
  // query.setOptions({ lean: true });
  // query.collection(Place.collection);
  // query.exec();

    PlaceCollection.find()
    .select("_id name short_address picture").lean()
    .limit(5)
    .exec()
    .then(places => {
      const response = {
        status: 200,
        places: places.map(doc => {
          return {
            id: doc._id,
            name: doc.name,
            short_address: doc.short_address,
            picture: doc.picture,
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

//get details of a place by id
exports.getPlaceDetails = (req, res, next) => {
  const id = req.params.placeId;
  PlaceCollection.findById(id)
    .select().lean()
    .exec()
    .then(place => {
      if (place) {
        res.status(200).json({
          status: 200,
          data: {
            id: place._id,
            name: place.name,
            address: place.address.address,
            country: place.address.country.name,
            rating: place.userFeedback.avgRating,
            website: place.contact.website,
            phone: place.contact.phone,
          }
        });
      } else {
        res
          .status(404)
          .json({
            status: 404, 
            message: "No place found for this ID"
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};