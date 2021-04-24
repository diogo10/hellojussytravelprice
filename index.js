const {Client} = require("@googlemaps/google-maps-services-js");

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3000
const client = new Client({});


function calculateValueFor(obj) {
  var value = Number(obj);
  var result = 0;
  if(value > 0 && value < 5000) {
    result = 0; 
  } else if(value > 5000 && value <= 8000) {
    result = 4;
  }else if(value > 8000 && value <= 10000) {
    result = 5;
  }else if(value > 10000 && value <= 15000) {
    result = 6;
  }else if(value > 15000 && value <= 30000) {
    result = 8;
  }else {
    result = 12;
  }

  return result; 
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
    
    let zip_origen = req.query.zip_origen;
    let zip_dest = req.query.zip_dest;
    console.log('loading google api: ' + zip_dest);

    if(!zip_dest.includes("-")) {
      zip_dest = formatZip(zip_dest);
    }

    client.distancematrix({
        params: {
          origins: [zip_origen],
          destinations: [zip_dest],
          units:'metric',
          key: process.env.GOOGLE_MAPS_API_KEY 
        },
        timeout: 1000 // milliseconds
      }).then(r => {

        try {
              var finalValue = r.data.rows[0].elements[0].distance;
              finalValue.cost = calculateValueFor(finalValue.value);
              console.log("google finalValue: " + finalValue);
              finalValue.status = "OK";
              res.send(JSON.stringify(finalValue));
        } catch (error) {
          console.error(error);
          res.send({ "status":"NOK", "message":error.message});
        }

       

      }).catch(e => {
        console.log(e);
        res.send({ "status":"NOK", "message":e.message});
      });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


function formatZip(value) {
  var temp1 = value.substring(0, 4);
  var temp2 = value.substring(4,7);
  return temp1 + "-" + temp2;
}