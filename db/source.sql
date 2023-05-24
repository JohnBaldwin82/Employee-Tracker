
SELECT job.id, job.title, job.salary FROM job GROUP BY job.id;
SELECT job.id, job.title FROM job GROUP BY job.id;
SELECT * FROM employees_db;

SELECT department.id, department.name FROM department GROUP BY department.id;

SELECT department.name AS department, job.title, employee.id, employee.first_name, employee.last_name
    FROM employees_db
    LEFT JOIN job ON (job.id = employee.job.id)
    LEFT JOIN department ON (department.id = job.department_id)
    GROUP BY department.name;

    SELECT CONCAT(supervisor.first_name, '', supervisor.last_name) AS supervisor, department.name AS department, employee.id, employee.first_name, employee.last_name, job.title
    FROM employees_db
    LEFT JOIN employee supervisor, on supervisor.id = employee.supervisor_id
    INNER JOIN job ON (job.id = employee.job_id && employee.supervisor.id != 'NULL')
    INNER JOIN department ON (department.id = job.department_id)
    GROUP BY supervisor;

    SELECT job.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employees_db
    LEFT JOIN job ON (job.id = employee.job_id)
    LEFT JOIN department ON (department.id = job.department_id)
    GROUP BY job.title;

     SELECT employee.id, smployee.first_name, employee.last_name, job.title, department.name AS department, job.salary, CONCAT(supervisor.first_name, '', supervisor.last_name) AS supervisor
     FROM employees_db
     LEFT JOIN employee supervisor on supervisor.id = employee.supervisor_id
     INNER JOIN job ON (job_id = employee.job_id)
     INNER JOIN department ON (department.id = job.department_id)
     GROUP BY employee.id;

     SELECT first_name, last_name, job_id FROM employees_db WHERE employee.id = 4;
