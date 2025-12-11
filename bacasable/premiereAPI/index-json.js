// Version avec data/Computers.json

const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('url');

// --------------------   Création des variables utiles -------------------- 

// Chemin de la base de données
const DB_PATH = path.join(__dirname, 'data', 'Computers.json');
const PORT = 3000;

// -------------------- Fonctions utiles -------------------- 

// Charge les données de la base de données dans un tableau
const loadComputers = () => {
  try { 
    // ReadFileSync est une fonction synchrone qui permet de lire le fichier JSON
    // cela veut dire que le code va attendre que le fichier soit lu avant de continuer
    // Pour être certain que le fichier soit lu, on utilise readFileSync
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    // On parse le fichier JSON en un tableau (Vous pouvez console.log(raw) pour voir le contenu du fichier)
    const parsed = JSON.parse(raw);
    // On retourne le tableau en s'assurant qu'il est un tableau
    return Array.isArray(parsed) ? parsed : [];
  } 
  catch (err) {
    // En cas d'erreur, on affiche un message d'erreur et on retourne un tableau vide
    console.error(`Impossible de lire ${DB_PATH}, tableau vide`, err);
    return [];
  }
};

// Enregistre les données dans la base de données
const saveComputers = (data) => {
  // On écrit le tableau dans le fichier JSON
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// A chaque fois que l'on veut envoyer une réponse JSON, on utilise cette fonction
const sendJson = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

// La 404 en fin de chaine de requête
const notFound = (res) => sendJson(res, 404, { error: 'Not found' });

// Permet de lire le corps de la requête et de le parser en JSON
const parseBody = (req) =>
  // On crée une promesse car la lecture des données est asynchrone.
  new Promise((resolve) => {
    let data = '';
    // À chaque fois qu’un morceau du body arrive, on l’ajoute à data. HTTP arrive en paquets (streams), jamais tout d’un coup.
    req.on('data', (chunk) => {
      // Tout en format texte
      data += chunk.toString();
    });
    // Quand tout le body est arrivé, on parse le texte en JSON et on résout la promesse.
    req.on('end', () => {
      resolve(JSON.parse(data));
    });
});

// -------------------- Fonction particuliere : le serveur -------------------- 

// Création de serveur HTTP
const server = http.createServer(async (req, res) => {

  // Récupérer l'url
  const { pathname } = parse(req.url);
  // Récupérer la méthode (sois GET, POST, PUT, DELETE, etc.)
  const method = req.method.toUpperCase();

  // Toutes les routes alternatives
  // GET /computers
  if (pathname === '/computers' && method === 'GET') {
    return sendJson(res, 200, computers);
  }
  // Gestion de l'index après la route /computers/
  if (pathname?.startsWith('/computers/')) {
    // On récupère la partie après la route /computers/
    const id = Number(pathname.split('/')[2]);
    // On cherche l'index de la machine dans le tableau
    const index = computers.findIndex((c) => c.id === id);
    
    if (index === -1) return notFound(res);

    // GET /computers/id
    if (method === 'GET') {
      return sendJson(res, 200, computers[index]);
    }

    // DELETE /computers/id
    if (method === 'DELETE') {
      computers.splice(index, 1)[0];
      saveComputers(computers);
      return sendJson(res, 204);
    }

    // PUT /computers/id
    if (method === 'PUT') {
      try {
        const body = await parseBody(req);
        const updated = { ...computers[index], ...body, id };
        computers[index] = updated;
        saveComputers(computers);
        // On envoie la machine mise à jour
        return sendJson(res, 200, updated);
      } catch (err) {
        return sendJson(res, 400, { error: err.message });
      }
    }
  }

  // POST /computers
  if (pathname === '/computers' && method === 'POST') {

    try {
      const body = await parseBody(req);
      // gestion simple des erreurs pour vérifier qu'il y a au moins un nom et une taille de RAM
      if (!body.name || !body.tailleRam) {
        return sendJson(res, 400, { error: 'name et tailleRam requis' });
      }
      // On crée la machine avec l'id suivant et les données du body
      const created = { id: nextId++, ...body };
      // On ajoute la machine au tableau
      computers.push(created);
      saveComputers(computers);
      // On envoie la machine créée
      return sendJson(res, 201, created);
    } catch (err) {
      return sendJson(res, 400, { error: err.message });
    }
  }
  // Route fallback
  notFound(res);
});


// -------------------- Lancement de l'API -------------------- 

// Lance la lecture de la base de données
let computers = loadComputers();
let nextId = computers.reduce((max, { id }) => Math.max(max, id || 0), 0) + 1;

server.listen(PORT, () => {
  console.log(`API JSON BDD démarrée sur http://localhost:${PORT}`);
}); 

