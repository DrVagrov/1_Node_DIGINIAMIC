const {
  getAll,
  getById,
  create,
  update,
  remove,
} = require('../services/todos.service');

const { sendJson, notFound, parseBody } = require('../utils/http');

const listTodos = (res) => sendJson(res, 200, getAll());

const getTodo = (res, id) => {
  const todo = getById(id);
  if (!todo) return notFound(res);
  return sendJson(res, 200, todo);
};

const createTodo = async (req, res) => {
  try {
    const body = await parseBody(req);
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return sendJson(res, 400, { error: 'title requis (string non vide)' });
    }
    if (body.completed !== undefined && typeof body.completed !== 'boolean') {
      return sendJson(res, 400, { error: 'completed doit être un boolean' });
    }
    const created = create({
      title: body.title.trim(),
      completed: body.completed,
    });
    return sendJson(res, 201, created);
  } catch (err) {
    return sendJson(res, 400, { error: err.message });
  }
};

const updateTodo = async (req, res, id) => {
  try {
    const body = await parseBody(req);
    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || !body.title.trim()) {
        return sendJson(res, 400, { error: 'title requis (string non vide)' });
      }
      body.title = body.title.trim();
    }
    if (body.completed !== undefined && typeof body.completed !== 'boolean') {
      return sendJson(res, 400, { error: 'completed doit être un boolean' });
    }
    const updated = update(id, body);
    if (!updated) return notFound(res);
    return sendJson(res, 200, updated);
  } catch (err) {
    return sendJson(res, 400, { error: err.message });
  }
};

const deleteTodo = (res, id) => {
  const deleted = remove(id);
  if (!deleted) return notFound(res);
  return sendJson(res, 204);
};

module.exports = {
  listTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
};

