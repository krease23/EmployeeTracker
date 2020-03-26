const orm = require("../config/orm");
const inquirer = require("inquirer");

const role = {
  getNew: reinit => {
    orm.some("departments", ["departmentid", "dept_name"], cb => {
      inquirer
        .prompt([
          {
            type: "input",
            message: "Role title:",
            name: "role_title"
          },
          {
            type: "number",
            message: "Salary:",
            name: "salary"
          },
          {
            type: "list",
            message: "Choose the department from the list:",
            name: "dept",
            choices: () => {
              let dlist = cb.map(
                obj => `${obj.departmentid}: ${obj.dept_name}`
              );
              return dlist;
            }
          }
        ])
        .then(answers => {
          const { role_title, salary, dept } = answers;
          dept.split(":");
          const deptInput = dept[0];
          orm.create(
            "roles",
            ["title", "salary", "departmentid"],
            [role_title, salary, deptInput],
            cb => {
              console.log(`=============== New Role Created ============`);
              reinit();
            }
          );
        });
    });
  },

  update: reinit => {
    orm.all(`roles`, cb => {
      inquirer
        .prompt({
          type: "list",
          message: "Which role would you like to update?",
          name: "selected",
          choices: () => {
            let slist = [];
            slist = cb.map(obj => `${obj.roleid}: ${obj.title}`);
            return slist;
          }
        })
        .then(answer => {
          const { selected } = answer;
          selected.split(":");
          const roleid = selected[0];
          orm.find("roles", "roleid", roleid, cb => {
            const { title, salary, departmentid } = cb[0];
            const roleChoices = [
              `Title: ${title}`,
              `Salary: ${salary}`,
              `Department: ${departmentid}`
            ];
            inquirer
              .prompt({
                type: "list",
                message: "What would you like to update?",
                name: "to_update",
                choices: roleChoices
              })
              .then(answer => {
                const { to_update } = answer;
                const updateArr = to_update.split(":");
                if (updateArr[0] === "Title" || updateArr[0] === "Salary") {
                  const ugly_val = updateArr[0].toLowerCase();
                  inquirer
                    .prompt({
                      type: "input",
                      message: "Enter new value:",
                      name: "new_val"
                    })
                    .then(res => {
                      const { new_val } = res;
                      orm.update(
                        "roles",
                        `${ugly_val} = "${new_val}"`,
                        `roleid = ${roleid}`,
                        cb => {
                          console.log(
                            `=============== Role Title or Salary Updated ============`
                          );
                          reinit();
                        }
                      );
                    });
                } else if (updateArr[0] === "Department") {
                  orm.some("department", ["departmentid", "dept_name"], cb => {
                    inquirer
                      .prompt({
                        type: "list",
                        message: "Choose the department from the list:",
                        name: "dept",
                        choices: () => {
                          let rlist = cb.map(
                            obj => `${obj.departmentid}: ${obj.dept_name}`
                          );
                          return rlist;
                        }
                      })
                      .then(answers => {
                        const { dept } = answers;
                        dept.split(":");
                        const deptInput = dept[0];
                        orm.update(
                          "roles",
                          `departmentid = ${deptInput}`,
                          `roleid = ${roleid}`,
                          cb => {
                            console.log(
                              `=============== Role Department Updated ============`
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
    orm.all(`roles`, cb => {
      inquirer
        .prompt({
          type: "list",
          message: `Which role would you like to remove?`,
          name: "selected",
          choices: () => {
            let slist = [];
            slist = cb.map(obj => `${obj.roleid}: ${obj.title}`);
            return slist;
          }
        })
        .then(answer => {
          const { selected } = answer;
          selected.split(":");
          const delValue = selected[0];
          orm.delete(`roles`, `roleid`, delValue, cb => {
            console.log(`=============== Role Deleted ============`);
            reinit();
          });
        });
    });
  },

  allEmployees: reinit => {
    orm.all(`roles`, cb => {
      inquirer
        .prompt({
          type: "list",
          message: `Which role's employees would you like to view?`,
          name: "selected",
          choices: () => {
            let slist = [];
            slist = cb.map(obj => `${obj.roleid}: ${obj.title}`);
            return slist;
          }
        })
        .then(answer => {
          const { selected } = answer;
          const roleArr = selected.split(":");

          orm.find("employees", "roleid", roleArr[0], cb => {
            console.log(`=============== All${roleArr[1]}s ============`);
            console.table(cb);
            reinit();
          });
        });
    });
  }
};

module.exports = role;
