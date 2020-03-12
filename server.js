const mysql = require("mysql");
const inquirer = require("inquirer");
//const consoleTable = require("console.table");

// Connection to MySql Database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "emptracker_db"
});

connection.connect(function(err){
    if (err) throw err;
    employees();
});

function employees() {
    inquirer.prompt ({
        name: "launch",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all employees",
            "View departments",
            "View roles",
            "Add an employee",
            "Add department",
            "Add role",
            "Update Employee Role",
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
            case "Add role":
                addRole();
                break;
            case "Update Employee Role":
                updateEmpRole();
                break;
            case "Exit.":
                endEmployees();
                break;
            default:
                break;
        }
    })
};

function viewEmployees() {
    let query = "SELECT * FROM employee";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(query);
        console.table(res);
        employees();
    })
}

function viewDepartments() {
    let query = "SELECT * FROM department";
    connection.query(query, function(err, res) {
        if(err)throw err;
        console.log(query)
        console.table(res);
        employees();
    })
}

function viewRoles() {
    let query = "SELECT * FROM role";
    connection.query(query, function(err, res){
        if (err) throw err;
        console.log(query)
        console.table(res);
        employees();
    })
}

function addEmployee() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                message: "Employee's first name: ",
            },
            {
                name: "last_name",
                type: "input",
                message: "Employee's last name: "
            },
            {
                name: "role",
                type: "list",
                choices: function() {
                    let roleList = [];
                    for (let i = 0; i < res.length; i++) {
                        roleList.push(res[i].title);
                    }
                    return roleList;
                },
                message: "What's the new employee's role? "
            }
        ]).then(function (answer) {
            let roleID;
            for (let x = 0; x < res.length; x++) {
                if (res[x].title == answer.role) {
                    roleID = res[x].id;
                    console.log(roleID)
                }
            }
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: roleID,
                },
                function (err) {
                    if (err) throw err;
                    console.log("Congrats! The new employee has been added.");
                    addEmployee();
                    employees();
                }
            )
        })
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            name: "new_department",
            type: "input",
            message: "What is the new department called?"
        }
    ]).then(function (answer) {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: answer.new_department
            }
        );
        let query = "SELECT * FROM department";
        connection.query(query, function(err, res) {
            if(err)throw err;
            console.log(query);
            console.table(res);
            employees();
        })
    })
}

function addRole() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "new_role",
                type: "input",
                message: "What is the new role?"
            },
            {
                name: "salary",
                type: "input",
                message: "Enter a salary amount for this role."
            },
            {
                name: "departmentChoice",
                type: "rawlist",
                message: "Choose a department.",
                choices: function() {
                    let deptList = [];
                    for (let i = 0; i < res.length; i++) {
                        deptList.push(res[i].name);
                    }
                    return deptList;
                },
            }
        ]).then(function (answer) {
            let deptID;
            for (let x = 0; x < res.length; x++) {
                if (res[x].name == answer.departmentChoice) {
                    deptID = res[x].id;
                }
            }

            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: deptID
                },
                function (err, res) {
                    if(err)throw err;
                    console.log("Success! The new role has been added.");
                    employees();
                }
            )
        })
    })
}

function updateEmpRole() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "update_role",
                type: "list",
                message: "Which employee's role is changing?",
                choices: function() {
                    let employeeList = [];
                        res.forEach(result => {
                            employeeList.push(result.last_name);
                        })
                        return employeeList;
                }
            }
        ]).then(function(answer) {
            console.log(answer);
            let name = answer.update_role;
            },
        
            connection.query("SELECT * FROM role", function(err, res) {
                    inquirer.prompt([
                        {
                            name: "role",
                            type: "list",
                            message: "What is their new role?",
                            choices: function() {
                                roleList = [];
                                res.forEach(res => {
                                    roleList.push(res.title)
                                })
                                return roleList;
                            }
                        }
                    ]).then(function(newRole) {
                        const role = newRole.role;
                        console.log(newRole.role);
                    connection.query("SELECT FROM role WHERE title = ?", [role], function(err, res) {
                        if (err) throw err;
                        let roleID = res [0].id;
                        let query = "UPDATE employee SET role_id ? WHERE last_name ?";
                        let values = [roleID, name]
                        console.log(values);
                        connection.query(query, values, function(err, res, fields) {
                            console.log("You have updated ${name}'s role to ${role}.")
                        })
                        employees();
                    }
                )
            })
            }))
    })
}

function endEmployees() {
    connection.end();
}