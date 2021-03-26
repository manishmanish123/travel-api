const axios = require('axios').default;
// const fs = require("fs");
var convertXmlToJs = require('xml-js');

const helper = require("../api/middleware/helper");
const mongoose = require("mongoose");
const CountryCollection = require("../api/models/country");

module.exports = {
    geonamesCountry: function () {
        
        // CountryCollection.deleteMany().exec();
        axios({
            method: 'get',
            url: 'http://api.geonames.org/countryInfoJSON?lang=en&username=' + process.env.GEONAME_USERID,
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
                    
                    let countryObject = null;
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
                                areaInSqKm: country.areaInSqKm,
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
                            countryObject = result;
                            console.log("Country created successfully, Id:" + result._id + ",  name:" + result.name);

                            //fetch country details by geonameId
                            countryObject.references.forEach(reference => {
                                if(reference.supplier === 'geonames'){
                                    axios({
                                        method: 'get',
                                        url: 'http://api.geonames.org/get?lang=en&geonameId=' + reference.data + '&username=' + process.env.GEONAME_USERID,
                                        responseType: 'text'
                                    }).then(function(geonameIdResult) {
                                        geonameIdResult = geonameIdResult.data;
                                        //convert xml to json
                                        let jsonString = convertXmlToJs.xml2json(geonameIdResult, {compact: true, spaces: 4});
                                        let jsonResult = JSON.parse(jsonString).geoname;

                                        //wikipedia url
                                        let wikipediaUrl = '';
                                        let updateWikipediaReference = true;
                                        countryObject.references.forEach(reference => {
                                            if(reference.supplier === 'wikipedia'){
                                                updateWikipediaReference = false;
                                                return false;
                                            }
                                        });
                                        if(updateWikipediaReference){
                                            let wikipediaUrlIndex = geonameIdResult.indexOf("https://en.wikipedia.org");
                                            if(wikipediaUrlIndex !== -1){
                                                while(geonameIdResult[wikipediaUrlIndex]!='<'){
                                                    wikipediaUrl += geonameIdResult[wikipediaUrlIndex++];
                                                }
                                            }
                                        }

                                        //country data references
                                        let countryReferences = null;
                                        if(wikipediaUrl!==''){
                                            countryReferences = [
                                                ...countryObject.references,
                                                {
                                                    supplier: 'wikipedia',
                                                    type: 'url',
                                                    data: wikipediaUrl,
                                                }
                                            ];
                                        }
                                        else countryReferences = [...countryObject.references];

                                        //country details to update
                                        countryObject.officialName = jsonResult.toponymName._text;
                                        countryObject.address.location = {
                                            latitude: jsonResult.lat._text,
                                            longitude: jsonResult.lng._text,
                                        };
                                        countryObject.references = countryReferences;

                                        // console.log(countryDetailsToUpdate)
                                        countryObject.save()
                                        .then(savedDoc => {
                                            console.log("Country updated, Id:" + savedDoc._id);
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });

                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });
                                    
                                    return false;
                                }
                            })

                        })
                        .catch(err => {
                            console.log(err);
                        });

                    }
                    else {
                        countryObject = result;
                        console.log("Country already exists, Id:" + result._id + ",  name:" + result.name);
                    }
                    
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