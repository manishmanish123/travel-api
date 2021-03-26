const cron = require("node-cron");
const geonames = require("./geonames");

module.exports = {
    cronInitilize: function(){
        geonames.geonamesCountry();
        //second(optional) minute hour day month weekday

        // Creating a cron job for country fetch
        // cron.schedule("0 0 1 1 */6 *", function() {
        //     geonames.geonamesCountry();
        // }, {
        //     timezone: "Asia/Kolkata"
        // });

    },
};