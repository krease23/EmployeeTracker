const orm = require("../config/orm");
const inquirer = require("inquirer");

const department = {
  getNew: reinit => {
    inquirer
      .prompt([
        {
          type: "input",
          message: "Department name:",
          name: "dept_name"
        }
      ])
      .then(answers => {
        const { dept_name } = answers;
        orm.create("departments", ["dept_name"], [dept_name], cb => {
          console.log(`=============== New Department Created ============`);
          reinit();
        });
      });
  },

  update: reinit => {
    orm.all(`departments`, cb => {
      inquirer
        .prompt({
          type: "list",
          message: "Which department would you like to update?",
          name: "selected",
          choices: () => {
            let slist = [];
            slist = cb.map(obj => `${obj.departmentid}: ${obj.dept_name}`);
            return slist;
          }
        })
        .then(answer => {
          const { selected } = answer;
          const updateArr = selected.split(":");
          const deptid = updateArr[0];
          inquirer
            .prompt({
              type: "input",
              message: `Enter new name for the ${updateArr[1]} department:`,
              name: "new_val"
            })
            .then(res => {
              const { new_val } = res;
              orm.update(
                "departments",
                `dept_name = "${new_val}"`,
                `departmentid = ${deptid}`,
                cb => {
                  console.log(
                    `=============== Department Name Updated ============`
                  );
                  reinit();
                }
              );
            });
        });
    });
  },

  remove: reinit => {
    //get all departments
    orm.all(`departments`, cb => {
      inquirer
        .prompt({
          type: "list",
          message: `Which department would you like to remove?`,
          name: "selected",
          choices: () => {
            let slist = [];
            slist = cb.map(obj => `${obj.departmentid}: ${obj.dept_name}`);
            return slist;
          }
        })
        .then(answer => {
          const { selected } = answer;
          selected.split(":");
          const delValue = selected[0];
          orm.delete(`departments`, `departmentid`, delValue, cb => {
            console.log(`=============== Department Deleted ============`);
            reinit();
          });
        });
    });
  },

  allEmployees: reinit => {
    orm.all(`departments`, cb => {
      inquirer
        .prompt({
          type: "list",
          message: `Which department's employees would you like to view?`,
          name: "selected",
          choices: () => {
            let slist = [];
            slist = cb.map(obj => `${obj.departmentid}: ${obj.dept_name}`);
            return slist;
          }
        })
        .then(answer => {
          const { selected } = answer;
          const deptArr = selected.split(":");
          //get all roles in the department
          orm.someWHERE("roles", ["roleid"], "departmentid", deptArr[0], cb => {
            const roleids = cb.map(val => {
              return val.roleid;
            });
            orm.findOR("employees", "roleid", roleids, cb => {
              console.log(
                `=============== All employees in ${deptArr[1]} ============`
              );
              console.table(cb);
              reinit();
            });
          });
        });
    });
  },

  allRoles: reinit => {
    orm.all(`departments`, cb => {
      inquirer
        .prompt({
          type: "list",
          message: `Which department's employees would you like to view?`,
          name: "selected",
          choices: () => {
            let slist = [];
            slist = cb.map(obj => `${obj.departmentid}: ${obj.dept_name}`);
            return slist;
          }
        })
        .then(answer => {
          const { selected } = answer;
          const deptArr = selected.split(":");

          orm.find("roles", "departmentid", deptArr[0], cb => {
            console.log(
              `=============== All roles in${deptArr[1]} ============`
            );
            console.table(cb);
            reinit();
          });
        });
    });
  },

  budget: reinit => {
    orm.all(`departments`, cb => {
      inquirer
        .prompt({
          type: "list",
          message: `Which department's budget would you like to view?`,
          name: "selected",
          choices: () => {
            let slist = [];
            slist = cb.map(obj => `${obj.departmentid}: ${obj.dept_name}`);
            return slist;
          }
        })
        .then(answer => {
          const { selected } = answer;
          const deptArr = selected.split(":");

          orm.salaries(deptArr[0], cb => {
            console.log(
              `Total budget for${deptArr[1]}: $${cb[0].total_salaries}`
            );
            reinit();
          });
        });
    });
  }
};

module.exports = department;
