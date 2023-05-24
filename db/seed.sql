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
    ('Vice President', 250000, 1),
    ('VP Assistant', 75000, 1),
    ('Underwriter Lead', 150000, 2),
    ('Underwriter', 100000, 2),
    ('Processing Manager', 150000, 3),
    ('Processor', 95000, 3),
    ('Compliance Lead', 120000, 4),
    ('Compliance Analyst', 75000, 4);
INSERT INTO employee
    (first_name, last_name, job_id, supervisor_id)
    VALUES
    ('Jerry', 'Jones', 1, NULL),
    ('Jimmy', 'Johnson', 2, 1),
    ('Troy', 'Aikman', 3, NULL),
    ('Danny', 'White', 4, 3),
    ('Tony', 'Romo', 5, Null),
    ('Dak', 'Prescott', 6, 5),
    ('Drew', 'Bledsoe', 7, NULL),
    ('Emmit', 'Smith', 8, 7);


