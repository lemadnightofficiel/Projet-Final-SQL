CREATE TABLE Employees (
    employee_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    hire_date DATE NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER,
    position_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id),
    FOREIGN KEY (position_id) REFERENCES Positions(position_id)
);

CREATE TABLE Departments (
    department_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (manager_id) REFERENCES Employees(employee_id)
);

CREATE TABLE Positions (
    position_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    position_name VARCHAR(100) NOT NULL,
    salary_range VARCHAR(50)
);

CREATE TABLE Salaries (
    salary_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    employee_id INTEGER,
    amount DECIMAL(10, 2) NOT NULL,
    effective_date DATE NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
);


CREATE TABLE Projects (
    project_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

CREATE TABLE Employee_Projects (
    employee_id INTEGER,
    project_id INTEGER,
    assignment_date DATE NOT NULL,
    PRIMARY KEY (employee_id, project_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (project_id) REFERENCES Projects(project_id)
);

CREATE TABLE Attendance (
    attendance_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    employee_id INTEGER,
    date DATE NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'on_leave')),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
);


    