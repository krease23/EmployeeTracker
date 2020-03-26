DROP DATABASE IF EXISTS eetracker_db;

CREATE DATABASE eetracker_db;
USE eetracker_db;

CREATE TABLE departments
(
    departmentid INT NOT NULL
    AUTO_INCREMENT,
    dept_name VARCHAR
    (30) NOT NULL,
    PRIMARY KEY
    (departmentid)
);

    CREATE TABLE roles
    (
        roleid INT NOT NULL
        AUTO_INCREMENT,
    title VARCHAR
        (30) NOT NULL,
    salary DECIMAL,
    departmentid INT,
    CONSTRAINT fk_department
    FOREIGN KEY
        (departmentid)
        REFERENCES departments
        (departmentid)
        ON
        UPDATE CASCADE
        ON DELETE SET NULL,
	PRIMARY KEY
        (roleid)
);

        CREATE TABLE employees
        (
            employeeid INT NOT NULL
            AUTO_INCREMENT,
    first_name VARCHAR
            (30) NOT NULL,
    last_name VARCHAR
            (30) NOT NULL,
    is_manager BOOLEAN DEFAULT false,
    roleid INT,
    CONSTRAINT fk_role
    FOREIGN KEY
            (roleid)
        REFERENCES roles
            (roleid)
        ON
            UPDATE CASCADE
        ON DELETE SET NULL,
    managerid INT,
    CONSTRAINT fk_ee
            FOREIGN KEY
            (managerid)
        REFERENCES employees
            (employeeid)
        ON
            UPDATE CASCADE
        ON DELETE SET NULL,
    PRIMARY KEY
            (employeeid)
);