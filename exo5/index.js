
// On recupere les modules nécessaires
const http = require('http');
const { parse } = require('url');

const computersRouter = require("./routes/todos.routes");

const { notFound } = require("./utils/http");
const todosRoutes = require('./routes/todos.routes');

// On definit le port
const PORT = 3000;

const searchServer = http.createServer(async (req, res) => {

    const { pathname } = parse(req.url);
    const method = req.method.toLowerCase();

    if(pathname.startsWith('/todos'))
    {
        console.log("todos")
        todosRoutes(req,res,pathname,method);
        return true;
    }
    else{
      notFound(res);
    }
});

searchServer.listen(PORT, () => {
  console.log(`API JSON BDD (secondeAPI) sur http://localhost:${PORT}`);
});