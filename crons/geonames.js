const axios = require('axios').default;
// const fs = require("fs");

const helper = require("../api/middleware/helper");
const mongoose = require("mongoose");
const CountryCollection = require("../api/models/country");

module.exports = {
    geonamesCountry: function () {
        
        // CountryCollection.deleteMany().exec();
        axios({
            method: 'get',
            url: 'http://api.geonames.org/countryInfoJSON?lang=en&username=manishkumar',
            responseType: 'json'
          })
        .then(function  (res){
            let countries = res.data['geonames'];
            countries.forEach(country => {
                
                CountryCollection.findOne({
                    name: helper.getRegex(country.countryName),
                    capital: helper.getRegex(country.capital),
                    'countryCode.isoNumeric': country.isoNumeric,
                }).exec()
                .then(result => {
                    
                    if(result === null){
                        let countryDetails = {
                            _id: new mongoose.Types.ObjectId(),
                            name: country.countryName,
                            capital: country.capital,
                            countryCode: {
                                countryCode: country.countryCode,
                                fips: country.fipsCode,
                                isoAlpha3: country.isoAlpha3,
                                isoNumeric: country.isoNumeric,
                            },
                            address: {
                                location: {
                                    boundingBox: {
                                        south: country.south,
                                        north: country.north,
                                        east: country.east,
                                        west: country.west,
                                    }
                                },
                                continent: {
                                    name: country.continentName,
                                    continentCode: country.continent,
                                }
                            },
                            about: {
                                languages: country.languages,
                                population: country.population,
                                area: country.areaInSqKm,
                                currencyCode: country.currencyCode,
                            },
                            references: [
                                {
                                    supplier: 'geonames',
                                    type: 'id',
                                    data: country.geonameId
                                }
                            ]
                        }
                        
                        new CountryCollection(countryDetails)
                        .save()
                        .then(result => {
                            console.log("Country created successfully, Id:" + result._id + ",  name:" + result.name);
                        })
                        .catch(err => {
                            console.log(err);
                        });

                    }
                    else console.log("Country already exists, Id:" + result._id + ",  name:" + result.name);
                    
                })
                .catch(err => {
                  console.log(err);
                });

            });
        })
        .catch(function (error){
            console.log(error);
        })
        .then(function (){
            // console.log('always executed');
        })

        // let currentTime = `${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })    } : Server is working`;
        // console.log("Country fetch cron", currentTime);
    },
};