// Le router a besoin des fonctions du controller pour les dispacher
const {
  readTodos,
  modifyElem,
  addElem,
  deleteElem
} = require("../controller/todos.controller.js");


module.exports = async function todosRouter(req, res, pathname, methode) {
  if (methode == "get") {
    readTodos(req, res,pathname);
    return true;
  }
   else if (methode == "put") {
    modifyElem(req, res, pathname);
    return true;
  }
  else if (methode == "delete") {
    deleteElem(req,res,pathname)
    return true;
  }
  else if (methode == "post") {
    addElem(req,res);
    return true; 
  }
};