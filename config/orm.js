var connection = require("./connection.js");

function printQuestionMarks(num) {
  let arr = [];

  for (var i = 0; i < num; i++) {
    arr.push("?");
  }

  return arr.toString();
}

function objToSql(ob) {
  let arr = [];

  // loop through the keys and push the key/value as a string int arr
  for (var key in ob) {
    let value = ob[key];
    // check to skip hidden properties
    if (Object.hasOwnProperty.call(ob, key)) {
      if (typeof value === "string" && value.indexOf(" ") >= 0) {
        value = "'" + value + "'";
      }
      arr.push(key + "=" + value);
    }
  }

  // translate array of strings to a single comma-separated string
  return arr.toString();
}

const orm = {
  all: (table, cb) => {
    let queryString = "SELECT * FROM " + table + ";";
    connection.query(queryString, (err, result) => {
      if (err) throw err;
      cb(result);
    });
  },

  allBy: (table, where, cb) => {
    let queryString = "SELECT * FROM " + table + ";";
    connection.query(queryString, (err, result) => {
      if (err) throw err;
      cb(result);
    });
  },

  find: (table, whereKey, whereVal, cb) => {
    let queryString =
      "SELECT * FROM " + table + " WHERE " + whereKey + "=" + whereVal + ";";
    connection.query(queryString, (err, result) => {
      if (err) throw err;
      cb(result);
    });
  },

  findOR: (table, whereKey, whereVals, cb) => {
    let queryString = "SELECT * FROM " + table;
    queryString += " WHERE ";
    whereVals.forEach((param, index) => {
      queryString += whereKey + "=" + param;
      if (index !== whereVals.length - 1) {
        queryString += " OR ";
      }
    });
    connection.query(queryString, (err, result) => {
      if (err) throw err;
      cb(result);
    });
  },

  count: (table, whereKey, whereVal, cb) => {
    let queryString = "SELECT COUNT(*) AS eeCount FROM " + table;
    queryString += " WHERE ";
    queryString += whereKey + "=" + whereVal;
    connection.query(queryString, (err, result) => {
      if (err) throw err;
      cb(result);
    });
  },

  some: (table, cols, cb) => {
    let queryString = "SELECT " + cols.toString() + " FROM " + table + ";";
    connection.query(queryString, (err, result) => {
      if (err) throw err;
      cb(result);
    });
  },

  someWHERE: (table, cols, whereKey, whereVal, cb) => {
    let queryString = "SELECT " + cols.toString();
    queryString += " FROM " + table;
    queryString += " WHERE " + whereKey + "=" + whereVal + ";";
    connection.query(queryString, (err, result) => {
      if (err) throw err;
      cb(result);
    });
  },

  create: (table, cols, vals, cb) => {
    let queryString = "INSERT INTO " + table;
    queryString += " (";
    queryString += cols.toString();
    queryString += ") ";
    queryString += "VALUES (";
    queryString += printQuestionMarks(vals.length);
    queryString += ")";

    connection.query(queryString, vals, (err, result) => {
      if (err) throw err;
      cb(result);
    });
  },

  update: (table, newVals, condition, cb) => {
    let queryString = "UPDATE " + table;

    queryString += " SET ";
    queryString += newVals;
    queryString += " WHERE ";
    queryString += condition;

    console.log(queryString);
    connection.query(queryString, (err, result) => {
      if (err) throw err;
      cb(result);
    });
  },

  delete: (table, id, val, cb) => {
    let queryString = "DELETE FROM " + table;
    queryString += " WHERE ";
    queryString += id + "=";
    queryString += val;

    connection.query(queryString, (err, result) => {
      if (err) throw err;
      cb(result);
    });
  },

  salaries: (id, cb) => {
    let queryString = "SELECT SUM(T2.salary) AS total_salaries";
    queryString +=
      " FROM employees T1 LEFT JOIN roles T2 ON T1.roleid = T2.roleid";
    queryString += " WHERE T2.departmentid=" + id + ";";
    connection.query(queryString, (err, result) => {
      if (err) throw err;
      cb(result);
    });
  }
};

module.exports = orm;
