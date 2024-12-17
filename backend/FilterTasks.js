const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../task-tracker.db');

const router = express.Router();

router.get('/filtered_all', (req, res) => {
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

router.get('/filtered_pending', (req, res) => {
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

router.get('/filtered_process', (req, res) => {
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

router.get('/tasks/filtered_done', (req, res) => {
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

module.exports = router;