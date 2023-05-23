DROP DATABASE IF EXISTS employees_db
CREATE DATABASE employees_db
USE employees_db;
CREATE TABLE department (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45) UNIQUE NOT NULL
);

CREATE TABLE job (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(45) UNIQUE NOT NULL,
    salary DECIMAL UNSIGNED NOT NULL,
    department_id INT UNSIGNED NOT NULL,

)

CREATE TABLE employee (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    job_id VARCHAR(45) NOT NULL,
    supervisor_id INT UNSIGNED NOT NULL
)

use employees_db;
INSERT INTO department
    (name)

VALUES
    ('Executive'),
    ('Compliance'),
    ('Processing'),
    ('Underwriting');
    INSERT INTO job
    (title, salary, department_id)
    VALUES
    ('Vice President', 250000, 1)
    ('VP Assistant', 75000, 1)
    ('Underwriter Lead', 150000, 2)
    ('Underwriter', 100000, 2)
    ('Processing, Manager' 150000, 3)
    ('Processor', 95000, 3)
    ('Compliance Lead', 120000, 4)
    ('Compliance Analyst', 75000, 4);
    INSERT INTO employee
    (first_name, last_name, job_id, supervisor_id)
    VALUES
    ('Jerry', 'Jones' 1, NULL),
    ('Jimmy', 'Johnson', 2, 1),
    ('Troy', 'Aikman', 3, NULL),
    ('Danny', 'White', 4, 3),
    ('Tony', 'Romo' 5, Null),
    ('Dak', 'Prescott', 6, 5),
    ('Drew', 'Bledsoe', 7, NULL),
    ('Emmit', 'Smith', 8,7);


