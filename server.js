const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));

const db = new sqlite3.Database(':memory:');

const sqlScript = fs.readFileSync(path.join(__dirname, 'table.sql'), 'utf8');
db.exec(sqlScript, (err) => {
    if (err) {
        console.error('Error executing SQL script:', err.message);
    } else {
        console.log('Tables created successfully');
    }
});

app.get('/tables', (req, res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const tables = rows.map(row => row.name);
        const tableDataPromises = tables.map(table => {
            return new Promise((resolve, reject) => {
                db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ table, rows });
                    }
                });
            });
        });

        Promise.all(tableDataPromises)
            .then(data => res.json({ tables: data }))
            .catch(error => res.status(500).json({ error: error.message }));
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});