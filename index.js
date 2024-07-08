const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
const url = 'mongodb+srv://isakkiraj:Esscooty%407300@cluster0.fdsuknk.mongodb.net/todo';
// MongoDB connection
mongoose.connect(url);

const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Todo schema
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
  });
  await newTodo.save();
  res.json(newTodo);
});

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Todo deleted' });
});

app.put('/todos/:id', async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    {
      text: req.body.text,
      completed: req.body.completed,
    },
    { new: true }
  );
  res.json(updatedTodo);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
