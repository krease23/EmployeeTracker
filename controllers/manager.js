const orm = require("../config/orm");
const inquirer = require("inquirer");
const cTable = require("console.table");

const manager = {
  allEmployees: reinit => {
    orm.find("employees", "is_manager", true, cb => {
      inquirer
        .prompt({
          type: "list",
          message: "Choose the manager from the list:",
          name: "manager",
          choices: () => {
            let mlist = cb.map(
              obj => `${obj.employeeid}: ${obj.first_name} ${obj.last_name}`
            );
            return mlist;
          }
        })
        .then(mgr => {
          const { manager } = mgr;
          const mgrArr = manager.split(":");
          orm.find("employees", "managerid", mgrArr[0], cb => {
            console.log(
              `=============== All Employees of${mgrArr[1]} ===========`
            );
            console.table(cb);
            reinit();
          });
        });
    });
  }
};

module.exports = manager;
