const http = require('http');
const { parse } = require('url');

// Données en mémoire
// Imaginer qu'il s'agit d'une base de données 
// Chaque ligne de mon tableau est une entrée dans une table de ma base de données par exemple 

let liste = [
  { id: 1, title: "Acheter du lait", completed: false },
  { id: 2, title: "Acheter du crabe", completed: true },
  { id: 3, title: "Acheter des choses", completed: false },
];
// id random pour chaque nouvelle machineloupe
let nextId = Math.floor(Math.random() * 1000000);

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

// Création de serveur HTTP
const server = http.createServer(async (req, res) => {

  // Récupérer l'url
  const { pathname } = parse(req.url);
  // Récupérer la méthode (sois GET, POST, PUT, DELETE, etc.)
  const method = req.method.toUpperCase();

    if(pathname.startsWith('/api'))
    {
      console.log(pathname);
      let pathUrl = pathname.substring(4);
      console.log(pathUrl);
      // Toutes les routes alternatives
      // GET /list
      if (pathUrl === "/todo")
      {
        if(method === "GET") {
        return sendJson(res, 200, liste);
        }
        // POST /todo/
        if (method === "POST") {
          try {
            console.log("Post: " + req);
            const body = await parseBody(req);
            console.log("body: " + body);
            const newO = { id:nextId++,...body};
            console.log(newO.body);
            liste.push(newO);
            return sendJson(res, 200, newO);
          } catch (e) {
            return sendJson(res, 400, { error: e.message });
          }
        }
      }
      // Gestion de l'index après la route /todo/
      if (pathUrl?.startsWith("/todo/")) 
      {
        // On récupère la partie après la route /todo/
        const id = Number(pathUrl.split("/")[2]);
        // On cherche l'index de la machine dans le tableau
        const index = liste.findIndex((c) => c.id === id);

        if (index === -1) return notFound(res);

        // GET /todo/id
        if (method === "GET") {
          return sendJson(res, 200, liste[index]);
        }
        // PUT /todo/id
        if (method === "PUT") {
          try {
            console.log("Put: " + req);
            const body = await parseBody(req);
            console.log("body: " + body.title);

            const updated = { ...liste[index], ...body, id };
            liste[index]=updated;
            console.log(updated.body);
            return sendJson(res, 200, updated);
          } catch (e) {
            return sendJson(res, 400, { error: e.message });
          }
        }
        // PUT /todo/id
        if (method === "DELETE") {
          const e = liste[index];
          liste = liste.filter((item) => item.id !== id);
          return sendJson(res, 200, e);
        }
      }
    }

  // Route fallback
  notFound(res);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`API démarrée sur http://localhost:${PORT}`);
});
