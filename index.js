const {Client} = require("@googlemaps/google-maps-services-js");

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3000
const client = new Client({});

//http://127.0.0.1:5000
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
    
    let zip_origen = req.query.zip_origen;
    let zip_dest = req.query.zip_dest;

    console.log('loading google api: ' + zip_origen);
    console.log();
    console.log('loading google api: ' + zip_dest);

    client.distancematrix({
        params: {
          origins: [zip_origen],
          destinations: [zip_dest],
          units:'metric',
          key: process.env.GOOGLE_MAPS_API_KEY //'AIzaSyCOXsIcGPD75cf41G5R-UE7A2YgZYEtI5E'
        },
        timeout: 1000 // milliseconds
      }).then(r => {
        const finalValue = r.data.rows[0].elements[0].distance;
        console.log(finalValue);
        res.send( JSON.stringify(finalValue));
      }).catch(e => {
        console.log(e);
      });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))