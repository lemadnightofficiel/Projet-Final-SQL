const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

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

app.get('/departments', (req, res) => {
    db.all("SELECT * FROM Departments", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/positions', (req, res) => {
    db.all("SELECT * FROM Positions", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/employee', (req, res) => {
    const { first_name, last_name, email, phone_number, hire_date, salary, department_id, position_id } = req.body;
    db.run(`INSERT INTO Employees (first_name, last_name, email, phone_number, hire_date, salary, department_id, position_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [first_name, last_name, email, phone_number, hire_date, salary, department_id, position_id], 
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        });
});

app.post('/department', (req, res) => {
    const { department_name, manager_id } = req.body;
    db.run(`INSERT INTO Departments (department_name, manager_id) VALUES (?, ?)`, 
        [department_name, manager_id], 
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        });
});

app.post('/position', (req, res) => {
    const { position_name, salary_range } = req.body;
    db.run(`INSERT INTO Positions (position_name, salary_range) VALUES (?, ?)`, 
        [position_name, salary_range], 
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        });
});

app.post('/salary', (req, res) => {
    const { employee_id, amount, effective_date } = req.body;
    db.run(`INSERT INTO Salaries (employee_id, amount, effective_date) VALUES (?, ?, ?)`, 
        [employee_id, amount, effective_date], 
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        });
});

app.post('/project', (req, res) => {
    const { project_name, start_date, end_date, department_id } = req.body;
    db.run(`INSERT INTO Projects (project_name, start_date, end_date, department_id) VALUES (?, ?, ?, ?)`, 
        [project_name, start_date, end_date, department_id], 
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        });
});

app.post('/employee-project', (req, res) => {
    const { employee_id, project_id, assignment_date } = req.body;
    db.run(`INSERT INTO Employee_Projects (employee_id, project_id, assignment_date) VALUES (?, ?, ?)`, 
        [employee_id, project_id, assignment_date], 
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ success: true });
        });
});

app.post('/attendance', (req, res) => {
    const { employee_id, date, status } = req.body;
    db.run(`INSERT INTO Attendance (employee_id, date, status) VALUES (?, ?, ?)`, 
        [employee_id, date, status], 
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        });
});

const tables = ['Employees', 'Departments', 'Positions', 'Salaries', 'Projects', 'Employee_Projects', 'Attendance'];

tables.forEach(table => {
    app.get(`/${table.toLowerCase()}`, (req, res) => {
        db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
