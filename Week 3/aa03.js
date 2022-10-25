"use strict"

// dependencies
const fs = require('fs'),
    querystring = require('querystring'),
    axios = require('axios'),
    async = require('async'),
    dotenv = require('dotenv');

// TAMU api key
dotenv.config();
const API_KEY = process.env.TAMU_KEY;
const API_URL = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx'

// geocode addresses
let meetingsData = [];
//let addresses = ["63 Fifth Ave", "16 E 16th St", "2 W 13th St"];
let addresses = JSON.parse(fs.readFileSync('data/first.json'));
console.log(addresses)



// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    let query = {
        streetAddress: value,
        city: "New York",
        state: "NY",
        apikey: API_KEY,
        format: "json",
        version: "4.01"
    };

    // construct a querystring from the `query` object's values and append it to the api URL
    let apiRequest = API_URL + '?' + querystring.stringify(query);

    (async () => {
        try {
            // 		const response = await got(apiRequest);
            console.log(apiRequest)

            // 		const response = await axios.get(apiRequest);

            axios.get(apiRequest)
                .then(function(response) {
                    // handle success
                    
                    console.log(response.data.InputAddress.StreetAddress)
                    console.log(response.data.OutputGeocodes[0].OutputGeocode.Latitude)
                    console.log(response.data.OutputGeocodes[0].OutputGeocode.Longitude)
                    meetingsData.push({
                        address: response.data.InputAddress.StreetAddress,
                        latLong: {
                            lat: response.data.OutputGeocodes[0].OutputGeocode.Latitude,
                            lng: response.data.OutputGeocodes[0].OutputGeocode.Longitude
                        }
                    });

                })
                .catch(function(error) {
                    // handle error
                    console.log(error);
                })
                .finally(function() {
                    // always executed
                });

        }
        catch (error) {
            console.log(error.response);
        }
    })();

    // sleep for a couple seconds before making the next request
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('data/second.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log(`Number of meetings in this zone: ${meetingsData.length}`);
});