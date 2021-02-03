const PlaceCollection = require("../../models/place");
const helper = require("../../middleware/helper");

//get suggestion
exports.getAutoSuggest = (req, res, next) => {
  const query = req.query.q;
  const maxResults = 10;
  if(query && query !== "" && query.length>=3){
    const constrains = { name: new RegExp(query, 'i') }
    PlaceCollection
    .find(constrains)
    .select("_id name media.thumbnail").lean()
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
