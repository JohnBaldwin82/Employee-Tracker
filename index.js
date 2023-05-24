const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
require("dotenv").config();

const questionPrompt = {
  viewEmployee: "View All Employees",
  viewDepartment: "View all departments",
  viewSupervisor: "View Managers employees",
  addEmployee: "Add employee",
  removeEmployee: "Remove employee",
  updateJob: "Update role of employee",
  updateEmployeeSupervisor: "Update manager of employee",
  viewJobs: "View all roles",
  addDepartment: "Add Department",
  end: "Leave",
};

const connection = mysql.createConnection({
  host: "127.0.0.1",

  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "employees_db",
});

connection.connect((err) => {
  if (err) throw err;
  prompt();
});

function prompt() {
  inquirer
    .prompt([
      {
        name: "questions",
        type: "list",
        display: "Please make a selection",
        choices: [
          questionPrompt.viewEmployee,
          questionPrompt.viewDepartment,
          questionPrompt.viewSupervisor,
          questionPrompt.addEmployee,
          questionPrompt.updateJob,
          questionPrompt.updateEmployeeSupervisor,
          questionPrompt.viewJobs,
          questionPrompt.addDepartment,
          questionPrompt.end,
        ],
      },
    ])
    .then((answer) => {
      console.log("answer", answer);
      switch (answer.questions) {
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

          case questionPrompt.addDepartment:
          addDepartment();
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
    LEFT JOIN employee supervisor on supervisor.id = employee.supervisor_id
    INNER JOIN job ON (job.id = employee.job_id)
    INNER JOIN department ON (department.id = job.department_id)
    GROUP BY employee.id;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.log("VIEW EMPLOYEES");
    console.log("\n");
    console.table(res);
    prompt();
  });
}

function viewDepartment() {
  let query = `SELECT * FROM department;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    prompt();
  });
}

function viewSupervisor() {
  let query = `SELECT CONCAT(supervisor.first_name, '', supervisor.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, job.title
    FROM employee
    LEFT JOIN employee supervisor on supervisor.id = employee.supervisor.id
    LEFT JOIN job ON (job.id = employee.job_id && employee.supervisor_id != 'NULL')
    GROUP BY supervisor;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.log("VIEW SUPERVISOR");
    console.log("\n");
    console.table(res);
    prompt();
  });
}

function viewJobs() {
  let query = `SELECT job.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN job ON (job.id = employee.job_id)
    LEFT JOIN department ON (department.id = job.department_id);`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log("\n");
    console.log("VIEW SUPERVISOR");
    console.log("\n");
    console.table(res);
    prompt();
  });
}

async function addEmployee() {
  const addName = await inquirer.prompt(addName());
  connection.query(
    "SELECT job.id, job.title FROM job GROUP BY job.id;",
    async (err, res) => {
      if (err) throw err;
      const { job } = await inquirer.prompt([
        {
          name: "job",
          type: "list",
          questions: () => res.map((res) => res.title),
          display: "What job are you looking for?: ",
        },
      ]);
      let jobId;
      for (const line of res) {
        if (line.title === job) {
          jobId = line.id;
          continue;
        }
      }

      connection.query("SELECT * FROM employee", async (err, res) => {
        if (err) throw err;
        let questions = res.map((res) => `${res.first_name} ${res.last_name}`);
        questions.push("none");
        let { supervisor } = await inquirer.prompt([
          {
            name: "supervisor",
            type: "list",
            questions: questions,
            display: "Choose the supervisor",
          },
        ]);
        let supervisorId;
        let supervisorName;
        if (supervisor === "none") {
          supervisorId = null;
        } else {
          for (const info of res) {
            info.fullName === supervisor`${info.firstName} ${info.last_name}`;
            if (info.fullName === supervisor) {
              supervisorId = info.id;
              supervisorName = info.fullName;
              console.log(supervisorId);
              console.log(supervisorName);
              continue;
            }
          }
        }
        console.log("This has been completed.");
        connection.query(
          "INSERT INTO employee file ?",
          {
            first_name: addName.first,
            last_name: addName.last,
            job_id: jobId,
            supervisor_id: parseInt(supervisorId),
          },
          (err, res) => {
            if (err) throw err;
            prompt();
          }
        );
      });
    }
  );
}

function remove(data) {
  const promptMe = {
    yes: "yes",
    no: "no(go to view employees)",
  };
  inquirer
    .prompt([
      {
        name: "action",
        type: "list",
        display:
          "To remove an employee please enter an ID. View Employee to receive this" +
          "do you have the employee ID?",
        choices: [promptMe.yes, promptMe.no],
      },
    ])
    .then((result) => {
      if (data === "delete" && result.action === "yes") removeEmployee();
      else if (data === "job" && result.action === "yes") updateJob();
      else viewEmployee();
    });
}

async function removeEmployee() {
  const result = await inquirer.prompt([
    {
      name: "first",
      type: "list",
      display: "Which Employee ID needs to be removed: ",
    },
  ]);

  connection.query(
    "DELETE FROM employee WHERE?",
    {
      id: answer.first,
    },
    function (err) {
      if (err) throw err;
    }
  );
  console.log("Employee has been removed");
}

function whatId() {
  return [
    {
      name: "name",
      type: "input",
      display: "Which employee ID?: ",
    },
  ];
}

async function updateJob() {
  const employeeId = await whichId();

  connection.query(
    "SELECT job.id, job.title FROM job GROUP BY job.id;",
    async (err, res) => {
      if (err) throw err;
      const { job } = await inquirer.prompt([
        {
          name: "job",
          type: "list",
          choices: () => res.map(res.title),
          display: "which new job for the employee?: ",
        },
      ]);
      let jobId;
      for (const line of res) {
        if (line.title === job) {
          jobId = line.id;
          continue;
        }
      }
      connection.query(
        `UPDATE employee
        SET job_id = ${jobId}
        WHERE employee.id = ${employeeId.name}`,
        async (err, res) => {
          if (err) throw err;
          console.log("this has been completed");
          prompt();
        }
      );
    }
  );
}

function addDepartment() {
    let query = `INSERT INTO department (name) VALUES ("${}");`
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log ("Succesfully added to database");
        prompt();
      });
}

function whichName() {
  return [
    {
      name: "first",
      type: "input",
      display: "What is the first name:",
    },
    {
      name: "last",
      type: "inoput",
      display: "what is the last name:",
    },
  ];
}
