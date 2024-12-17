const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../task-tracker.db');

const router = express.Router();

router.get('/ordered_by_id', (req, res) => {
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

router.get('/ordered_by_deadline', (req, res) => {
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

router.get('/ordered_by_status', (req, res) => {
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

router.get('/ordered_by_priority', (req, res) => {
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

module.exports = router;