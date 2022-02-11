const {Client} = require("@googlemaps/google-maps-services-js");

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3000
const client = new Client({});
const calculateValueFor = require('./util');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
    
    let zip_origen = req.query.zip_origen;
    let zip_dest = req.query.zip_dest;

    if(zip_dest == '' || zip_dest === undefined) {
      console.log("zip_dest is empty or  undefined");
      res.send(JSON.stringify({ 'status': 'NOK','message': "no dest"}));
      return
    }

    if(!zip_dest.includes("-")) {
      zip_dest = formatZip(zip_dest);
    }

    client.distancematrix({
        params: {
          origins: [zip_origen + ", Setúbal, Portugal"],
          destinations: [zip_dest],
          units:'metric',
          key: process.env.GOOGLE_MAPS_API_KEY 
        },
        timeout: 1000 // milliseconds
      }).then(r => {

          try {
                var finalValue = r.data.rows[0].elements[0].distance;
                finalValue.cost = calculateValueFor(finalValue.value);
                finalValue.status = "OK";
                var myResponse = JSON.stringify(finalValue);
                console.log(myResponse);
                res.send(myResponse);
          } catch (error) {
            console.log(error);
            handlerError(res, error);
          }


      }).catch(e => {
        console.log(e);
        handlerError(res, error);
      });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


function formatZip(value) {
  var temp1 = value.substring(0, 4);
  var temp2 = value.substring(4,7);
  return temp1 + "-" + temp2;
}

function handlerError(res, error) {
  res.send(JSON.stringify({ 'status': 'NOK','message': error.message}));
}