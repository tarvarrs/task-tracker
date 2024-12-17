const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const os = require('os');
const FilterTasks = require('./FilterTasks')
const SortTasks = require('./SortTasks')
const fs = require('fs')

dotenv.config();

const app = express();
const router = express.Router();
const db = new sqlite3.Database('../task-tracker.db');

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const requestId = uuidv4();
  const startTime = Date.now();

  req.requestId = requestId;
  console.log(`[${requestId}] Начат запрос ${req.method} ${req.url}`);
  res.on('finish', () => {
    const endTime = Date.now();
    const duration = endTime-startTime;
    console.log(`[${requestId}] Завершен запрос ${req.method} ${req.url} за ${duration}мс`);
  });
  next();
});

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use('/tasks', FilterTasks);
app.use('/tasks', SortTasks);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

// API for getting all tasks
app.get('/tasks', (req, res) => {
  console.log(`[${req.requestId}] Получение списка задач`)
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      console.error(`[${req.requestId}] Ошибка: ${err.message}`);
      return res.status(500).send('Internal Server Error');
    }
    res.json(rows);
    console.log(`[${req.requestId}] Успешно`);
  });
});

// API for getting task by id
app.get('/tasks/:id', (req, res) => {
  console.log(`[${req.requestId}] Получение задачи по id`);
  db.get('SELECT * FROM tasks WHERE id = ?', req.params.id, (err, row) => {
    if (err) {
      console.error(`[${req.requestId}] Ошибка: ${err.message}`);
      return res.status(500).send('Internal Server Error');
    }
    if (!row) {
      return res.status(404).send('Task not found');
    }
    res.json(row);
    console.log(`[${req.requestId}] Успешно`);
  });
});

// API for task status update
app.put('/tasks/:id/status', (req, res) => {
  console.log(`[${req.requestId}] Изменение статуса задачи`);
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  const validStatuses = ['В ожидании', 'В процессе', 'Выполнено'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const dateUpdate = new Date().toISOString().slice(0, 10);

  const sql = 'UPDATE tasks SET status = ?, date_update = ? WHERE id = ?';
  db.run(sql, [status, dateUpdate, id], function (err) {
    if (err) {
      console.error(`[${req.requestId}] Ошибка: ${err.message}`);
      return res.status(500).send('Internal Server Error');
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task status updated successfully' });
    console.log(`[${req.requestId}] Успешно`);
  });
});

// API for task delete
app.delete('/tasks/:id', (req, res) => {
  console.log(`[${req.requestId}] Удаление задачи`);
  const taskId = req.params.id;

  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.run(sql, [taskId], function (err) {
    if (err) {
      console.error(`[${req.requestId}] Ошибка: ${err.message}`);
      return res.status(500).send('Internal Server Error');
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
    console.log(`[${req.requestId}] Успешно`);
  });
});

// API for task create
app.post('/tasks', (req, res) => {
  console.log(`[${req.requestId}] Добавление задачи`);
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
      console.error(`[${req.requestId}] Ошибка: ${err.message}`);
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
        console.error(`[${req.requestId}] Ошибка: ${err.message}`);
        return res.status(500).send('Internal Server Error');
      }

      res.status(201).json({ message: 'Task added successfully', taskId: newId });
      console.log(`[${req.requestId}] Успешно`);
    });
  });
});

// API listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// getting information about server's OS
app.get('/server-info', (req, res) => {
  const serverInfo = {
    platform: os.platform(),
    arch: os.arch()
  };
  res.json(serverInfo);
});

app.get('/file-content', (req, res) => {
  console.log(`[${req.requestId}] Добавление задачи`);
  const filePath = './files/something.txt';
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`[${req.requestId}] Ошибка: ${err.message}`);
      return res.status(500).json({ error: 'Не удалось прочитать файл' });
    }
    res.json({ content: data });
  });
});

module.exports = router;
