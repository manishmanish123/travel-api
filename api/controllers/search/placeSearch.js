const PlaceCollection = require("../../models/place");
const helper = require("../../middleware/helper");

//get place-search
exports.getPlaceSearch = (req, res, next) => {
  let query = req.query.q;
  query = query.trim().toLowerCase();
  const page = (req.query.page && req.query.page > 0)? req.query.page: 1;
  const maxResults = 10;
  
  if(query && query !== "" && query.length>=3){
    const constrains = { name: new RegExp(query, 'i') }
    PlaceCollection
    .find(constrains)
    .select("_id name address.shortAddress media.thumbnail").lean()
    .skip(maxResults*(page-1))
    .limit(maxResults)
    .exec()
    .then(result => {
      const response = {
        status: 200,
        query: query,
        data: result.map(doc => {
          return {
            id: doc._id,
            name: doc.name,
            shortAddress: doc.address.shortAddress,
            thumbnail: helper.getUploadUrl(req, doc.media.thumbnail),
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
  }
  else {
    res.status(500).json({
      status: 500,
      error: "No query found",
    });
  }
};
