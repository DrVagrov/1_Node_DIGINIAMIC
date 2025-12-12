// Fonctions utilitaires pour gérer les réponses HTTP
// Ces fonctions sont réutilisables dans tous les controllers

const sendJson = (res, status, payload) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

const notFound = (res) => {
  sendJson(res, 404, { error: 'Not found' });
};

const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });
};

module.exports = {
  sendJson,
  notFound,
  parseBody,
};

