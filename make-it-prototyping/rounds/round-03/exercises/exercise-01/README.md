# Exercise 1: Database Basics & Table Creation

## 🎯 Learning Goals

- Create and manage databases
- Design table structures
- Understand data types
- Work with constraints
- Practice basic DDL (Data Definition Language)

## 📚 Prerequisites

- PostgreSQL installed and running
- Completed reading `setup/getting-started.md`
- Access to psql or pgAdmin

## 🔨 Tasks

### Task 1: Create Your First Database

Create a database called `library_db` that will store information about a library system.

```sql
-- Your code here
```

**Hint**: Use the `CREATE DATABASE` command.

### Task 2: Create a Books Table

Connect to your `library_db` database and create a table called `books` with the following columns:

- `id`: Auto-incrementing primary key
- `title`: Variable character string (max 200 characters), required
- `author`: Variable character string (max 100 characters), required
- `isbn`: Fixed character string (13 characters), unique
- `publication_year`: Integer
- `pages`: Integer, must be greater than 0
- `price`: Decimal with 2 decimal places
- `in_stock`: Boolean, default to TRUE

```sql
-- Your code here
```

### Task 3: Create a Members Table

Create a table called `members` to store library member information:

- `id`: Auto-incrementing primary key
- `first_name`: Variable character string (max 50 characters), required
- `last_name`: Variable character string (max 50 characters), required
- `email`: Variable character string (max 100 characters), unique, required
- `phone`: Variable character string (max 20 characters)
- `join_date`: Date, default to current date
- `membership_active`: Boolean, default to TRUE

```sql
-- Your code here
```

### Task 4: Create a Categories Table

Create a simple table called `categories` for book categories:

- `id`: Auto-incrementing primary key
- `name`: Variable character string (max 50 characters), unique, required
- `description`: Text (unlimited length)

```sql
-- Your code here
```

### Task 5: Modify Tables

Practice altering tables with these modifications:

1. Add a new column `language` (VARCHAR(30)) to the `books` table with default value 'English'
2. Add a new column `address` (TEXT) to the `members` table
3. Rename the `phone` column in `members` to `phone_number`

```sql
-- Your code here
```

### Task 6: Create Indexes

Create indexes to improve query performance:

1. Create an index on the `author` column in the `books` table
2. Create an index on the `email` column in the `members` table

```sql
-- Your code here
```

### Task 7: View Your Work

Use psql commands to verify your tables:

```sql
-- List all tables
\dt

-- Describe the books table
\d books

-- Describe the members table
\d members

-- Describe the categories table
\d categories
```

## 🧪 Testing Your Work

Run these commands to verify your tables are created correctly:

```sql
-- Check if database exists
\l

-- Connect to library_db
\c library_db

-- Check table structures
\d books
\d members
\d categories

-- Verify constraints
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'books';
```

## 💡 Bonus Challenges

1. **Create an Authors Table**: Design a separate table for authors with columns for author ID, name, biography, and country.

2. **Add a Publishers Table**: Create a table for publishers with ID, name, country, and website.

3. **Create an Enum Type**: Create a custom enumerated type for book condition (new, good, fair, poor) and add it to the books table.

```sql
-- Bonus challenge code here
```

## 🤔 Reflection Questions

1. Why is it important to use constraints like NOT NULL and UNIQUE?
2. What's the difference between CHAR and VARCHAR?
3. When should you use SERIAL vs INTEGER for an ID column?
4. Why might you want to create indexes on certain columns?

## ✅ Checklist

- [ ] Created `library_db` database
- [ ] Created `books` table with all required columns and constraints
- [ ] Created `members` table with all required columns and constraints
- [ ] Created `categories` table
- [ ] Modified tables using ALTER TABLE
- [ ] Created indexes on specified columns
- [ ] Verified all tables using psql commands
- [ ] Completed bonus challenges (optional)

## 📝 Notes

Write your observations and learnings here:

---

## Next Steps

Once you've completed this exercise, move on to **Exercise 2: Data Insertion & Querying** where you'll learn to populate these tables with data and retrieve it using SELECT queries.

Need help? Check the solution file in `solutions/exercise-01/solution.sql`
