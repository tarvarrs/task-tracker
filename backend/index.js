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

// API for task status update
app.put('/tasks/:id/status', (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  const validStatuses = ['В ожидании', 'В процессе', 'Выполнено'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const sql = 'UPDATE tasks SET status = ? WHERE id = ?';
  db.run(sql, [status, taskId], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Internal Server Error');
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task status updated successfully' });
  });
});

// API for task delete
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.run(sql, [taskId], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Internal Server Error');
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  });
});

// API for task create
app.post('/tasks', (req, res) => {
  const { task_name, description, date_end, priority } = req.body;

  if (!task_name || !priority) {
    return res.status(400).json({ message: 'Task name and priority are required' });
  }

  const priorityMap = { '!': 1, '!!': 2, '!!!': 3 };
  const priorityValue = priorityMap[priority];

  if (!priorityValue) {
    return res.status(400).json({ message: 'Invalid priority value' });
  }

  db.get('SELECT MAX(id) AS maxId FROM tasks', (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Internal Server Error');
    }

    const newId = (row?.maxId || 0) + 1;

    const currentDate = new Date().toISOString().slice(0, 10);

    const sql = `
      INSERT INTO tasks (id, task_name, description, date_create, date_update, date_end, status, priority)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(sql, [newId, task_name, description || '', currentDate, currentDate, date_end || null, 'В ожидании', priorityValue], function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Internal Server Error');
      }

      res.status(201).json({ message: 'Task added successfully', taskId: newId });
    });
  });
});

// API listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
