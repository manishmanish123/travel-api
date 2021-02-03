const PlaceCollection = require("../../models/place");

//get suggestion
exports.getAutoSuggest = (req, res, next) => {
  const query = req.query.q;
  if(query && query !== "" && query.length>=3){
    const constrains = { name: new RegExp(query, 'i') }
    PlaceCollection
    .find(constrains)
    // .where('name').equals('Eum')
    .select("_id name media.thumbnail").lean()
    .limit(10)
    .exec()
    .then(result => {
      const response = {
        status: 200,
        query: query,
        data: result.map(doc => {
          return {
            id: doc._id,
            name: doc.name,
            thumbnail: doc.media.thumbnail,
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
