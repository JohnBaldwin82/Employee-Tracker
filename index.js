const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
require("dotenv").config();
const pool = mysql.createPool({host:'localhost', user: 'john', database: 'employees_db', password:'coding'});
const promisePool = pool.promise();
 


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
let employeeChoices = []
// function getEmployee(){
//   connection.promise().query('Select * from Employee', (err, res) => {
//     if (err) throw err;
//     console.log(res)
//     employeeChoices = res
//     return(res)
//   });
// }
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
  const employeeQuestions = [
    {
      type: 'input',
      name: 'first',
      message: 'What is the first name of your employee?'
    },
    {
      type: 'input',
      name: 'last',
      message: 'What is the last name of your employee?'
    },


  ]
  const addName = await inquirer.prompt(employeeQuestions);
  connection.query(
    "SELECT job.id, job.title FROM job GROUP BY job.id;",
    async (err, res) => {
      if (err) throw err;
      const { job } = await inquirer.prompt([
        {
          name: "job",
          type: "list",
          choices: () => res.map((res) => res.title),
          display: "What is the job title for the new employee?: ",
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
            choices: questions,
            display: "Choose the supervisor",
          },
        ]);
        let supervisorId;
        let supervisorFirstName;
        let supervisorLastName
        if (supervisor === "none") {
          supervisorId = null;
        } else {
          // console.log('here is res', res)
          for (const employee of res) {
            // console.log('here is employee', employee)
            const employeeFullName = `${employee.first_name} ${employee.last_name}`
            console.log(employeeFullName)
            // employee.fullName === supervisor`${employee.firstName} ${employee.last_name}`;
            if (employeeFullName === supervisor) {
              supervisorId = employee.id;
              supervisorFirstName = employee.first_name;
              supervisorLastName = employee.last_name
              console.log(supervisorId);
              console.log(supervisorFirstName);
              continue;
            }
          }
        }
        console.log("This has been completed.");
        connection.query(
         `INSERT INTO employee
         (first_name, last_name, job_id, supervisor_id)
         VALUES
         ('${addName.first}', '${addName.last}', ${jobId}, ${parseInt(supervisorId)})`,
          (err, res) => {
            if (err) throw err;
            prompt();
          }
        );
      });
    }
  );
}

// "INSERT INTO employee file ?",
// {
//   first_name: addName.first,
//   last_name: addName.last,
//   job_id: jobId,
//   supervisor_id: parseInt(supervisorId),
// }

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
//Query your database for the employee name and then grab the id number from the employee that was returned
async function whatId(employeeFullName) {
const firstName = employeeFullName.split(" ")[0]
  const [rows] = await promisePool.query(`SELECT * FROM employee WHERE first_name = '${firstName}'`)
  console.log('whatId', rows)
  return rows[0].id
}

async function updateJob() {
  
  const [rows,fields] = await promisePool.query("SELECT * from employee");
  console.log('employee choices log', rows)
  connection.query(
    "SELECT job.id, job.title FROM job GROUP BY job.id;",
    async (err, res) => {
      let choices = res.map((item) => item.title)
      let employeeList = rows.map((item) => `${item.first_name} ${item.last_name}`)
      console.log(' Heres choices ', choices)
      if (err) throw err;
      const { job, employee } = await inquirer.prompt([
        {
          name: "employee",
          type: "list",
          choices: employeeList,
          message: "Choose the employee you would like to update: ",
        },
        {
          name: "job",
          type: "list",
          choices: choices,
          display: "which new job for the employee?: ",
        },

      ]);
     
      const employeeId = await whatId(employee);
      let jobId;
      for (const line of res) {
        if (line.title === job) {
          jobId = line.id;
          continue;
        }
      }
      console.log('here is job id ', jobId)
      console.log('here is employeeId ', employeeId)
      console.log('here is employeeId.name ', employeeId[0].name)
      connection.query(
        `UPDATE employee
        SET job_id = ${jobId}
        WHERE employee.id = ${employeeId}`,
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
    inquirer.prompt({
      type: "input",
      message: "Which department would you like to add?",
      name: 'department'
    }).then(function(answer) {

      connection.query("INSERT INTO department (name) VALUES (?)", [answer.department], function(err, res) {
        if (err) throw err;
        console.table(res)
        prompt();
      })
    })
  }

// function addDepartment() {
//     let query = `INSERT INTO department (name) VALUES ("${}");`
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         console.log ("Succesfully added to database");
//         prompt();
//       });
// }


function end() {
  connection.end();
  process.exit()
}
