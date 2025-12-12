const {
  listTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todos.controller');

module.exports = async function todosRouter(req, res, pathname, method) {
  if (pathname === '/api/todos') {
    if (method === 'GET') {
      listTodos(res);
      return true;
    }
    if (method === 'POST') {
      await createTodo(req, res);
      return true;
    }
  }

  if (pathname.startsWith('/api/todos/')) {
    const id = Number(pathname.split('/')[3]);
    if (!Number.isInteger(id) || id <= 0) return false;

    if (method === 'GET') {
      getTodo(res, id);
      return true;
    }
    if (method === 'PUT') {
      await updateTodo(req, res, id);
      return true;
    }
    if (method === 'DELETE') {
      deleteTodo(res, id);
      return true;
    }
  }

  return false;
};

