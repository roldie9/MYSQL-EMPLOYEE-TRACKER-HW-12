const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

// Connection to MySql Database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "emptracker.db"
});

connection.connect(function(err){
    if (err) throw err;
    employees();
});

function employees() {
    inquirer.prompt ({
        name: "launch",
        type: "list",
        message: "Welcome to the employee database. What are you trying to do?",
        choices: [
            "View all employees",
            "View departments",
            "View roles",
            "Add an employee",
            "Add department",
            "Add a role",
            "Exit."
        ]
    }).then(function(answer) {
        switch (answer.launch) {
            case "View all employees":
                viewEmployees();
                break;
            case "View departments":
                viewDepartments();
                break;
            case "View roles":
                viewRoles();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Add department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Exit.":
                endEmployees();
                break;
            default:
                break;
        }
    })
}



function endEmployees() {
    connection.end();
}