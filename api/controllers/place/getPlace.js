const Place = require("../../models/place");

// const [user, post] = await Promise.all([user.save(), post.save()])

//get all places
exports.getAllPlace = (req, res, next) => {
  // const query = Place.find();
  // query.select("_id name short_address picture")
  // query.setOptions({ lean: true });
  // query.collection(Place.collection);
  // query.exec();

    // const num = 1;

    // // Promise.all([Place.deleteMany({})]);
    // const docs = populateDBWithDummyData(num);
    
    // // console.log(docs);
    // Promise.all([Place.insertMany(docs)]);
    // res.status(200).json({
    //     "Place created": num
    // });

    Place.find()
    .select("_id name short_address picture").lean()
    .limit(1)
    .exec()
    .then(docs => {
      const response = {
        status: 200,
        places: docs.map(doc => {
          return {
            // test_url: "http://localhost:3000/place/" + doc._id,
            // test_picture: "http://localhost:3000/uploads/" + doc.picture,
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
  Place.findById(id)
    .select().lean()
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          status: 200,
          data: {
            id: doc._id,
            name: doc.name,
            address: doc.address.address,
            country: doc.address.country.name,
            rating: doc.userFeedback.avgRating,
            website: doc.contact.website,
            phone: doc.contact.phone,
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