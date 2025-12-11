// Le router a besoin des fonctions du controller pour les dispacher
const {
  listComputers,
  getComputer,
  createComputer,
  updateComputer,
  deleteComputer,
} = require('../controllers/computers.controller');

// La fonction router (exportée car utilisée dans index.js)
module.exports = async function computersRouter(req, res, pathname, method) {

  // Ici le router fait son travail à savoir rediriger vers la bonne méthode du controller 
  // en fonction de la route et de la méthode

  // Pour chaque route, on appel la méthode du controller correspondante
  // Et on retourne true pour indiquer que la route a été gérée
  if (pathname === '/computers') { 
    if (method === 'GET') {
      listComputers(res);
      return true;
    }
    if (method === 'POST') {
      await createComputer(req, res);
      return true;
    }
  }

  if (pathname.startsWith('/computers/')) {
    const id = Number(pathname.split('/')[2]);
    if (Number.isNaN(id)) return false;

    if (method === 'GET') {
      getComputer(res, id);
      return true;
    }
    if (method === 'PUT') {
      await updateComputer(req, res, id);
      return true;
    }
    if (method === 'DELETE') {
      deleteComputer(res, id);
      return true;
    }
  }

  return false;
};

