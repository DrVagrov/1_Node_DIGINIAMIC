// On recupere les modules nécessaires
const http = require('http');
const { parse } = require('url');
// les routes
const computersRouter = require('./routes/computers.routes');
// usersRouter ...

// les utils (la 404)
const { notFound } = require('./utils/http');

// On definit le port
const PORT = 3000;

// le server
const server = http.createServer(async (req, res) => {
  
  const { pathname } = parse(req.url);
  const method = req.method.toUpperCase();

  // On redirige la routes /computers vers le router des computers
  if (pathname?.startsWith('/computers')) {
    const handled = await computersRouter(req, res, pathname, method);
    // Si la route est gérée, on retourne
    if (handled) return;
  }

  // C'est ici qu'on pourrait gérer les autres routes
  // if(pathName?.startsWith('/users/')) { ... userRouter ...

  // Si la route n'est pas gérée, on retourne la 404
  notFound(res);
});

server.listen(PORT, () => {
  console.log(`API JSON BDD (secondeAPI) sur http://localhost:${PORT}`);
});

