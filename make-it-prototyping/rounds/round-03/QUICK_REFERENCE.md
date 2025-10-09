# SQL Quick Reference Guide

A handy reference for common SQL commands and patterns used in this project.

## 📋 Table of Contents
- [Connection & Database](#connection--database)
- [Table Operations](#table-operations)
- [Data Manipulation](#data-manipulation)
- [Querying](#querying)
- [Joins](#joins)
- [Aggregations](#aggregations)
- [Window Functions](#window-functions)
- [Advanced Patterns](#advanced-patterns)

## Connection & Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- List databases
\l

-- Create database
CREATE DATABASE dbname;

-- Connect to database
\c dbname

-- Drop database
DROP DATABASE dbname;
```

## Table Operations

```sql
-- Create table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- List tables
\dt

-- Describe table
\d tablename

-- Add column
ALTER TABLE users ADD COLUMN age INTEGER;

-- Drop column
ALTER TABLE users DROP COLUMN age;

-- Rename column
ALTER TABLE users RENAME COLUMN name TO full_name;

-- Add constraint
ALTER TABLE users ADD CONSTRAINT check_age CHECK (age >= 18);

-- Drop table
DROP TABLE users;
```

## Data Manipulation

```sql
-- Insert single row
INSERT INTO users (name, email) VALUES ('John', 'john@email.com');

-- Insert multiple rows
INSERT INTO users (name, email) VALUES
    ('Alice', 'alice@email.com'),
    ('Bob', 'bob@email.com');

-- Update
UPDATE users SET email = 'new@email.com' WHERE id = 1;

-- Delete
DELETE FROM users WHERE id = 1;

-- Truncate (delete all)
TRUNCATE TABLE users;
```

## Querying

```sql
-- Select all
SELECT * FROM users;

-- Select specific columns
SELECT name, email FROM users;

-- Where clause
SELECT * FROM users WHERE age > 18;

-- Multiple conditions
SELECT * FROM users WHERE age > 18 AND email LIKE '%@gmail.com';

-- Pattern matching
SELECT * FROM users WHERE name LIKE 'J%';  -- Starts with J
SELECT * FROM users WHERE name LIKE '%son'; -- Ends with son
SELECT * FROM users WHERE name LIKE '%oh%'; -- Contains oh

-- IN clause
SELECT * FROM users WHERE id IN (1, 2, 3);

-- BETWEEN
SELECT * FROM users WHERE age BETWEEN 18 AND 65;

-- IS NULL / IS NOT NULL
SELECT * FROM users WHERE email IS NULL;

-- ORDER BY
SELECT * FROM users ORDER BY name ASC;
SELECT * FROM users ORDER BY age DESC, name ASC;

-- LIMIT and OFFSET
SELECT * FROM users LIMIT 10;
SELECT * FROM users LIMIT 10 OFFSET 20;  -- Pagination

-- DISTINCT
SELECT DISTINCT country FROM users;
```

## Joins

```sql
-- INNER JOIN (only matching rows)
SELECT u.name, o.order_id
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN (all from left, matching from right)
SELECT u.name, o.order_id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- RIGHT JOIN (all from right, matching from left)
SELECT u.name, o.order_id
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;

-- FULL OUTER JOIN (all from both)
SELECT u.name, o.order_id
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;

-- CROSS JOIN (cartesian product)
SELECT u.name, p.product_name
FROM users u
CROSS JOIN products p;

-- Self JOIN
SELECT e1.name AS employee, e2.name AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;

-- Multiple joins
SELECT u.name, o.order_id, p.product_name
FROM users u
INNER JOIN orders o ON u.id = o.user_id
INNER JOIN products p ON o.product_id = p.id;
```

## Aggregations

```sql
-- COUNT
SELECT COUNT(*) FROM users;
SELECT COUNT(DISTINCT country) FROM users;

-- SUM
SELECT SUM(price) FROM orders;

-- AVG
SELECT AVG(price) FROM products;

-- MIN / MAX
SELECT MIN(price), MAX(price) FROM products;

-- GROUP BY
SELECT country, COUNT(*) AS user_count
FROM users
GROUP BY country;

-- HAVING (filter after grouping)
SELECT country, COUNT(*) AS user_count
FROM users
GROUP BY country
HAVING COUNT(*) > 10;

-- Multiple aggregations
SELECT 
    category,
    COUNT(*) AS product_count,
    AVG(price) AS avg_price,
    MIN(price) AS min_price,
    MAX(price) AS max_price
FROM products
GROUP BY category;
```

## Window Functions

```sql
-- ROW_NUMBER
SELECT 
    name,
    price,
    ROW_NUMBER() OVER (ORDER BY price DESC) AS row_num
FROM products;

-- RANK (gaps in ranking)
SELECT 
    name,
    price,
    RANK() OVER (ORDER BY price DESC) AS rank
FROM products;

-- DENSE_RANK (no gaps)
SELECT 
    name,
    price,
    DENSE_RANK() OVER (ORDER BY price DESC) AS dense_rank
FROM products;

-- PARTITION BY
SELECT 
    category,
    name,
    price,
    RANK() OVER (PARTITION BY category ORDER BY price DESC) AS rank_in_category
FROM products;

-- Running total
SELECT 
    date,
    amount,
    SUM(amount) OVER (ORDER BY date) AS running_total
FROM sales;

-- Moving average
SELECT 
    date,
    amount,
    AVG(amount) OVER (
        ORDER BY date 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_3
FROM sales;

-- LAG / LEAD
SELECT 
    date,
    amount,
    LAG(amount) OVER (ORDER BY date) AS prev_amount,
    LEAD(amount) OVER (ORDER BY date) AS next_amount
FROM sales;
```

## Advanced Patterns

### Common Table Expressions (CTEs)

```sql
-- Simple CTE
WITH high_value_users AS (
    SELECT * FROM users WHERE total_spent > 1000
)
SELECT * FROM high_value_users WHERE country = 'USA';

-- Multiple CTEs
WITH 
    user_stats AS (
        SELECT user_id, COUNT(*) AS order_count
        FROM orders
        GROUP BY user_id
    ),
    high_spenders AS (
        SELECT user_id, SUM(amount) AS total_spent
        FROM orders
        GROUP BY user_id
        HAVING SUM(amount) > 1000
    )
SELECT u.name, us.order_count, hs.total_spent
FROM users u
JOIN user_stats us ON u.id = us.user_id
JOIN high_spenders hs ON u.id = hs.user_id;

-- Recursive CTE
WITH RECURSIVE category_tree AS (
    SELECT id, name, parent_id, 1 AS level
    FROM categories
    WHERE parent_id IS NULL
    UNION ALL
    SELECT c.id, c.name, c.parent_id, ct.level + 1
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree;
```

### Subqueries

```sql
-- Scalar subquery
SELECT name, (SELECT COUNT(*) FROM orders WHERE user_id = users.id) AS order_count
FROM users;

-- IN subquery
SELECT * FROM products
WHERE category_id IN (SELECT id FROM categories WHERE active = true);

-- EXISTS subquery
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- Correlated subquery
SELECT * FROM products p
WHERE price > (SELECT AVG(price) FROM products WHERE category_id = p.category_id);
```

### CASE Statements

```sql
-- Simple CASE
SELECT 
    name,
    price,
    CASE 
        WHEN price < 10 THEN 'Cheap'
        WHEN price < 50 THEN 'Moderate'
        ELSE 'Expensive'
    END AS price_category
FROM products;

-- CASE in aggregation
SELECT 
    COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_count,
    COUNT(CASE WHEN status = 'inactive' THEN 1 END) AS inactive_count
FROM users;
```

### Set Operations

```sql
-- UNION (removes duplicates)
SELECT name FROM customers
UNION
SELECT name FROM suppliers;

-- UNION ALL (keeps duplicates)
SELECT name FROM customers
UNION ALL
SELECT name FROM suppliers;

-- INTERSECT (common rows)
SELECT product_id FROM orders_2023
INTERSECT
SELECT product_id FROM orders_2024;

-- EXCEPT (in first, not in second)
SELECT product_id FROM all_products
EXCEPT
SELECT product_id FROM discontinued_products;
```

### Indexes

```sql
-- Create index
CREATE INDEX idx_users_email ON users(email);

-- Create unique index
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Create composite index
CREATE INDEX idx_orders_user_date ON orders(user_id, order_date);

-- Drop index
DROP INDEX idx_users_email;

-- List indexes
\di
```

### Constraints

```sql
-- Primary key
ALTER TABLE users ADD PRIMARY KEY (id);

-- Foreign key
ALTER TABLE orders ADD FOREIGN KEY (user_id) REFERENCES users(id);

-- Foreign key with cascade
ALTER TABLE orders 
ADD FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Unique constraint
ALTER TABLE users ADD UNIQUE (email);

-- Check constraint
ALTER TABLE products ADD CHECK (price > 0);

-- Not null
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
```

### Transactions

```sql
-- Begin transaction
BEGIN;

-- Perform operations
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- Commit
COMMIT;

-- Or rollback if error
ROLLBACK;

-- Savepoint
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
SAVEPOINT my_savepoint;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
ROLLBACK TO my_savepoint;
COMMIT;
```

### Performance

```sql
-- Explain query plan
EXPLAIN SELECT * FROM users WHERE email = 'test@email.com';

-- Explain with execution
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@email.com';

-- Vacuum (cleanup)
VACUUM users;

-- Analyze (update statistics)
ANALYZE users;
```

## 🔧 Useful psql Commands

```sql
\?              -- Help on psql commands
\h              -- Help on SQL commands
\h CREATE TABLE -- Help on specific SQL command
\l              -- List databases
\c dbname       -- Connect to database
\dt             -- List tables
\d tablename    -- Describe table
\du             -- List users/roles
\dn             -- List schemas
\df             -- List functions
\dv             -- List views
\di             -- List indexes
\timing         -- Toggle timing
\x              -- Toggle expanded display
\q              -- Quit
\i file.sql     -- Execute SQL file
\o file.txt     -- Output to file
```

## 💡 Best Practices

1. **Always use WHERE in UPDATE/DELETE** to avoid accidents
2. **Use transactions** for related operations
3. **Index foreign keys** for better join performance
4. **Use EXPLAIN** to understand query performance
5. **Prefer JOINs over subqueries** when possible
6. **Use CTEs** for complex queries to improve readability
7. **Always backup** before major changes
8. **Use constraints** to enforce data integrity
9. **Normalize** your database design appropriately
10. **Test queries** on small datasets first

---

For more details, refer to the [PostgreSQL Documentation](https://www.postgresql.org/docs/)
