const orm = require("../config/orm");
const inquirer = require("inquirer");

const employee = {
  getNew: reinit => {
    orm.some("roles", ["roleid", "title"], cb => {
      inquirer
        .prompt([
          {
            type: "input",
            message: "Employee first name:",
            name: "first_name"
          },
          {
            type: "input",
            message: "Employee last name:",
            name: "last_name"
          },
          {
            type: "confirm",
            message: "Is this employee a manager?",
            name: "is_manager"
          },
          {
            type: "list",
            message: "Choose the role from the list:",
            name: "role",
            choices: () => {
              let rlist = cb.map(obj => `${obj.roleid}: ${obj.title}`);
              return rlist;
            }
          }
        ])
        .then(answers => {
          orm.find("employees", "is_manager", true, cb => {
            inquirer
              .prompt({
                type: "list",
                message: "Choose this employee's manager from the list:",
                name: "manager",
                choices: () => {
                  let mlist = cb.map(
                    obj =>
                      `${obj.employeeid}: ${obj.first_name} ${obj.last_name}`
                  );
                  return mlist;
                }
              })
              .then(mgr => {
                const { first_name, last_name, is_manager, role } = answers;
                const { manager } = mgr;
                role.split(":");
                const roleInput = role[0];
                manager.split(":");
                const mgrInput = manager[0];
                orm.create(
                  "employees",
                  [
                    "first_name",
                    "last_name",
                    "is_manager",
                    "roleid",
                    "managerid"
                  ],
                  [first_name, last_name, is_manager, roleInput, mgrInput],
                  cb => {
                    console.log(
                      `=============== New Employee Created ============`
                    );
                    reinit();
                  }
                );
              });
          });
        });
    });
  },

  update: reinit => {
    orm.all(`employees`, cb => {
      inquirer
        .prompt({
          type: "list",
          message: "Which employee would you like to update?",
          name: "selected",
          choices: () => {
            let slist = [];
            slist = cb.map(
              obj => `${obj.employeeid}: ${obj.first_name} ${obj.last_name}`
            );
            return slist;
          }
        })
        .then(answer => {
          const { selected } = answer;
          selected.split(":");
          const eeid = selected[0];
          orm.find("employees", "employeeid", eeid, cb => {
            const {
              first_name,
              last_name,
              is_manager,
              roleid,
              managerid
            } = cb[0];
            const eeChoices = [
              `First name: ${first_name}`,
              `Last name: ${last_name}`,
              `Is Manager: ${is_manager}`,
              `Role: ${roleid}`,
              `Reports to: ${managerid}`
            ];
            inquirer
              .prompt({
                type: "list",
                message: "What would you like to update?",
                name: "to_update",
                choices: eeChoices
              })
              .then(answer => {
                const { to_update } = answer;
                const updateArr = to_update.split(":");
                console.log(updateArr);
                if (
                  updateArr[0] === "First name" ||
                  updateArr[0] === "Last name"
                ) {
                  const ugly_val = updateArr[0]
                    .toLowerCase()
                    .split(" ")
                    .join("_");
                  inquirer
                    .prompt({
                      type: "input",
                      message: "Enter new value:",
                      name: "new_name"
                    })
                    .then(res => {
                      const { new_name } = res;
                      orm.update(
                        "employees",
                        `${ugly_val}="${new_name}"`,
                        `employeeid=${eeid}`,
                        cb => {
                          console.log(
                            `=============== Employee Name Updated ============`
                          );
                          reinit();
                        }
                      );
                    });
                } else if (updateArr[0] === "Is Manager") {
                  const ugly_val = updateArr[0]
                    .toLowerCase()
                    .split(" ")
                    .join("_");
                  inquirer
                    .prompt({
                      type: "confirm",
                      message: "Is this employee a manager?",
                      name: "is_manager"
                    })
                    .then(res => {
                      const { is_manager } = res;
                      orm.update(
                        "employees",
                        `${ugly_val}=${is_manager}`,
                        `employeeid=${eeid}`,
                        cb => {
                          console.log(
                            `=============== Employee Manager Status Updated ============`
                          );
                          reinit();
                        }
                      );
                    });
                } else if (updateArr[0] === "Role") {
                  orm.some("roles", ["roleid", "title"], cb => {
                    inquirer
                      .prompt({
                        type: "list",
                        message: "Choose the role from the list:",
                        name: "role",
                        choices: () => {
                          let rlist = cb.map(
                            obj => `${obj.roleid}: ${obj.title}`
                          );
                          return rlist;
                        }
                      })
                      .then(answers => {
                        const { role } = answers;
                        role.split(":");
                        const roleInput = role[0];
                        orm.update(
                          "employees",
                          `roleid=${roleInput}`,
                          `employeeid=${eeid}`,
                          cb => {
                            console.log(
                              `=============== Employee Role Updated ============`
                            );
                            reinit();
                          }
                        );
                      });
                  });
                } else if (updateArr[0] === "Reports to") {
                  orm.find("employees", "is_manager", true, cb => {
                    inquirer
                      .prompt({
                        type: "list",
                        message:
                          "Choose this employee's manager from the list:",
                        name: "manager",
                        choices: () => {
                          let mlist = cb.map(
                            obj =>
                              `${obj.employeeid}: ${obj.first_name} ${obj.last_name}`
                          );
                          return mlist;
                        }
                      })
                      .then(mgr => {
                        const { manager } = mgr;
                        manager.split(":");
                        const mgrInput = manager[0];
                        orm.update(
                          "employees",
                          `managerid=${mgrInput}`,
                          `employeeid=${eeid}`,
                          cb => {
                            console.log(
                              `=============== Employee Manager Updated ============`
                            );
                            reinit();
                          }
                        );
                      });
                  });
                }
              });
          });
        });
    });
  },

  remove: reinit => {
    orm.all(`employees`, cb => {
      inquirer
        .prompt({
          type: "list",
          message: `Which employee would you like to remove?`,
          name: "selected",
          choices: () => {
            let slist = [];
            slist = cb.map(
              obj => `${obj.employeeid}: ${obj.first_name} ${obj.last_name}`
            );
            return slist;
          }
        })
        .then(answer => {
          const { selected } = answer;
          selected.split(":");
          const delValue = selected[0];
          orm.delete(`employees`, `employeeid`, delValue, cb => {
            console.log(`=============== Employee Deleted ============`);
            reinit();
          });
        });
    });
  },

  details: reinit => {
    orm.all(`employees`, cb => {
      inquirer
        .prompt({
          type: "list",
          message: `Which employee's details would you like to view?`,
          name: "selected",
          choices: () => {
            let slist = [];
            slist = cb.map(
              obj => `${obj.employeeid}: ${obj.first_name} ${obj.last_name}`
            );
            return slist;
          }
        })
        .then(answer => {
          const { selected } = answer;
          const eeArr = selected.split(":");
          orm.find("employees", "employeeid", eeArr[0], cb => {
            console.log(`=============== Employee Details ============`);
            console.log(`Employee ID: ${cb[0].employeeid}`);
            console.log(`Name: ${cb[0].first_name} ${cb[0].last_name}`);
            orm.find("roles", "roleid", cb[0].roleid, rolecb => {
              console.log(`Role: ${rolecb[0].title}`);
              console.log(`Salary: $${rolecb[0].salary}`);
            });
            if (cb[0].managerid !== null) {
              orm.someWHERE(
                "employees",
                ["first_name", "last_name"],
                "employeeid",
                cb[0].managerid,
                mgrcb => {
                  console.log(
                    `Reports to: ${mgrcb.first_name} ${mgrcb.last_name}`
                  );
                }
              );
            } else {
              console.log(`Reports to: No one, they're the big boss`);
            }
            if (cb[0].is_manager) {
              orm.someWHERE(
                "employees",
                ["employeeid", "first_name", "last_name"],
                "managerid",
                cb[0].employeeid,
                eecb => {
                  console.log("Direct reports:");
                  console.table(eecb);
                  reinit();
                }
              );
            } else {
              reinit();
            }
          });
        });
    });
  }
};

module.exports = employee;
