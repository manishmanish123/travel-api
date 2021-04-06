const axios = require('axios').default;
// const fs = require("fs");
var convertXmlToJs = require('xml-js');

const helper = require("../api/middleware/helper");
const mongoose = require("mongoose");
const CityCollection = require("../api/models/city");

module.exports = {
    geonamesCity: function () {
        
        // CityCollection.deleteMany().exec();
        axios({
            method: 'get',
            url: 'https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json',
            responseType: 'json'
          })
        .then(function  (res){
            let cities = res.data;
            cities.forEach(city => {
                
                CityCollection.findOne({
                    name: helper.getRegex(city.name),
                    'address.country.name': helper.getRegex(city.country),
                    'references.supplier': 'geonames',
                    'references.data': city.geonameid,
                }).exec()
                .then(result => {
                    
                    let cityObject = null;
                    if(result === null){
                        let cityDetails = {
                            _id: new mongoose.Types.ObjectId(),
                            name: city.name,
                            address: {
                                state: {
                                    name: city.subcountry,
                                },
                                country: {
                                    name: city.country,
                                },
                            },
                            references: [
                                {
                                    supplier: 'geonames',
                                    type: 'id',
                                    data: city.geonameId
                                }
                            ]
                        }
                        
                        new CityCollection(cityDetails)
                        .save()
                        .then(result => {
                            cityObject = result;
                            console.log("City created successfully, Id:" + result._id + ",  name:" + result.name);

                            //fetch country details by geonameId
                            axios({
                                method: 'get',
                                url: 'http://api.geonames.org/get?lang=en&geonameId=' + city.geonameId + '&username=' + process.env.GEONAME_USERID,
                                responseType: 'text'
                            }).then(function(geonameIdResult) {
                                geonameIdResult = geonameIdResult.data;
                                //convert xml to json
                                let jsonString = convertXmlToJs.xml2json(geonameIdResult, {compact: true, spaces: 4});
                                let jsonResult = JSON.parse(jsonString).geoname;

                                //wikipedia url
                                let wikipediaUrl = '';
                                let updateWikipediaReference = true;
                                cityObject.references.forEach(reference => {
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
                                        ...cityObject.references,
                                        {
                                            supplier: 'wikipedia',
                                            type: 'url',
                                            data: wikipediaUrl,
                                        }
                                    ];
                                }
                                else countryReferences = [...cityObject.references];

                                //city details to update
                                cityObject.officialName = jsonResult.toponymName._text;
                                cityObject.about = {
                                    population: jsonResult.population._text,
                                }
                                cityObject.address.country.countryCode = jsonResult.countryCode._text;
                                cityObject.address.continent.continentCode = jsonResult.continentCode._text;
                                cityObject.address.location = {
                                    latitude: jsonResult.lat._text,
                                    longitude: jsonResult.lng._text,
                                    boundingBox: {
                                        south: jsonResult.bbox.south._text,
                                        west: jsonResult.bbox.west._text,
                                        north: jsonResult.bbox.north._text,
                                        east: jsonResult.bbox.east._text,
                                    }
                                }
                                cityObject.references = countryReferences;

                                // console.log(countryDetailsToUpdate)
                                cityObject.save()
                                .then(savedDoc => {
                                    console.log("City updated, Id:" + savedDoc._id);
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
                                            let newCountryReferences = null;
                                            newCountryReferences = [
                                                ...cityObject.references,
                                                {
                                                    supplier: 'wikidata',
                                                    type: 'id',
                                                    data: wikiDataId,
                                                }
                                            ]

                                            cityObject.references = newCountryReferences;
                                            cityObject.save();

                                            console.log("Wikidata reference saved, ID:" + savedDoc._id);
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

                        })
                        .catch(err => {
                            console.log(err);
                        });

                    }
                    else {
                        cityObject = result;
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