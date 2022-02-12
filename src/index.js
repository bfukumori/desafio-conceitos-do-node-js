const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

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

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { todos } = request.user;
  const { title, deadline } = request.body;
  if (todos.length) {
    todos.forEach((todo) => {
      if (todo.id !== id) {
        return response.status(404).json({ error: "Esse todo não existe!" });
      }
      todo.title = title;
      todo.deadline = deadline;
      return response.status(201).json(todo);
    });
  } else {
    return response.status(400).json({ error: "Não há nenhum todo!" })
  }
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { todos } = request.user;
  if (todos.length) {
    todos.forEach((todo) => {
      if (todo.id !== id) {
        return response.status(404).json({ error: "Esse todo não existe!" });
      }
      todo.done = true;
      return response.status(201).json(todo);
    });
  } else {
    return response.status(400).json({ error: "Não há nenhum todo!" })
  }
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { todos } = request.user;
  if (todos.length) {
    todos.forEach((todo) => {
      if (todo.id !== id) {
        return response.status(404).json({ error: "Esse todo não existe!" });
      }
      todos.splice(todo, 1);
      return response.status(204).send();
    });
  } else {
    return response.status(400).json({ error: "Não há nenhum todo!" })
  }
});

module.exports = app;