const mongoose = require("mongoose");
const CategoryCollection = require("../../models/category");

//for random data generation - dev only
var casual = require('casual');

//create category with form details
exports.createCategory = (req, res, next) => {
    console.log(req.body)
    const category = new CategoryCollection({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        place: {
            id: req.body.place.id,
            name: req.body.place.name,
            thumbnail: req.body.place.thumbnail,
        },
        placeType: req.body.placeType,
    });
    category
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Category created successfully",
                createdCategory: {
                    _id: result._id,
                    name: result.name,
                    placeId: result.place.id,
                    placeType: result.placeType,
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


//create dummy category(s)
exports.createDummyCategory = (req, res, next) => {
    const num = parseInt(req.params.total);

    Promise.all([CategoryCollection.deleteMany({})]).then(result => {        //first delete all places

        const dummyCategory = populateDBWithDummyData(num);
        Promise.all([CategoryCollection.insertMany(dummyCategory)]).then(r => {     //insert dummy data
            res.status(200).json({
                status: 200,
                "Dummy category(s) created": num
            });
        });

    });

}

function populateDBWithDummyData(numberOfItems) {
    const docs = [...new Array(numberOfItems)].map(_ => ({
        name: casual.random_value({
            0: "Famous cities",
            1: "Famous attraction places",
            2: "adventurous experiences",
            3: "places you may visit at least once",
            4: "favourable and economical tours",
        }),
        place: [
            {
                id: "6017d3efe937590ba0be1477",
                name: casual.username,
                shortAddress: casual.country,
                thumbnail: "1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg",
            },
            {
                id: "6017d3efe937590ba0be1478",
                name: casual.username,
                shortAddress: casual.country,
                thumbnail: "1611212308372_tim-queng-y2zXlLpOU4U-unsplash.jpg",
            },
        ],
        placeType: casual.random_value({
            0: "place",
            1: "city",
        }),
    }));

    return docs;
}