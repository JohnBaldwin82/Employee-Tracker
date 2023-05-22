const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const questionPrompt = {
  viewEmployee: "View All Employees",
  viewDepartment: "View employees by department",
  viewSupervisor: "View Managers employees",
  addEmployee: "Add employee",
  removeEmployee: "Remove employee",
  updateJob: "Update role of employee",
  updateEmployeeSupervisor: "Update manager of employee",
  viewJobs: "View all roles",
  end: "Leave",
};

const connection = mysql.createConnection({
  host: "localhost",
  port: "3000",
  user: "root",
  password: "",
  database: "employeess_db",
});

connection.connect((err) => {
  if (err) throw err;
  prompt();
});

function prompt() {
  inquirer
    .prompt({
      name: "",
      type: "list",
      message: "Please make a selection",
      Choices: [
        questionPrompt.viewEmployee,
        questionPrompt.viewDepartment,
        questionPrompt.viewSupervisor,
        questionPrompt.addEmployee,
        questionPrompt.updateJob,
        questionPrompt.updateEmployeeSupervisor,
        questionPrompt.viewJobs,
        questionPrompt.end,
      ],
    })
    .then((answer) => {
      console.log("answer", answer);
      switch (answer.action) {
        case questionPrompt.viewEmployee:
          viewEmployee();
          break;

        case questionPrompt.viewDepartment:
          viewDepartment();
          break;

        case questionPrompt.viewSupervisor:
          viewSupervisor();
          break;

        case questionPrompt.addEmployee:
          addEmployee();
          break;

        case questionPrompt.updateJob:
          updateJob();
          break;

        case questionPrompt.updateEmployeeSupervisor:
          updateEmployeeSupervisor();
          break;

        case questionPrompt.viewJobs:
          viewJobs();
          break;

        case questionPrompt.end:
          end();
          break;
      }
    });
}

function viewEmployee() {
  let query = `SELECT employee.id, employee.first_name, employee.last_name, job.title, department.name AS department, job.salary, CONCAT(supervisor.first_name, '', supervisor.last_name) AS 
    supervisor FROM employee
    LEFT JOIHN employee supervisor on supervisor.id = employee.supervisor_id
    INNER JOIN job ON (job.id = employee.job_id)
    INNER JOIN department ON (department.id = job.department_id)
    GROUP BY employee.id;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.log('VIEW EMPLOYEES');
    console.log("\n");
    console.table(res);
    prompt();
  });
}

function viewDepartment() {
    let query = `SELECT department.name AS department, job.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN job ON (job.id = employee.job_id)
    LEFT JOIN department ON (department.id = job.department_id)
    GROUP BY department.name;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.log('VIEW DEPARTMENT');
        console.log("\n");
        console.table(res);
        prompt();
      });
}

function viewSupervisor() {
    let query = `SELECT CONCAT(supervisor.first_name, '', supervisor.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, job.title
    FROM employee
    LEFT JOIN employee supervisor ON supervisor.id = employee.supervisor.id
    LEFT JOIN job ON (job.id = employee.job_id && employee.supervisor_id != 'NULL')
    GROUP BY supervisor;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.log('VIEW SUPERVISOR');
        console.log("\n");
        console.table(res);
        prompt();
      });
}

function viewJobs() {
    let query = `SELECT job.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN job ON (job.id = employee.job_id)
    LEFT JOIN department ON (department.id - job.department_id)
    GROUP BY job.title;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("\n");
        console.log('VIEW SUPERVISOR');
        console.log("\n");
        console.table(res);
        prompt();
      });
}