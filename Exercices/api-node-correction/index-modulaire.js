const http = require('http');
const { parse } = require('url');
const todosRouter = require('./routes/todos.routes');
const { notFound } = require('./utils/http');

const PORT = 3000;

const server = http.createServer(async (req, res) => {

  const { pathname } = parse(req.url);
  const method = req.method.toUpperCase();

  if (pathname?.startsWith('/api/todos')) {
    const handled = await todosRouter(req, res, pathname, method);
    if (handled) return;
  }

  notFound(res);
});

server.listen(PORT, () => {
  console.log(`API TODOS modulaire sur http://localhost:${PORT}`);
});

