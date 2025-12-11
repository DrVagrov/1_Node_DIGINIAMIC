// Le controller a besoin des fonctions du service pour les implémenter
// car c'est le service qui gère la logique métier
const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../services/computers.service');

// Les utils pour gérer les reponses une fois la partie logique métier implémentée
const { sendJson, notFound, parseBody } = require('../utils/http');

// Attention a aucun moment on implémente de logique métier dans le controller par convention.
// Toute la logique métier doit être implémentée dans le service.
// Le controller va simplement gérer les reponses et les erreurs, et les appels au service.
// Potentiellement également des vérifications de données, mais pas de logique métier.

// Liste tous les ordinateurs
const listComputers = (res) => sendJson(res, 200, getAll());

// Récupère un ordinateur par son id
const getComputer = (res, id) => {
  const computer = getById(id);
  if (!computer) return notFound(res);
  return sendJson(res, 200, computer);
};

// Ajoute un nouvel ordinateur
const createComputer = async (req, res) => {
  try {
    const body = await parseBody(req);
    // express validator existe
    if (!body.name || !body.tailleRam) {
      return sendJson(res, 400, { error: 'name et tailleRam requis' });
    }
    const created = create(body);
    return sendJson(res, 201, created);
  } catch (err) {
    return sendJson(res, 400, { error: err.message });
  }
};

// Met à jour un ordinateur par son id
const updateComputer = async (req, res, id) => {
  try {
    const body = await parseBody(req);
    const updated = update(id, body);
    if (!updated) return notFound(res);
    return sendJson(res, 200, updated);
  } catch (err) {
    return sendJson(res, 400, { error: err.message });
  }
};

// Supprime un ordinateur par son id
const deleteComputer = (res, id) => {
  const deleted = remove(id);
  if (!deleted) return notFound(res);
  return sendJson(res, 204);
};

module.exports = {
  listComputers,
  getComputer,
  createComputer,
  updateComputer,
  deleteComputer,
};

