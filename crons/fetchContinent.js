const axios = require('axios').default;
// const fs = require("fs");
var convertXmlToJs = require('xml-js');

const helper = require("../api/middleware/helper");
const mongoose = require("mongoose");
const ContinentCollection = require("../api/models/continent");

module.exports = {
    geonamesContinent: function () {
        
        // ContinentCollection.deleteMany().exec();
        axios({
            method: 'get',
            url: 'https://pkgstore.datahub.io/core/continent-codes/continent-codes_json/data/60d6baef1250bc2b01fd0148dccca518/continent-codes_json.json',
            responseType: 'json'
          })
        .then(function  (res){
            // return false;
            let continents = res.data;
            continents.forEach(continent => {
                
                ContinentCollection.findOne({
                    name: helper.getRegex(continent.Name),
                    continentCode: helper.getRegex(continent.Code),
                }).exec()
                .then(result => {
                    
                    let continentObject = null;
                    if(result === null){
                        let continentDetails = {
                            _id: new mongoose.Types.ObjectId(),
                            name: continent.Name,
                            continentCode: continent.Code,
                        }
                        
                        new ContinentCollection(continentDetails)
                        .save()
                        .then(result => {
                            continentObject = result;
                            console.log("Continent created successfully, Id:" + result._id + ",  name:" + result.name);

                            //continent data references
                            let wikipediaUrl = 'https://en.wikipedia.org/wiki/' + continentObject.name.replace(" ", "_");
                            let countryReferences = [
                                {
                                    provider: 'wikipedia',
                                    type: 'url',
                                    data: wikipediaUrl,
                                },
                            ];

                            //country details to update
                            continentObject.references = countryReferences;

                            // console.log(countryDetailsToUpdate)
                            continentObject.save()
                            .then(savedDoc => {
                                console.log("Continent updated, Id:" + savedDoc._id);
                                let wikipediaIdIndex = wikipediaUrl.indexOf("wiki/") + 5;
                                let wikipediaId = wikipediaUrl.substr(wikipediaIdIndex);
                                
                                //to fetch wikidata ID
                                axios({
                                    method: 'get',
                                    url: 'https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&format=json&titles=' + wikipediaId,
                                    responseType: 'json'
                                }).then(function(wikipediaResultJson) {
                                    let wikipediaResult = wikipediaResultJson['data'];
                                    let wikipediaResultString = JSON.stringify(wikipediaResult.query.pages);
                                    let wikiDataIdIndex = wikipediaResultString.indexOf("wikibase_item") + 16;

                                    let wikiDataId = '';
                                    while(wikipediaResultString[wikiDataIdIndex]!='"'){
                                        wikiDataId += wikipediaResultString[wikiDataIdIndex++];
                                    }

                                    if(wikiDataId.length!==''){
                                        //country data references
                                        let newContinentReferences = null;
                                        newContinentReferences = [
                                            ...continentObject.references,
                                            {
                                                provider: 'wikidata',
                                                type: 'id',
                                                data: wikiDataId,
                                            }
                                        ]

                                        continentObject.references = newContinentReferences;
                                        continentObject.save();

                                        console.log("Wikidata reference saved, ID:" + savedDoc._id);
                                        
                                        //fetching geoname id and data
                                        let continentGeonameId = null;
                                        axios({
                                            method: 'get',
                                            url: 'http://api.geonames.org/searchJSON?maxRows=10&q= ' + continentObject.name + '&username=' + process.env.GEONAME_USERID,
                                            responseType: 'json'
                                        }).then(function(continentSearchRes) {
                                            let continentSearchResult = continentSearchRes.data['geonames'];
                                            continentSearchResult.forEach(element => {
                                                if(element.fcodeName == 'continent'){
                                                    continentGeonameId = element.geonameId;
                                                    
                                                    let newContinentRef = null;
                                                    newContinentRef = [
                                                        {
                                                            provider: 'geonames',
                                                            type: 'id',
                                                            data: continentGeonameId,
                                                        },
                                                        ...continentObject.references
                                                    ]

                                                    continentObject.address.location = {
                                                        latitude: element.lat,
                                                        longitude: element.lng,
                                                    }
                                                    continentObject.about = {
                                                        population: element.population,
                                                    }
                                                    continentObject.references = newContinentRef;

                                                    continentObject.save().then(savedContinentDoc => {
                                                        console.log("geonames reference saved, ID:" + savedContinentDoc._id);

                                                        //fetching geonamesId data
                                                        axios({
                                                            method: 'get',
                                                            url: 'http://api.geonames.org/get?geonameId=' + continentGeonameId + '&username= ' + process.env.GEONAME_USERID + '&lang=en&style=FULL',
                                                            responseType: 'text'
                                                        }).then(function(geonameIdResult){
                                                            geonameIdResult = geonameIdResult.data;
                                                            //convert xml to json
                                                            let jsonString = convertXmlToJs.xml2json(geonameIdResult, {compact: true, spaces: 4});
                                                            let jsonResult = JSON.parse(jsonString).geoname;

                                                            continentObject.address.location.boundingBox = {
                                                                south: jsonResult.bbox.south._text,
                                                                west: jsonResult.bbox.west._text,
                                                                north: jsonResult.bbox.north._text,
                                                                east: jsonResult.bbox.east._text,
                                                            }
                                                            continentObject.save().then(newContinentDoc => {
                                                                console.log("Bounding box details saved: Id" + newContinentDoc._id)
                                                            })

                                                        })
                                                        .catch(err => {
                                                            console.log(err);
                                                        });

                                                    });

                                                    return false;
                                                }
                                            });
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });

                                    }
                                    else console.log("No wikidata ID found for: " + savedDoc.name);
                                    
                                })
                                .catch(err => {
                                    console.log(err);
                                });

                            })
                            .catch(err => {
                                console.log(err);
                            });

                        })
                        .catch(err => {
                            console.log(err);
                        });

                    }
                    else {
                        continentObject = result;
                        console.log("Continent already exists, Id:" + result._id + ",  name:" + result.name);
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