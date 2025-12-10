// exemple d'utilisation de dns.lookup

const dns = require('dns');

dns.lookup('google.fr', (err, address) => {
    if (err) throw err;
    console.log(`Adresse IP de google.fr : ${address}`);
});