const express = require('express');
const path = require('path');
const { createDatabase, db, initializeDatabase } = require('./create-database');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

createDatabase()
  .then(() => {
    console.log('Base de données créée avec succès');
    return initializeDatabase();
  })
  .then(() => {
    console.log('Données initiales insérées avec succès');

    app.get('/tables', (req, res) => {
      db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'", [], (err, rows) => {
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

    app.get('/employees/department/:department_id', (req, res) => {
      const { department_id } = req.params;
      db.all(`SELECT * FROM Employees WHERE department_id = ?`, [department_id], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    app.get('/employees/position/:position_id', (req, res) => {
      const { position_id } = req.params;
      db.all(`SELECT * FROM Employees WHERE position_id = ?`, [position_id], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    app.get('/departments/name/:name', (req, res) => {
      const { name } = req.params;
      db.all(`SELECT * FROM Departments WHERE department_name LIKE ?`, [`%${name}%`], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    app.get('/departments/manager/:manager_id', (req, res) => {
      const { manager_id } = req.params;
      db.all(`SELECT * FROM Departments WHERE manager_id = ?`, [manager_id], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    app.get('/positions/name/:name', (req, res) => {
      const { name } = req.params;
      db.all(`SELECT * FROM Positions WHERE position_name LIKE ?`, [`%${name}%`], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    app.get('/positions/salary_range/:range', (req, res) => {
      const { range } = req.params;
      db.all(`SELECT * FROM Positions WHERE salary_range = ?`, [range], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    app.get('/salaries/amount/:min/:max', (req, res) => {
      const { min, max } = req.params;
      db.all(`SELECT * FROM Salaries WHERE amount BETWEEN ? AND ?`, [min, max], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    app.get('/salaries/date/:date', (req, res) => {
      const { date } = req.params;
      db.all(`SELECT * FROM Salaries WHERE effective_date = ?`, [date], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    app.get('/projects/department/:department_id', (req, res) => {
      const { department_id } = req.params;
      db.all(`SELECT * FROM Projects WHERE department_id = ?`, [department_id], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    app.get('/projects/start_date/:start_date', (req, res) => {
      const { start_date } = req.params;
      db.all(`SELECT * FROM Projects WHERE start_date = ?`, [start_date], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    app.get('/employee-projects/employee/:employee_id', (req, res) => {
      const { employee_id } = req.params;
      db.all(`SELECT * FROM Employee_Projects WHERE employee_id = ?`, [employee_id], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    app.get('/employee-projects/project/:project_id', (req, res) => {
      const { project_id } = req.params;
      db.all(`SELECT * FROM Employee_Projects WHERE project_id = ?`, [project_id], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    app.get('/attendance/status/:status', (req, res) => {
      const { status } = req.params;
      db.all(`SELECT * FROM Attendance WHERE status = ?`, [status], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(rows);
      });
    });

    app.get('/attendance/date/:date', (req, res) => {
      const { date } = req.params;
      db.all(`SELECT * FROM Attendance WHERE date = ?`, [date], (err, rows) => {
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

    app.delete('/delete/:table/:id', (req, res) => {
      const { table, id } = req.params;
      let query = '';
      let params = [];
    
      if (table === 'employee-project') {
        const [employeeId, projectId] = id.split('-');
        query = `DELETE FROM Employee_Projects WHERE employee_id = ? AND project_id = ?`;
        params = [employeeId, projectId];
      } else if (table === 'attendance') {
        query = `DELETE FROM Attendance WHERE attendance_id = ?`;
        params = [id];
      } else if (table === 'salaries') {
        query = `DELETE FROM Salaries WHERE salary_id = ?`;
        params = [id];
      } else {
        const idColumn = `${table.slice(0, -1)}_id`;
        query = `DELETE FROM ${table} WHERE ${idColumn} = ?`;
        params = [id];
      }
    
      db.run(query, params, function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ success: true });
      });
    });
    
    app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error("Erreur lors de l'initialisation de la base de données:", error);
  });