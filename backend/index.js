const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3') .verbose();

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.use(express.json());

const db = new sqlite3.Database('../task-tracker.db');

app.get('/', (req, res) => {
  res.send('Backend is running');
});

// API for getting all tasks
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Internal Server Error');
    }
    res.json(rows);
  });
});

// API for getting task by id
app.get('/tasks/:id', (req, res) => {
  db.get('SELECT * FROM tasks WHERE id = ?', req.params.id, (err, row) => {
    if (err) {
      console.message(err.message);
      return res.status(500).send('Internal Server Error');
    }
    if (!row) {
      return res.status(404).send('Task not found');
    }
    res.json(row);
  });
});

// API listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
