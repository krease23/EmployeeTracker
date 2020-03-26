INSERT INTO departments
    (dept_name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Services'),
    ('Product');

INSERT INTO roles
    (title, salary, departmentid)
VALUES
    ('Account Manager', 60000, 1),
    ('Sales Manager', 160000, 1),
    ('Engineering Manager', 180000, 2),
    ('Engineer', 120000, 2),
    ('Solution Architect', 100000, 3),
    ('Project Manager', 110000, 3),
    ('Product Manager', 120000, 4),
    ('Program Manager', 120000, 4);

INSERT INTO employees
    (first_name, last_name, is_manager, roleid, managerid)
VALUES
    ('Mickey', 'Mouse', true, 2, NULL),
    ('Donald', 'Duck', false, 1, 1),
    ('Goofy', 'Dog', false, 1, 1),
    ('Steamboat', 'Willy', true, 3, NULL),
    ('Tugboat', 'Tom', false, 4, 4);