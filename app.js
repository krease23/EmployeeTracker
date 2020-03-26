const cTable = require("console.table");
const inquirer = require("inquirer");
const joi = require("@hapi/joi");
const orm = require("./config/orm");
const employee = require("./controllers/employee");
const role = require("./controllers/role");
const manager = require("./controllers/manager");
const department = require("./controllers/department");

function init() {
  inquirer
    .prompt({
      type: "list",
      message: "Which action would you like to perform?",
      name: "action",
      choices: ["View", "Add", "Update", "Remove", "Exit"],
      validate: validateArr
    })
    .then(data => {
      const { action } = data;
      if (action === "View") {
        getView();
      } else if (
        action === "Add" ||
        action === "Update" ||
        action === "Remove"
      ) {
        inquirer
          .prompt({
            type: "list",
            message: `What would you like to ${action.toLowerCase()}?`,
            name: "option",
            choices: ["Employee", "Role", "Department"],
            validate: validateArr
          })
          .then(data => {
            const { option } = data;
            if (action === "Add") {
              if (option === "Employee") {
                employee.getNew(cb => init());
              } else if (option === "Role") {
                role.getNew(cb => init());
              } else if (option === "Department") {
                department.getNew(cb => init());
              }
            } else if (action === "Update") {
              if (option === "Employee") {
                employee.update(cb => init());
              } else if (option === "Role") {
                role.update(cb => init());
              } else if (option === "Department") {
                department.update(cb => init());
              }
            } else if (action === "Remove") {
              if (option === "Employee") {
                employee.remove(cb => init());
              } else if (option === "Role") {
                role.remove(cb => init());
              } else if (option === "Department") {
                department.remove(cb => init());
              }
            }
          });
      } else if (action === "Exit") {
        process.exit();
      }
    });
}

function getView() {
  const viewChoices = [
    "All employees",
    "Employee details",
    "Employees by department",
    "Employees by role",
    "Employees by manager",
    "All roles",
    "Roles by department",
    "All departments",
    "Total budget for a department"
  ];
  inquirer
    .prompt({
      type: "list",
      message: "Which list would you like to view?",
      name: "viewOption",
      choices: viewChoices,
      validate: validateArr
    })
    .then(answer => {
      const { viewOption } = answer;
      const viewArr = viewOption.split(" ");
      if (viewArr[0] === "All") {
        orm.all(viewArr[1], cb => {
          console.log(
            `================= All ${viewArr[1]}s ==================`
          );
          console.table(cb);
          init();
        });
      } else if (viewArr[1] === "details") {
        employee.details(cb => init());
      } else if (viewArr[0] === "Employees") {
        if (viewArr[2] === "department") {
          department.allEmployees(cb => init());
        } else if (viewArr[2] === "role") {
          role.allEmployees(cb => init());
        } else if (viewArr[2] === "manager") {
          manager.allEmployees(cb => init());
        }
      } else if (viewArr[0] === "Roles") {
        department.allRoles(cb => init());
      } else if (viewArr[0] === "Total") {
        department.budget(cb => init());
      }
    });
}

function onValidation(err, val) {
  if (err) {
    console.log(err.message);
    valid = err.message;
  } else {
    valid = true;
  }

  return valid;
}

function validateArr(ops) {
  return joi.validate(ops, joi.array().min(1), onValidation);
}

init();
