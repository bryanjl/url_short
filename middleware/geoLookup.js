const geoip = require('geoip-lite');

const geoLookup = (ip) => {
    let geo = geoip.lookup(ip);

    return geo.country;
}

module.exports = geoLookup;