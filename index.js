const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const questionPrompt = {
  viewEmployees: "View All Employees",
  viewDepartment: "View employees by department",
  viewManager: "View Managers employees",
  addEmployee: "Add employee",
  removeEmployee: "Remove employee",
  updateRole: "Update role of employee",
  updateEmployeeManager: "Update manager of employee",
  viewRoles: "View all roles",
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
        questionPrompt.viewEmployees,
        questionPrompt.viewDepartment,
        questionPrompt.viewManager,
        questionPrompt.addEmployee,
        questionPrompt.updateRole,
        questionPrompt.updateEmployeeManager,
        questionPrompt.viewRoles,
        questionPrompt.end,
      ],
    })
    .then((answer) => {
      console.log("answer", answer);
      switch (answer.action) {
        case questionPrompt.viewEmployees:
          viewEmployees();
          break;

        case questionPrompt.viewDepartment:
          viewDepartment();
          break;

        case questionPrompt.viewManager:
          viewDepartment();
          break;

        case questionPrompt.addEmployee:
          viewDepartment();
          break;

        case questionPrompt.updateRole:
          viewDepartment();
          break;

        case questionPrompt.updateEmployeeManager:
          viewDepartment();
          break;

        case questionPrompt.viewRoles:
          viewDepartment();
          break;

          case questionPrompt.end:
            viewDepartment();
            break;
      }
    });
}
