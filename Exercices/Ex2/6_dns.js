// Utilisez dns.lookup pour obtenir l'adresse IP du NDD diginamic.fr
// Récupérez les enregistrements MX du même domaine (permet de spécifier les serveurs de messagerie pour un domaine).
// Affichez le résultat dans la console 
const dns = require("dns");

// 1. Résolution de l'adresse IP
dns.lookup("diginamic.fr", (err, address) => {
  if (err) {
    console.error("Erreur lookup :", err);
    return;
  }

  console.log("Adresse IP :", address);

  // 2. Récupération des enregistrements MX
  dns.resolveMx("diginamic.fr", (err2, records) => {
    if (err2) {
      console.error("Erreur MX :", err2);
      return;
    }

    console.log("Enregistrements MX :", records);
  });
});