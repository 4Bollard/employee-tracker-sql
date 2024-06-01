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

function mainMenu(){
inquirer
    .prompt([
        // {
        //     type: "input",
        //     message: "What department would you like to log?",
        //     name: "text",
        // },
        {
            type: "list",
            message: "What do you want to do?",
            name: "userChoice",
            choices: ["View Department", "Add Department", ],
        }
    ])
    .then((response) => {
        console.log(response)
        if(response.userChoice === "View Department"){
            viewDepartment()
        }
        if(response.userChoice === "Add Department"){
            addDepartment()
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
            console.log("You done messed up")
        } else {
            console.log("Department added succesfully!")
            mainMenu()
        }
    });
})
}

// addDepartment()
mainMenu()