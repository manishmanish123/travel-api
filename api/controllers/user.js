const mongoose = require("mongoose");
const User = require("../models/user");

//for random data generation - dev only
var casual = require('casual');


//get all user
exports.get_all_user = (req, res, next) => {
    User.find()
        .lean()
        // .limit(1)
        .populate('address.city', )
        .exec()
        .then(docs => {
            const response = {
                status: 200,
                users: docs.map(doc => {
                    return {
                        id: doc._id,
                        name: doc.name,
                        email: doc.contact.email,
                        phone: doc.contact.phone,
                        city: doc.address.city.name,
                        country: doc.address.city.country.name,
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


//create place with form details
exports.create_user = (req, res, next) => {
    const num = 1;

    // Promise.all([User.deleteMany({})]);
    const docs = populateDBWithDummyData(num);

    // console.log(docs);
    Promise.all([User.insertMany(docs)]);
    res.status(200).json({
        "User created": num
    });
};

function populateDBWithDummyData(numberOfItems) {
    const docs = [...new Array(numberOfItems)].map(_ => ({
        name: casual.name,
        contact: {
            email: casual.email,
            phone: casual.phone,
        },
        address: {
            address: casual.address,
            short_address: casual.address1,
            zipCode: casual.zip(),
            location: {
                latitude: casual.latitude,
                longitide: casual.longitude,
            },
            city: "600e99a65d8b330b5c4d3d1a",
            state: casual.state,
            country: "600e99a65d8b330b5c4d3d1a",
        },
        password: casual.password,
        suggestions: {
            notification: {
                message: casual.notification,
                actionUrl: casual.url,
            },
            settings: [
                {
                    name: "Mail Subscription",
                    value: casual.coin_flip,
                },
                {
                    name: "Mail Subscription",
                    value: casual.coin_flip,
                },
            ],
            places: {
                recommended: {
                    place: "600e99a65d8b330b5c4d3d1a",
                    placeType: casual.random_value({
                        0: "place",
                        1: "city",
                    }),
                }
            },
        },
    }));

    return docs;
}