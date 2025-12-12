const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('url');

// --------------------   Création des variables utiles --------------------

// Chemin de la "base de données"
const DB_PATH = path.join(__dirname, 'data', 'articles.json');
const PORT = 3000;

// -------------------- Fonctions utiles --------------------

// Charge les données de la base de données dans un tableau
const loadArticles = () => {
  try {
    // ReadFileSync est une fonction synchrone qui permet de lire le fichier JSON
    // cela veut dire que le code va attendre que le fichier soit lu avant de continuer
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    // On parse le fichier JSON en un tableau
    const parsed = JSON.parse(raw);
    // On retourne le tableau en s'assurant qu'il est un tableau
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    // En cas d'erreur (fichier n'existe pas, JSON invalide, etc.)
    // on affiche un message d'erreur et on retourne un tableau vide
    console.error(`Impossible de lire ${DB_PATH}, tableau vide`, err.message);
    return [];
  }
};

// Enregistre les données dans la base de données
const saveArticles = (data) => {
  try {
    // On écrit le tableau dans le fichier JSON avec une indentation de 2 espaces
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Impossible d'écrire dans ${DB_PATH}`, err.message);
  }
};

// Fonction utilitaire pour envoyer une réponse JSON
const sendJson = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

// Fonction pour gérer les routes non trouvées
const notFound = (res) => {
  sendJson(res, 404, { error: 'Not found' });
};

// Fonction pour lire et parser le corps de la requête
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let data = '';
    // Accumulation des morceaux de données
    req.on('data', (chunk) => {
      data += chunk.toString();
    });
    // Quand toutes les données sont reçues
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });
};

// -------------------- Données chargées en mémoire --------------------

// Chargement des articles depuis le fichier JSON au démarrage
let articles = loadArticles();

// Calcul du prochain ID en fonction du plus grand ID existant
let nextId = articles.reduce((max, { id }) => Math.max(max, id || 0), 0) + 1;

// -------------------- Fonction particulière : le serveur --------------------

// Création du serveur HTTP
const server = http.createServer(async (req, res) => {
  // Extraction du pathname depuis l'URL
  const { pathname } = parse(req.url);
  // Récupération de la méthode HTTP
  const method = req.method.toUpperCase();

  // Route GET /articles - retourne tous les articles
  if (pathname === '/articles' && method === 'GET') {
    return sendJson(res, 200, articles);
  }

  // Gestion des routes avec ID (/articles/:id)
  if (pathname?.startsWith('/articles/')) {
    // Extraction de l'ID depuis l'URL
    const id = Number(pathname.split('/')[2]);
    
    // Recherche de l'index de l'article dans le tableau
    const index = articles.findIndex((a) => a.id === id);
    
    // Si l'article n'existe pas, retourner une 404
    if (index === -1) {
      return notFound(res);
    }

    // Route GET /articles/:id - retourne un article par son ID
    if (method === 'GET') {
      return sendJson(res, 200, articles[index]);
    }

    // Route PUT /articles/:id - met à jour un article
    if (method === 'PUT') {
      try {
        // Lecture et parsing du corps de la requête
        const body = await parseBody(req);
        
        // Mise à jour de l'article en fusionnant les données
        // L'ID est préservé et ne peut pas être modifié
        const updatedArticle = {
          ...articles[index],
          ...body,
          id // L'ID reste inchangé
        };
        
        // Remplacement de l'article dans le tableau
        articles[index] = updatedArticle;
        
        // Sauvegarde dans le fichier JSON
        saveArticles(articles);
        
        // Retour de l'article mis à jour
        return sendJson(res, 200, updatedArticle);
      } catch (err) {
        // Gestion des erreurs (JSON invalide, etc.)
        return sendJson(res, 400, { error: err.message });
      }
    }

    // Route DELETE /articles/:id - supprime un article
    if (method === 'DELETE') {
      // Suppression de l'article du tableau
      articles.splice(index, 1);
      
      // Sauvegarde dans le fichier JSON
      saveArticles(articles);
      
      // Retour d'un statut 204 (No Content) sans corps
      res.writeHead(204);
      return res.end();
    }
  }

  // Route POST /articles - crée un nouvel article
  if (pathname === '/articles' && method === 'POST') {
    try {
      // Lecture et parsing du corps de la requête
      const body = await parseBody(req);
      
      // Vérification des champs requis
      if (!body.title || !body.author) {
        return sendJson(res, 400, { 
          error: 'Les champs title et author sont requis' 
        });
      }
      
      // Création du nouvel article avec un ID unique
      const newArticle = {
        id: nextId++,
        title: body.title,
        author: body.author
      };
      
      // Ajout de l'article au tableau
      articles.push(newArticle);
      
      // Sauvegarde dans le fichier JSON
      saveArticles(articles);
      
      // Retour de l'article créé avec le statut 201
      return sendJson(res, 201, newArticle);
    } catch (err) {
      // Gestion des erreurs (JSON invalide, etc.)
      return sendJson(res, 400, { error: err.message });
    }
  }

  // Toutes les autres routes retournent une 404
  notFound(res);
});

// -------------------- Lancement de l'API --------------------

// Le serveur écoute sur le port 3000
server.listen(PORT, () => {
  console.log(`API REST avec persistance démarrée sur http://localhost:${PORT}`);
  console.log(`Données chargées depuis ${DB_PATH}`);
  console.log(`${articles.length} article(s) chargé(s)`);
});

