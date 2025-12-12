const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'Todos.json');

const ensureDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, '[]');
  }
};

ensureDb();

const loadTodos = () => {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`Impossible de lire ${DB_PATH}, tableau vide`, err);
    return [];
  }
};

let todos = loadTodos();
let nextId = todos.reduce((max, { id }) => Math.max(max, id || 0), 0) + 1;

const saveTodos = () => {
  fs.writeFileSync(DB_PATH, JSON.stringify(todos, null, 2));
};

const getAll = () => todos;

const getById = (id) => todos.find((t) => t.id === id) || null;

const create = (payload) => {
  const created = {
    id: nextId++,
    title: payload.title,
    completed: payload.completed ?? false,
  };
  todos.push(created);
  saveTodos();
  return created;
};

const update = (id, payload) => {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const updated = { ...todos[index], ...payload, id };
  todos[index] = updated;
  saveTodos();
  return updated;
};

const remove = (id) => {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  saveTodos();
  return true;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};

