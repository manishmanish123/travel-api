const axios = require('axios').default;
// const fs = require("fs");

const mongoose = require("mongoose");
const CountryCollection = require("../api/models/country");

module.exports = {
    geonamesCountry: function () {
        axios({
            method: 'get',
            url: 'http://api.geonames.org/countryInfoJSON?lang=en&username=manishkumar&country=IN',
            responseType: 'json'
          })
        .then(function  (res){
            let countries = res.data['geonames'];
            countries.forEach(country => {
                let nameConstraint = new RegExp(country.countryName, 'i');
                let capitalConstraint = new RegExp(country.capital, 'i');
                let countryCodeIsoNumericConstraint = new RegExp(country.isoNumeric, 'i');
                
                CountryCollection.find({
                    name: nameConstraint,
                    capital: capitalConstraint,
                    countryCode: {
                        isoNumeric: countryCodeIsoNumericConstraint
                    }
                }).exec()
                .then(result => {
                    if(result.length == 0){
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
                                    south: country.south,
                                    north: country.north,
                                    east: country.east,
                                    west: country.west,
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
                            console.log("Country created successfully, Id:" + result._id);
                        })
                        .catch(err => {
                            console.log(err);
                        });

                    }
                    else console.log("Country already exists, Id:" + result._id);
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