const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bdd.db');

function createDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS Departments (
        department_id INTEGER PRIMARY KEY AUTOINCREMENT,
        department_name TEXT NOT NULL,
        manager_id INTEGER
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Posts (
        post_id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_name TEXT NOT NULL,
        salary_range TEXT NOT NULL
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Employees (
        employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone_number TEXT NOT NULL,
        hire_date DATE NOT NULL,
        salary DECIMAL(10, 2) NOT NULL,
        department_id INTEGER,
        position_id INTEGER,
        FOREIGN KEY (department_id) REFERENCES Departments(department_id),
        FOREIGN KEY (position_id) REFERENCES Positions(position_id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Salaries (
        salary_id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        effective_date DATE NOT NULL,
        FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Projects (
        project_id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_name TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        department_id INTEGER,
        FOREIGN KEY (department_id) REFERENCES Departments(department_id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Employee_Projects (
        employee_id INTEGER NOT NULL,
        project_id INTEGER NOT NULL,
        assignment_date DATE NOT NULL,
        PRIMARY KEY (employee_id, project_id),
        FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
        FOREIGN KEY (project_id) REFERENCES Projects(project_id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS Attendance (
        attendance_id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        date DATE NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'on_leave')),
        FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
      )`);

      console.log("Base de données et tables créées avec succès.");
      resolve();
    });
  });
}

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`INSERT INTO Departments (department_name, manager_id) VALUES 
        ('Développement Web', 1),
        ('Design UI/UX', 2),
        ('Marketing', 3),
        ('Support Client', 4),
        ('Ventes', 5),
        ('Ressources Humaines', 6),
        ('Finance', 7),
        ('Logistique', 8),
        ('Sécurité', 9),
        ('Qualité', 10)`);

      db.run(`INSERT INTO Posts (post_name, salary_range) VALUES 
        ('Développeur Full Stack', '40000-60000'),
        ('Designer UI/UX', '35000-55000'),
        ('Chef de Projet', '50000-70000'),
        ('Analyste de Données', '45000-65000'),
        ('Développeur Frontend', '38000-58000'),
        ('Développeur Backend', '40000-60000'),
        ('Testeur QA', '35000-50000'),
        ('Administrateur Système', '45000-65000'),
        ('Ingénieur DevOps', '50000-70000'),
        ('Architecte Logiciel', '60000-80000')`);

      db.run(`INSERT INTO Employees (first_name, last_name, email, phone_number, hire_date, salary, department_id, position_id)
      VALUES 
        ('Alice', 'Dupont', 'alice.dupont@entreprise.com', '0600000001', '2022-05-10', 55000, 1, 1),
        ('Bob', 'Martin', 'bob.martin@entreprise.com', '0600000002', '2021-08-15', 60000, 1, 1),
        ('Claire', 'Durand', 'claire.durand@entreprise.com', '0600000003', '2020-03-20', 45000, 2, 2),
        ('David', 'Lemoine', 'david.lemoine@entreprise.com', '0600000004', '2019-12-05', 70000, 3, 3),
        ('Emma', 'Blanchard', 'emma.blanchard@entreprise.com', '0600000005', '2023-01-12', 48000, 1, 1),
        ('François', 'Girard', 'francois.girard@entreprise.com', '0600000006', '2023-01-15', 52000, 2, 2),
        ('Gérald', 'Roux', 'gerald.roux@entreprise.com', '0600000007', '2021-07-21', 63000, 3, 3),
        ('Hélène', 'Robert', 'helene.robert@entreprise.com', '0600000008', '2020-11-08', 45000, 1, 1),
        ('Isabelle', 'Moreau', 'isabelle.moreau@entreprise.com', '0600000009', '2019-09-14', 58000, 2, 2),
        ('Jean', 'Simon', 'jean.simon@entreprise.com', '0600000010', '2018-06-01', 62000, 3, 3)`);

      db.run(`INSERT INTO Salaries (employee_id, amount, effective_date)
      VALUES 
        (1, 55000, '2022-05-10'),
        (2, 60000, '2021-08-15'),
        (3, 45000, '2020-03-20'),
        (4, 70000, '2019-12-05'),
        (5, 48000, '2023-01-12'),
        (6, 52000, '2023-01-15'),
        (7, 63000, '2021-07-21'),
        (8, 45000, '2020-11-08'),
        (9, 58000, '2019-09-14'),
        (10, 62000, '2018-06-01')`);

      db.run(`INSERT INTO Projects (project_name, start_date, end_date, department_id)
      VALUES 
        ('Développement d un Site E-commerce', '2023-01-15', '2023-06-15', 1),
        ('Création d une Application Mobile', '2023-02-01', '2023-08-01', 1),
        ('Refonte du Site Web d Entreprise', '2023-04-10', '2023-10-20', 2),
        ('Campagne de Marketing Digital', '2023-03-05', '2023-05-30', 3),
        ('Mise en Place d un CRM', '2023-01-20', '2023-04-10', 6),
        ('Système de Gestion des Ressources Humaines', '2023-02-15', '2023-07-20', 6),
        ('Développement d un Système de Support Client', '2023-03-01', '2023-09-01', 4),
        ('Lancement d une Nouvelle Ligne de Produits', '2023-01-10', '2023-05-10', 5),
        ('Audit de Sécurité des Systèmes', '2023-04-15', '2023-05-30', 9),
        ('Développement d une Application de Gestion de Projets', '2023-01-05', '2023-03-15', 1)`);

      db.run(`INSERT INTO Employee_Projects (employee_id, project_id, assignment_date)
      VALUES 
        (1, 1, '2023-01-15'),
        (2, 1, '2023-01-20'),
        (3, 2, '2023-02-01'),
        (4, 3, '2023-03-10'),
        (5, 1, '2023-05-12'),
        (6, 2, '2023-06-18'),
        (7, 3, '2023-07-10'),
        (8, 1, '2023-02-14'),
        (9, 2, '2023-04-22'),
        (10, 3, '2023-06-09')`);

      db.run(`INSERT INTO Attendance (employee_id, date, status)
      VALUES 
        (1, '2023-10-01', 'present'),
        (2, '2023-10-01', 'absent'),
        (3, '2023-10-01', 'present'),
        (4, '2023-10-01', 'late'),
        (5, '2023-10-01', 'on_leave'),
        (6, '2023-10-01', 'present'),
        (7, '2023-10-01', 'late'),
        (8, '2023-10-01', 'present'),
        (9, '2023-10-01', 'absent'),
        (10, '2023-10-01', 'present')`);

      console.log("Données initiales insérées avec succès.");
      resolve();
    });
  });
}

module.exports = { createDatabase, db, initializeDatabase };
