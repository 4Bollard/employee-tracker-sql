const { Pool } = require('pg');
const inquirer = require('inquirer');
const pool = new Pool(
    {
        user: 'postgres',
        password: 'fitzmydog',
        host: 'localhost',
        database: 'employee_db'
    },
    console.log(`Connected to the employee database.`)
)

pool.connect();

function mainMenu() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What do you want to do?",
                name: "userChoice",
                choices: ["View Department", "Add Department", "View Role", "Add Role", "View Employee", "Add Employee",],
            }
        ])
        .then((response) => {
            console.log(response)
            if (response.userChoice === "View Department") {
                viewDepartment()
            }
            if (response.userChoice === "Add Department") {
                addDepartment()
            }
            if (response.userChoice === "View Role") {
                viewRole()
            }
            if (response.userChoice === "Add Role") {
                addRole()
            }
            if (response.userChoice === "Add Employee") {
                addEmployee()
            }
            if (response.userChoice === "View Employee") {
                viewEmployee()
            }
            if (response.userChoice === "Update Employee Role") {
                updateEmployeeRole()
            }
        })

};



function viewDepartment() {
    const sql = `SELECT * FROM department`;

    pool.query(sql, (err, { rows }) => {
        console.table(rows)
        mainMenu()

    });
}

function viewRole() {
    const sql = `SELECT * FROM role`;

    pool.query(sql, (err, { rows }) => {
        console.table(rows)
        mainMenu()
    });
}

function viewEmployee() {
    const sql = `SELECT * FROM employee`;

    pool.query(sql, (err, { rows }) => {
        console.table(rows)
        mainMenu()
    });
}
// viewDepartment()


function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What department would you like to add?",
                name: "newDepartment",
            },

        ])
        .then((response) => {
            console.log(response)

            const sql = `INSERT INTO department (name) VALUES ($1)`;
            const userImput = [response.newDepartment]
            pool.query(sql, userImput, (err, rows) => {
                if (err) {
                    console.log("You done messed up1")
                } else {
                    console.log("Department added succesfully!")
                    mainMenu()
                }
            });
        })
}

function addRole() {
    const sql = `SELECT * FROM department`;

    const departments = [];

    pool.query(sql, (err, { rows }) => {
        // console.log(rows) 
        for (let i = 0; i < rows.length; i++) {
            departments.push({ name: rows[i].name, value: rows[i].id })
        }

        // console.log(departments)
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "What Role do you want to add?",
                    name: "roleTitle"
                },
                {
                    type: "input",
                    message: "What is the salary?",
                    name: "roleSalary"
                },
                {
                    type: "list",
                    message: "What do you want to do?",
                    name: "roleDepartment",
                    choices: departments
                }
            ])
            .then((response) => {
                console.log(response)

                const sql = `INSERT INTO role (title, salary, department_id) VALUES ($1,$2,$3)`;
                const userImput = [response.roleTitle, response.roleSalary, response.roleDepartment]
                pool.query(sql, userImput, (err, rows) => {
                    if (err) {
                        console.log("You done messed up2", err)
                    } else {
                        console.log("Department added succesfully!")
                        mainMenu()
                    }
                });
            })
    }
    )
};



function addEmployee() {
    const sql1 = `SELECT * FROM role`;
    const sql2 = `SELECT * FROM employee`;
    const role = [];
    const employee = [];

    pool.query(sql1, (err, { rows }) => {
        // console.log(rows) 
        for (let i = 0; i < rows.length; i++) {
            role.push({ name: rows[i].title, value: rows[i].id })
        }
    });

    pool.query(sql2, (err, { rows }) => {
        // console.log(rows) 
        for (let i = 0; i < rows.length; i++) {
            employee.push({ name: rows[i].last_name, value: rows[i].id })
        }
    });
    // console.log(departments)
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "employeeFName"
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "employeeLName"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                name: "employeeRole",
                choices: role
            },
            {
                type: "list",
                message: "Who is the employee's manager",
                name: "employeeManager",
                choices: employee
            }
        ])
        .then((response) => {
            console.log(response)

            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1,$2,$3,$4)`;
            const userImput = [response.employeeFName, response.employeeLName, response.employeeRole, response.employeeManager]
            pool.query(sql, userImput, (err, rows) => {
                if (err) {
                    console.log("You done messed up3")
                } else {
                    console.log("Department added succesfully!")
                    mainMenu()
                }
            });
        })
}

// async function updateEmployeeRole() {
//     const sql1 = `SELECT * FROM role`;
//     const sql2 = `SELECT * FROM employee`;
//     const role = [];
//     const employee = [];
//     console.log(employee )
//     pool.query(sql1, (err, { rows }) => {
//         // console.log(rows) 
//         for (let i = 0; i < rows.length; i++) {
//             role.push({ name: rows[i].title, value: rows[i].id })
//         }
//     });

//     pool.query(sql2, (err, { rows }) => {
//         // console.log(rows) 
//         for (let i = 0; i < rows.length; i++) {
//             employee.push({ name: rows[i].last_name, value: rows[i].id })
//         }
//     });
//     // console.log(departments)
//     inquirer
//         .prompt([
//             {
//                 type: "list",
//                 message: "Who is the employee?",
//                 name: "employeeManager",
//                 choices: employee
//             },
//             {
//                 type: "list",
//                 message: "What is the employee's role?",
//                 name: "employeeRole",
//                 choices: role
//             }
//         ])
//         .then((response) => {
//             console.log(response)

//             const sql = `UPDATE employee SET role_id = ${response.employeeRole} WHERE id = ${response.employeeManager.id}`;
//             const userImput = [ response.employeeRole, response.employeeManager]
//             pool.query(sql, userImput, (err, rows) => {
//                 if (err) {
//                     console.log("You done messed up3")
//                 } else {
//                     console.log("Department added succesfully!")
//                     mainMenu()
//                 }
//             });
//         })
// }; 
// addDepartment()
mainMenu()
// UPDATE table_name
// SET column1 = value1, column2 = value2, ...
// WHERE condition;


// todo, update function