# Getting Started with PostgreSQL

## Essential psql Commands

### Connecting to PostgreSQL

```bash
# Connect as postgres user
psql -U postgres

# Connect to a specific database
psql -U postgres -d database_name

# Connect with host and port
psql -h localhost -p 5432 -U postgres -d database_name
```

### Database Commands

```sql
-- List all databases
\l

-- Create a new database
CREATE DATABASE my_database;

-- Connect to a database
\c my_database

-- Drop (delete) a database
DROP DATABASE my_database;

-- Show current database
SELECT current_database();
```

### Table Commands

```sql
-- List all tables in current database
\dt

-- Describe a table structure
\d table_name

-- List all schemas
\dn

-- List all views
\dv

-- List all functions
\df
```

### User and Permission Commands

```sql
-- List all users/roles
\du

-- Create a new user
CREATE USER username WITH PASSWORD 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE dbname TO username;

-- Revoke privileges
REVOKE ALL PRIVILEGES ON DATABASE dbname FROM username;
```

### Utility Commands

```sql
-- Get help
\?

-- Get help on SQL commands
\h

-- Get help on specific command
\h CREATE TABLE

-- Execute commands from a file
\i /path/to/file.sql

-- Toggle timing of commands
\timing

-- Quit psql
\q
```

## Basic SQL Syntax

### Data Types

```sql
-- Numeric Types
INTEGER, BIGINT, SMALLINT
DECIMAL(precision, scale)
NUMERIC(precision, scale)
REAL, DOUBLE PRECISION

-- Character Types
CHAR(n)           -- Fixed length
VARCHAR(n)        -- Variable length
TEXT              -- Unlimited length

-- Date/Time Types
DATE              -- Date only
TIME              -- Time only
TIMESTAMP         -- Date and time
INTERVAL          -- Time interval

-- Boolean
BOOLEAN           -- TRUE, FALSE, NULL

-- Other Common Types
UUID              -- Universally unique identifier
JSON, JSONB       -- JSON data
ARRAY             -- Array of any type
```

### Creating Tables

```sql
-- Basic table creation
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table with constraints
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) CHECK (price > 0),
    category VARCHAR(50),
    in_stock BOOLEAN DEFAULT TRUE
);
```

### Inserting Data

```sql
-- Insert single row
INSERT INTO users (username, email)
VALUES ('john_doe', 'john@example.com');

-- Insert multiple rows
INSERT INTO users (username, email) VALUES
    ('jane_smith', 'jane@example.com'),
    ('bob_jones', 'bob@example.com');

-- Insert with RETURNING
INSERT INTO users (username, email)
VALUES ('alice', 'alice@example.com')
RETURNING id, username;
```

### Querying Data

```sql
-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT username, email FROM users;

-- With WHERE clause
SELECT * FROM users WHERE username = 'john_doe';

-- With multiple conditions
SELECT * FROM products
WHERE price > 10 AND in_stock = TRUE;

-- Using LIKE for pattern matching
SELECT * FROM users WHERE email LIKE '%@example.com';

-- Ordering results
SELECT * FROM products ORDER BY price DESC;

-- Limiting results
SELECT * FROM users LIMIT 10;

-- Offset and limit (pagination)
SELECT * FROM users LIMIT 10 OFFSET 20;
```

### Updating Data

```sql
-- Update single row
UPDATE users
SET email = 'newemail@example.com'
WHERE username = 'john_doe';

-- Update multiple columns
UPDATE products
SET price = price * 1.1, in_stock = TRUE
WHERE category = 'electronics';

-- Update with RETURNING
UPDATE users
SET email = 'updated@example.com'
WHERE id = 1
RETURNING *;
```

### Deleting Data

```sql
-- Delete specific rows
DELETE FROM users WHERE username = 'john_doe';

-- Delete with condition
DELETE FROM products WHERE price < 5;

-- Delete all rows (careful!)
DELETE FROM users;

-- Delete with RETURNING
DELETE FROM users WHERE id = 1 RETURNING *;
```

## Working with Constraints

### Primary Keys

```sql
-- Auto-incrementing primary key
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

-- Composite primary key
CREATE TABLE order_items (
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    PRIMARY KEY (order_id, product_id)
);
```

### Foreign Keys

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- With ON DELETE and ON UPDATE
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT
);
```

### Unique Constraints

```sql
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    username VARCHAR(50) UNIQUE
);
```

### Check Constraints

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    age INTEGER CHECK (age >= 18),
    salary DECIMAL(10, 2) CHECK (salary > 0)
);
```

## Best Practices

1. **Use meaningful names**: Choose clear, descriptive names for tables and columns
2. **Always use PRIMARY KEY**: Every table should have a primary key
3. **Use NOT NULL wisely**: Only allow NULL when it makes sense
4. **Index frequently queried columns**: Improve query performance
5. **Use transactions**: For operations that must succeed or fail together
6. **Backup regularly**: Protect your data
7. **Use constraints**: Enforce data integrity at the database level

## Common Patterns

### Timestamps

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Soft Deletes

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    deleted_at TIMESTAMP NULL
);

-- Query only active records
SELECT * FROM documents WHERE deleted_at IS NULL;
```

### Enumerated Types

```sql
-- Create custom type
CREATE TYPE status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    status status DEFAULT 'pending'
);
```

## Next Steps

Now that you understand the basics:
1. Start with **Exercise 1** to practice creating databases and tables
2. Work through each exercise sequentially
3. Experiment with different SQL commands
4. Don't be afraid to make mistakes - that's how you learn!

Happy coding! 🚀
