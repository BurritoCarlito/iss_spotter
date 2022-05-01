// it will contain most of the logic for fetching the data from each API endpoint.

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *  - A callback (to pass back an error or the IP string)
 * Returns (via callback):
 *  - An error, if any (nullable)
 *  - The IP address as a string (nill if error). Example: "162.245.144.188"
 */

const request = require('request');


const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  let url = 'https://api.ipify.org?format=json';
  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      return callback(Error(`Status Code: ${response.statusCode}, when attempting to fetch IP address. Response ${body}`), null);
      // Error = an new error object that can be passed to call back if there is an issue
      // ${body} = information sent back from API
      // response = reaction to the request
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

//will take in an IP address and returns the latitude and longitude for the IP address

/**
 * Input:
 *  - the ip address string
 *  - a callback (to pass back an error or the lat/lng object)
 * Returns:
 *  - an error, if any (nullable)
 *  - the late and lng as an object (null if error).
*/

const fetchCoordsByIP = function(ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      //error for invalid domain, if user is offline and etc.
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      // if non-200 status, assume server error.
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body);

    callback(null, { latitude, longitude });

  });
};


/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *  - an object with keys 'latitude' and 'longitude'
 *  - a callback (to pass an error or the array of resulting data)
 *
 * Returns (via callbacks):
 *  - an errory, if any (nullable)
 *  - a fly over times as an array of objects (null if error). Example:
 *  [{ rise time: 134564234, duration: 600}, ... ]
 */


const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      return callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
    }

    const passess = JSON.parse(body).response;
    callback(null, passess);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the users current location.
 *
 * Input:
 *  - a callback with an error or results;
 *
 * Returns:
 *  - an error, if any (nullable)
 *  - the fly-over times as ana array (null if error);
 * [ {risetime: <number>, duration: <number> }, ...]
 */

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });

};

module.exports = {
  // fetchMyIP,
  // fetchCoordsByIP,
  // fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};