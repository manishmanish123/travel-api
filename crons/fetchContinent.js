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
                                        let newCountryReferences = null;
                                        newCountryReferences = [
                                            ...continentObject.references,
                                            {
                                                provider: 'wikidata',
                                                type: 'id',
                                                data: wikiDataId,
                                            }
                                        ]

                                        continentObject.references = newCountryReferences;
                                        continentObject.save();

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