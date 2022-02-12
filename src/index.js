const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// Middleware para verificar a existência do todo
function checksExistsTodos(request, response, next) {
  const { id } = request.params;
  const { todos } = request.user;
  if (todos.length) {
    const specificTodo = todos.find((todo) => todo.id === id);
    todos.forEach((todo) => {
      if (todo.id !== id) {
        return response.status(404).json({ error: "Esse todo não existe!" });
      }
      request.todo = specificTodo;
      return next();
    });
  } else {
    return response.status(400).json({ error: "Não há nenhum todo!" })
  }
}

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return response.status(404).json({ error: "Usuário não encontrado!" });
  }
  request.user = user;
  return next();

}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const userAlreadyExists = users.some((user) => user.username === username);
  if (userAlreadyExists) {
    return response.status(400).json({ error: "Usuário já existe!" })
  }
  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  })
  return response.status(201).json(users);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { todos } = request.user;
  return response.json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { todos } = request.user;
  todos.push({
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  });
  return response.status(201).json(todos);
});

app.put('/todos/:id', checksExistsUserAccount, checksExistsTodos, (request, response) => {
  const { todo } = request;
  const { title, deadline } = request.body;
  todo.title = title;
  todo.deadline = deadline;
  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, checksExistsTodos, (request, response) => {
  const { todo } = request;
  todo.done = true;
  return response.status(201).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, checksExistsTodos, (request, response) => {
  const { todo } = request;
  const { todos } = request.user;
  todos.splice(todo, 1);
  return response.status(204).send();
});

module.exports = app;