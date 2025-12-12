
const {
  getT,
  addAt,
  addLast,
  supAt,
  remove,
} = require("../services/todos.service");

const {sendJson} = require("../utils/http.js");


const readTodos = async (req, res,pathname) => sendJson(res, 200, await getT(req, res,pathname));

const modifyElem =async (req, res, pathname) => sendJson(res, 200, await addAt(req, res, pathname));

const addElem = async (req, res) => sendJson(res, 200, await addLast(req, res));

const deleteElem = async (req, res,pathname) =>sendJson(res, 200, await supAt(res, pathname)); 

module.exports = {
  readTodos,
  modifyElem,
  addElem,
  deleteElem,
};
