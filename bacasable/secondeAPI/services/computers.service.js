// On recupere les modules nécessaires
const fs = require('fs');
const path = require('path');

// On definit le chemin de la base de données
const DB_PATH = path.join(__dirname, '..', 'data', 'Computers.json');

// On verifie si le fichier de la base de données existe, sinon on le crée
const ensureDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, '[]');
  }
};

// On lance la fonction pour verifier si le fichier de la base de données existe
ensureDb();

// On charge les données de la base de données dans un tableau
const loadComputers = () => {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`Impossible de lire ${DB_PATH}, tableau vide`, err);
    return [];
  }
};

// On initialise le tableau des ordinateurs et on calcule l'id suivant
let computers = loadComputers();
let nextId = computers.reduce((max, { id }) => Math.max(max, id || 0), 0) + 1;

// On sauvegarde les données du tableau dans le fichier de la base de données
const saveComputers = () => {
  fs.writeFileSync(DB_PATH, JSON.stringify(computers, null, 2));
};

// On récupère tous les ordinateurs
const getAll = () => computers;

// On récupère un ordinateur par son id
const getById = (id) => computers.find((c) => c.id === id) || null;

// On crée un nouvel ordinateur
const create = (payload) => {
  const created = { id: nextId++, ...payload };
  computers.push(created);
  saveComputers();
  return created;
};

// On met à jour un ordinateur par son id
const update = (id, payload) => {
  const index = computers.findIndex((c) => c.id === id);
  if (index === -1) return null;
  const updated = { ...computers[index], ...payload, id };
  computers[index] = updated;
  saveComputers();
  return updated;
};

// On supprime un ordinateur par son id
const remove = (id) => {
  const index = computers.findIndex((c) => c.id === id);
  if (index === -1) return false;
  computers.splice(index, 1);
  saveComputers();
  return true;
};

// On exporte les fonctions du service
module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};

