const mongoose = require("mongoose");
const User = require("../models/user");

//for random data generation - dev only
//var = require('casual');


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

    return docs;
}
