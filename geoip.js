const geoip = require('geoip-lite');

const geoLookup = () => {
    let ip = "113.23.104.177";
    let geo = geoip.lookup(ip);

    console.log(geo.city, geo.country);
}

geoLookup();

