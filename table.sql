CREATE TABLE Employees (
    employee_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NOT NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER NOT NULL,
    position_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id),
    FOREIGN KEY (position_id) REFERENCES Positions(position_id)
);

CREATE TABLE Departments (
    department_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    manager_id INTEGER NOT NULL,
    FOREIGN KEY (manager_id) REFERENCES Employees(employee_id)
);

CREATE TABLE Positions (
    position_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    position_name VARCHAR(100) NOT NULL,
    salary_range VARCHAR(50) NOT NULL
);

CREATE TABLE Salaries (
    salary_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    effective_date DATE NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
);

CREATE TABLE Projects (
    project_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

CREATE TABLE Employee_Projects (
    employee_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    assignment_date DATE NOT NULL,
    PRIMARY KEY (employee_id, project_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (project_id) REFERENCES Projects(project_id)
);

CREATE TABLE Attendance (
    attendance_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'on_leave')),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
);

INSERT INTO Departments (department_id, department_name, manager_id)
VALUES 
    (1, 'Développement Web', 1),
    (2, 'Design UI/UX', 2),
    (3, 'Marketing', 3),
    (4, 'Support Client', 4),
    (5, 'Ventes', 5),
    (6, 'Ressources Humaines', 6),
    (7, 'Finance', 7),
    (8, 'Logistique', 8),
    (9, 'Sécurité', 9),
    (10, 'Qualité', 10);

INSERT INTO Positions (position_id, position_name, salary_range)
VALUES 
    (1, 'Développeur Full Stack', '40000-60000'),
    (2, 'Designer UI/UX', '35000-55000'),
    (3, 'Chef de Projet', '50000-70000'),
    (4, 'Analyste de Données', '45000-65000'),
    (5, 'Développeur Frontend', '38000-58000'),
    (6, 'Développeur Backend', '40000-60000'),
    (7, 'Testeur QA', '35000-50000'),
    (8, 'Administrateur Système', '45000-65000'),
    (9, 'Ingénieur DevOps', '50000-70000'),
    (10, 'Architecte Logiciel', '60000-80000');

INSERT INTO Employees (employee_id, first_name, last_name, email, phone_number, hire_date, salary, department_id, position_id)
VALUES 
    (1, 'Alice', 'Dupont', 'alice.dupont@entreprise.com', '0600000001', '2022-05-10', 55000, 1, 1),
    (2, 'Bob', 'Martin', 'bob.martin@entreprise.com', '0600000002', '2021-08-15', 60000, 1, 1),
    (3, 'Claire', 'Durand', 'claire.durand@entreprise.com', '0600000003', '2020-03-20', 45000, 2, 2),
    (4, 'David', 'Lemoine', 'david.lemoine@entreprise.com', '0600000004', '2019-12-05', 70000, 3, 3),
    (5, 'Emma', 'Blanchard', 'emma.blanchard@entreprise.com', '0600000005', '2023-01-12', 48000, 1, 1),
    (6, 'François', 'Girard', 'francois.girard@entreprise.com', '0600000006', '2023-01-15', 52000, 2, 2),
    (7, 'Gérald', 'Roux', 'gerald.roux@entreprise.com', '0600000007', '2021-07-21', 63000, 3, 3),
    (8, 'Hélène', 'Robert', 'helene.robert@entreprise.com', '0600000008', '2020-11-08', 45000, 1, 1),
    (9, 'Isabelle', 'Moreau', 'isabelle.moreau@entreprise.com', '0600000009', '2019-09-14', 58000, 2, 2),
    (10, 'Jean', 'Simon', 'jean.simon@entreprise.com', '0600000010', '2018-06-01', 62000, 3, 3);

INSERT INTO Salaries (salary_id, employee_id, amount, effective_date)
VALUES 
    (1, 1, 55000, '2022-05-10'),
    (2, 2, 60000, '2021-08-15'),
    (3, 3, 45000, '2020-03-20'),
    (4, 4, 70000, '2019-12-05'),
    (5, 5, 48000, '2023-01-12'),
    (6, 6, 52000, '2023-01-15'),
    (7, 7, 63000, '2021-07-21'),
    (8, 8, 45000, '2020-11-08'),
    (9, 9, 58000, '2019-09-14'),
    (10, 10, 62000, '2018-06-01');

INSERT INTO Projects (project_id, project_name, start_date, end_date, department_id)
VALUES 
    (1, 'Développement d\'un Site E-commerce', '2023-01-15', '2023-06-15', 1),
    (2, 'Création d\'une Application Mobile', '2023-02-01', '2023-08-01', 1),
    (3, 'Refonte du Site Web d\'Entreprise', '2023-04-10', '2023-10-20', 2),
    (4, 'Campagne de Marketing Digital', '2023-03-05', '2023-05-30', 3),
    (5, 'Mise en Place d\'un CRM', '2023-01-20', '2023-04-10', 6),
    (6, 'Système de Gestion des Ressources Humaines', '2023-02-15', '2023-07-20', 6),
    (7, 'Développement d\'un Système de Support Client', '2023-03-01', '2023-09-01', 4),
    (8, 'Lancement d\'une Nouvelle Ligne de Produits', '2023-01-10', '2023-05-10', 5),
    (9, 'Audit de Sécurité des Systèmes', '2023-04-15', '2023-05-30', 9),
    (10, 'Développement d\'une Application de Gestion de Projets', '2023-01-05', '2023-03-15', 1);

-- Insertion des affectations d'employés aux projets
INSERT INTO Employee_Projects (employee_id, project_id, assignment_date)
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
    (10, 3, '2023-06-09');

INSERT INTO Attendance (attendance_id, employee_id, date, status)
VALUES 
    (1, 1, '2023-10-01', 'present'),
    (2, 2, '2023-10-01', 'absent'),
    (3, 3, '2023-10-01', 'present'),
    (4, 4, '2023-10-01', 'late'),
    (5, 5, '2023-10-01', 'on_leave'),
    (6, 6, '2023-10-01', 'present'),
    (7, 7, '2023-10-01', 'late'),
    (8, 8, '2023-10-01', 'present'),
    (9, 9, '2023-10-01', 'absent'),
    (10, 10, '2023-10-01', 'present');





