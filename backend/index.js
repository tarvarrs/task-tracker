const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3') .verbose();
const { v4: uuidv4 } = require('uuid');
const os = require('os');

dotenv.config();

const app = express();

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

const db = new sqlite3.Database('../task-tracker.db');

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

// API for task sorting
app.get('/tasks/ordered_by_id', (req, res) => {
  console.log(`[${req.requestId}] Сортировка задач по id`);
  db.all('SELECT * FROM tasks ORDER BY id', (err, rows) => {
    if (err) {
      console.error(`[${req.requestId}] Ошибка: ${err.message}`);
      return res.status(500).send('Internal Server Error');
    }
    res.json(rows);
    console.log(`[${req.requestId}] Успешно`);
  });
});

app.get('/tasks/ordered_by_deadline', (req, res) => {
  console.log(`[${req.requestId}] Сортировка задач по дедлайну`);
  db.all('SELECT * FROM tasks ORDER BY date_end', (err, rows) => {
    if (err) {
      console.error(`[${req.requestId}] Ошибка: ${err.message}`);
      return res.status(500).send('Internal Server Error');
    }
    res.json(rows);
    console.log(`[${req.requestId}] Успешно`);
  });
});

app.get('/tasks/ordered_by_status', (req, res) => {
  console.log(`[${req.requestId}] Сортировка задач по статусу`);
  db.all('SELECT * FROM tasks ORDER BY status', (err, rows) => {
    if (err) {
      console.error(`[${req.requestId}] Ошибка: ${err.message}`);
      return res.status(500).send('Internal Server Error');
    }
    res.json(rows);
    console.log(`[${req.requestId}] Успешно`);
  });
});

app.get('/tasks/ordered_by_priority', (req, res) => {
  console.log(`[${req.requestId}] Сортировка задач по приоритету`);
  db.all('SELECT * FROM tasks ORDER BY priority', (err, rows) => {
    if (err) {
      console.error(`[${req.requestId}] Ошибка: ${err.message}`);
      return res.status(500).send('Internal Server Error');
    }
    res.json(rows);
    console.log(`[${req.requestId}] Успешно`);
  });
});

// API for task filtering
app.get('/tasks/filtered_all', (req, res) => {
  console.log(`[${req.requestId}] Фильтрация задач`);
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      console.error(`[${req.requestId}] Ошибка: ${err.message}`);
      return res.status(500).send('Internal Server Error');
    }
    res.json(rows);
    console.log(`[${req.requestId}] Успешно`);
  });
});

app.get('/tasks/filtered_pending', (req, res) => {
  console.log(`[${req.requestId}] Фильтрация задач`);
  db.all('SELECT * FROM tasks WHERE status = "В ожидании"', (err, rows) => {
    if (err) {
      console.error(`[${req.requestId}] Ошибка: ${err.message}`);
      return res.status(500).send('Internal Server Error');
    }
    res.json(rows);
    console.log(`[${req.requestId}] Успешно`);
  });
});

app.get('/tasks/filtered_process', (req, res) => {
  console.log(`[${req.requestId}] Фильтрация задач`);
  db.all('SELECT * FROM tasks WHERE status = "В процессе"', (err, rows) => {
    if (err) {
      console.error(`[${req.requestId}] Ошибка: ${err.message}`);
      return res.status(500).send('Internal Server Error');
    }
    res.json(rows);
    console.log(`[${req.requestId}] Успешно`);
  });
});

app.get('/tasks/filtered_done', (req, res) => {
  console.log(`[${req.requestId}] Фильтрация задач`);
  db.all('SELECT * FROM tasks WHERE status = "Выполнено"', (err, rows) => {
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