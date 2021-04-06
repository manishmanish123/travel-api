const cron = require("node-cron");
const fetchCity = require("./fetchCity");
const fetchCountry = require("./fetchCountry");
const fetchContinent = require("./fetchContinent");

module.exports = {
    cronInitilize: function(){
        // fetchCountry.geonamesCountry();
        //second(optional) minute hour day month weekday

        // Creating a cron job for country fetch
        // cron.schedule("0 0 1 1 */6 *", function() {
        //     fetchCountry.geonamesCountry();
        // }, {
        //     timezone: "Asia/Kolkata"
        // });

        // fetchCity.geonamesCity();

        fetchContinent.geonamesContinent();
    },
};