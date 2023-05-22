const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

const connection = mysql.createConnection( {
    host: 'localhost',
    port: '3000',
    user: 'root',
    password: '',
    database: 'employeess_db'
});

const messagePrompt = {
    viewEmployees: 'View All Employees'
}

