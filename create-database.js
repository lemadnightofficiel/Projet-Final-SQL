const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bdd.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Employees (
    employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT NOT NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER NOT NULL,
    position_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id),
    FOREIGN KEY (position_id) REFERENCES Positions(position_id);
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Departments (
    department_id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_name TEXT NOT NULL,
    manager_id INTEGER NOT NULL,
    FOREIGN KEY (manager_id) REFERENCES Employees(employee_id);
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Positions (
    position_id INTEGER PRIMARY KEY AUTOINCREMENT,
    position_name TEXT NOT NULL,
    salary_range TEXT NOT NULL;
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Salaries (
    salary_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    effective_date DATE NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id);
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Projects (
    project_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id);
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Employee_Projects (
    employee_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    assignment_date DATE NOT NULL,
    PRIMARY KEY (employee_id, project_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (project_id) REFERENCES Projects(project_id);
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Attendance (
    attendance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'on_leave')),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id);
  )`);

  console.log("Base de données et tables créées avec succès.");
});

db.close((err) => {
  if (err) {
    console.error('Erreur lors de la fermeture de la base de données', err.message);
  } else {
    console.log('Connexion à la base de données fermée');
  }
});
