// it will require and run our main fetch function

// code that will require and call the function in the iss.js file
// const { fetchMyIP } = require('./iss');
// const { fetchCoordsByIP } = require('./iss');
// const { fetchISSFlyOverTimes } = require('./iss');
const { nextISSTimesForMyLocation } = require('./iss');


fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log("It worked! Returned IP:", ip);
});


fetchCoordsByIP('2604:3d08:6b86:d200:f850:7c1f:693f:1be9', (error, coordinates) => {
  if (error) {
    console.log("It didn't work! ", error);
    return;
  }

  console.log("It worked! Returend coordinates:", coordinates);
});


const exampleCoords = { latitdue: '49.07233', longitude: '-122.' };

fetchISSFlyOverTimes(exampleCoords, (error, passTimes) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned flyover times: ', passTimes);
});




/* ----------------------FINAL FUNCTION----------------------------------------------------------------*/
const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  
  //success, prints out the details
  printPassTimes(passTimes);
});

