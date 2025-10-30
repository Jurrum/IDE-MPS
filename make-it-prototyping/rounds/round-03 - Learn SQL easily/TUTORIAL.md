# SQL & Database Design Tutorial

Hello there! Welcome to the SQL & Database Design tutorial. Here you'll be learning how to design and build relational databases using PostgreSQL. To do this, this tutorial is split into 3 parts: An individual section, a collaborative section, and lastly an advanced section.

---

## Part A - Individual

Each person should follow this section, it should take about 6-8 hours total.

### A1 - Setup & Installation (30-60 minutes)

Before you can start building databases, you need to install PostgreSQL on your computer.

#### Step 1: Download PostgreSQL

Go to the PostgreSQL download page:
- **Windows**: https://www.postgresql.org/download/windows/
- **macOS**: Use Homebrew or download from https://postgresapp.com/
- **Linux**: Use your package manager (apt, dnf, etc.)

#### Step 2: Install PostgreSQL

**For Windows:**
1. Run the installer you downloaded
2. Keep the default installation directory
3. Select these components:
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4 (GUI tool)
   - ✅ Command Line Tools
4. **IMPORTANT**: When prompted, set a password for the postgres user. **Write this down!** You'll need it later.
5. Use port 5432 (default)
6. Complete the installation

**For macOS (using Homebrew):**
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create your user database
createdb `whoami`
```

**For Linux (Ubuntu/Debian):**
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Step 3: Verify Installation

Open your terminal (Command Prompt on Windows, Terminal on macOS/Linux) and type:

```bash
psql --version
```

You should see something like: `psql (PostgreSQL) 15.x`

If you see this, congratulations! PostgreSQL is installed. If not, check that PostgreSQL's bin directory is in your system PATH.

#### Step 4: Connect to PostgreSQL

**Windows:**
```bash
psql -U postgres
# Enter the password you set during installation
```

**macOS/Linux:**
```bash
psql postgres
# or
sudo -u postgres psql
```

You should now see a prompt that looks like: `postgres=#`

This means you're connected to PostgreSQL!

#### Step 5: Learn Basic Commands

Try these commands in the psql prompt:

```sql
-- See all databases
\l

-- See the version
SELECT version();

-- Get help
\?

-- Quit psql
\q
```

### A2 - Your First Database (2-3 hours)

Now that PostgreSQL is installed, you're going to create your first database and tables. This exercise will teach you the fundamentals of database design.

#### What You'll Build

You'll create a library management system with tables for books, members, and categories.

#### Step 1: Create the Database

Connect to PostgreSQL (if not already connected):
```bash
psql -U postgres
```

Create your first database:
```sql
CREATE DATABASE library_db;
```

Connect to your new database:
```sql
\c library_db
```

You should see: `You are now connected to database "library_db"`

#### Step 2: Create the Books Table

Now you'll create a table to store information about books. Type this carefully:

```sql
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    isbn CHAR(13) UNIQUE,
    publication_year INTEGER,
    pages INTEGER CHECK (pages > 0),
    price DECIMAL(10, 2),
    in_stock BOOLEAN DEFAULT TRUE
);
```

Let's break down what each part means:
- `id SERIAL PRIMARY KEY`: Auto-incrementing unique identifier
- `VARCHAR(200)`: Variable-length text up to 200 characters
- `NOT NULL`: This field is required
- `UNIQUE`: No two books can have the same ISBN
- `CHECK (pages > 0)`: Pages must be a positive number
- `DEFAULT TRUE`: If not specified, in_stock will be TRUE

#### Step 3: Verify Your Table

Check that your table was created:
```sql
\dt
```

You should see `books` listed.

To see the structure of your table:
```sql
\d books
```

This shows all columns, their types, and constraints.

#### Step 4: Create More Tables

Create a members table:
```sql
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    join_date DATE DEFAULT CURRENT_DATE,
    membership_active BOOLEAN DEFAULT TRUE
);
```

Create a categories table:
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);
```

#### Step 5: Modify Tables

Practice modifying existing tables:

Add a language column to books:
```sql
ALTER TABLE books 
ADD COLUMN language VARCHAR(30) DEFAULT 'English';
```

Add an address column to members:
```sql
ALTER TABLE members 
ADD COLUMN address TEXT;
```

Rename a column:
```sql
ALTER TABLE members 
RENAME COLUMN phone TO phone_number;
```

#### Step 6: Create Indexes

Indexes make searching faster. Create indexes on commonly searched columns:

```sql
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_members_email ON members(email);
```

#### Step 7: Explore Your Work

Use these commands to see what you've built:
```sql
-- List all tables
\dt

-- Describe each table
\d books
\d members
\d categories

-- See all indexes
\di
```

**Congratulations!** You've created your first database with multiple tables, constraints, and indexes.

### A3 - Working with Data (3-4 hours)

Now that you have tables, it's time to put data in them and learn how to retrieve it.

#### Step 1: Insert Data

Connect to your library_db database:
```sql
\c library_db
```

Insert books:
```sql
INSERT INTO books (title, author, isbn, publication_year, pages, price)
VALUES 
    ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 1925, 180, 12.99),
    ('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 1960, 324, 14.99),
    ('1984', 'George Orwell', '9780451524935', 1949, 328, 13.99);
```

Insert members:
```sql
INSERT INTO members (first_name, last_name, email, phone_number)
VALUES 
    ('John', 'Doe', 'john.doe@email.com', '555-0101'),
    ('Jane', 'Smith', 'jane.smith@email.com', '555-0102'),
    ('Bob', 'Johnson', 'bob.johnson@email.com', '555-0103');
```

Insert categories:
```sql
INSERT INTO categories (name, description)
VALUES 
    ('Fiction', 'Fictional stories and novels'),
    ('Non-Fiction', 'Factual books and biographies'),
    ('Science', 'Scientific books and research');
```

#### Step 2: Query Your Data

Now the fun part - retrieving data!

See all books:
```sql
SELECT * FROM books;
```

See specific columns:
```sql
SELECT title, author, price FROM books;
```

Filter results:
```sql
SELECT * FROM books WHERE price < 14.00;
```

Search by pattern:
```sql
SELECT * FROM books WHERE title LIKE '%Great%';
```

Sort results:
```sql
SELECT * FROM books ORDER BY price DESC;
```

Limit results:
```sql
SELECT * FROM books LIMIT 2;
```

#### Step 3: Update Data

Change book prices:
```sql
UPDATE books 
SET price = 11.99 
WHERE title = 'The Great Gatsby';
```

Update multiple columns:
```sql
UPDATE members 
SET membership_active = FALSE, address = '123 Main St'
WHERE email = 'john.doe@email.com';
```

#### Step 4: Aggregate Functions

Count books:
```sql
SELECT COUNT(*) FROM books;
```

Find average price:
```sql
SELECT AVG(price) FROM books;
```

Find min and max:
```sql
SELECT MIN(price) as cheapest, MAX(price) as most_expensive FROM books;
```

#### Step 5: Delete Data

Delete specific records:
```sql
DELETE FROM books WHERE id = 1;
```

**Warning**: Be careful with DELETE! Always use a WHERE clause unless you want to delete everything.

#### Exploration Time!

Try these on your own:
- Insert 5 more books of your choice
- Find all books published after 1950
- Update the price of all books by increasing them by 10%
- Count how many members have active memberships
- Find the book with the most pages

---

## Part B - Collaborative

Do these exercises in your group. You can split into pairs so that two collaborate on B1 and two collaborate on B2, and then share your results with each other.

### B1 - Relationships & Joins (4-5 hours)

In this section, you'll learn how to connect tables together using relationships - one of the most powerful features of relational databases.

#### Step 1: Create a Loans Table

This table will track which members borrowed which books:

```sql
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id),
    member_id INTEGER REFERENCES members(id),
    loan_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    return_date DATE,
    CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    CONSTRAINT fk_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);
```

The `REFERENCES` keyword creates a **foreign key** - it links this table to another table.

#### Step 2: Insert Loan Records

```sql
INSERT INTO loans (book_id, member_id, loan_date, due_date)
VALUES 
    (1, 1, '2025-09-01', '2025-09-15'),
    (2, 2, '2025-09-05', '2025-09-19'),
    (3, 1, '2025-09-10', '2025-09-24');
```

#### Step 3: Your First JOIN

To see which member borrowed which book, you need to JOIN tables:

```sql
SELECT 
    members.first_name,
    members.last_name,
    books.title,
    loans.loan_date,
    loans.due_date
FROM loans
JOIN members ON loans.member_id = members.id
JOIN books ON loans.book_id = books.id;
```

This query combines data from three tables!

#### Step 4: Different Types of Joins

**INNER JOIN** (only matching records):
```sql
SELECT books.title, loans.loan_date
FROM books
INNER JOIN loans ON books.id = loans.book_id;
```

**LEFT JOIN** (all books, even if not loaned):
```sql
SELECT books.title, loans.loan_date
FROM books
LEFT JOIN loans ON books.id = loans.book_id;
```

**Find books that have never been loaned**:
```sql
SELECT books.title
FROM books
LEFT JOIN loans ON books.id = loans.book_id
WHERE loans.id IS NULL;
```

#### Step 5: Many-to-Many Relationships

Books can have multiple categories, and categories can have multiple books. This requires a junction table:

```sql
CREATE TABLE book_categories (
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, category_id)
);
```

Insert relationships:
```sql
INSERT INTO book_categories (book_id, category_id)
VALUES 
    (1, 1),  -- Great Gatsby is Fiction
    (2, 1),  -- To Kill a Mockingbird is Fiction
    (3, 1);  -- 1984 is Fiction
```

Query books with their categories:
```sql
SELECT books.title, categories.name as category
FROM books
JOIN book_categories ON books.id = book_categories.book_id
JOIN categories ON book_categories.category_id = categories.id;
```

#### Group Challenge:

Work together to:
1. Create an `authors` table (separate from the author column in books)
2. Create a `book_authors` junction table (books can have multiple authors)
3. Migrate existing author data from books to the new structure
4. Write queries to find:
   - All books by a specific author
   - Authors who have written more than one book
   - Books with multiple authors

### B2 - Advanced Queries & Analytics (5-6 hours)

Now you'll learn powerful analytical queries that can answer complex questions.

#### Step 1: GROUP BY and Aggregation

Count books per category:
```sql
SELECT categories.name, COUNT(book_categories.book_id) as book_count
FROM categories
LEFT JOIN book_categories ON categories.id = book_categories.category_id
GROUP BY categories.name;
```

Find members who borrowed the most books:
```sql
SELECT 
    members.first_name,
    members.last_name,
    COUNT(loans.id) as books_borrowed
FROM members
LEFT JOIN loans ON members.id = loans.member_id
GROUP BY members.id, members.first_name, members.last_name
ORDER BY books_borrowed DESC;
```

#### Step 2: HAVING Clause

Find categories with more than 5 books:
```sql
SELECT categories.name, COUNT(book_categories.book_id) as book_count
FROM categories
JOIN book_categories ON categories.id = book_categories.category_id
GROUP BY categories.name
HAVING COUNT(book_categories.book_id) > 5;
```

#### Step 3: Subqueries

Find books more expensive than average:
```sql
SELECT title, price
FROM books
WHERE price > (SELECT AVG(price) FROM books);
```

Find members who have never borrowed a book:
```sql
SELECT first_name, last_name
FROM members
WHERE id NOT IN (SELECT DISTINCT member_id FROM loans);
```

#### Step 4: Window Functions

Rank books by price:
```sql
SELECT 
    title,
    price,
    RANK() OVER (ORDER BY price DESC) as price_rank
FROM books;
```

Running total of loans:
```sql
SELECT 
    loan_date,
    COUNT(*) OVER (ORDER BY loan_date) as cumulative_loans
FROM loans
ORDER BY loan_date;
```

#### Step 5: Common Table Expressions (CTEs)

CTEs make complex queries more readable:

```sql
WITH expensive_books AS (
    SELECT * FROM books WHERE price > 15.00
),
active_members AS (
    SELECT * FROM members WHERE membership_active = TRUE
)
SELECT 
    expensive_books.title,
    active_members.first_name,
    active_members.last_name
FROM loans
JOIN expensive_books ON loans.book_id = expensive_books.id
JOIN active_members ON loans.member_id = active_members.id;
```

#### Group Challenge:

Work together to create queries that answer:
1. What is the average loan duration?
2. Which books are overdue?
3. What percentage of books in each category are currently on loan?
4. Who are the top 3 most active borrowers this month?
5. What is the total value of all books in the library?

---

## Part C - Advanced

This section is for those who want to build a complete, production-ready database system.

### C1 - Final Project: E-Commerce Database (10-15 hours)

Now that you've mastered the basics, it's time to build a complete e-commerce database system from scratch.

#### The Challenge

Design and implement a database for "TechStore" - an online electronics store. Your database must support:

**Core Features:**
- Product catalog with categories and subcategories
- Customer accounts and profiles
- Shopping cart functionality
- Order processing and tracking
- Product reviews and ratings
- Inventory management
- Multiple payment methods
- Shipping addresses

**Required Tables:**
1. `customers` - Customer information
2. `products` - Product catalog
3. `categories` - Product categories (hierarchical)
4. `orders` - Order information
5. `order_items` - Items in each order
6. `cart` - Shopping cart items
7. `reviews` - Product reviews
8. `inventory` - Stock tracking
9. `addresses` - Customer addresses
10. `payments` - Payment records

#### Step 1: Design Your Schema

Before writing any SQL, draw out your database design:
- What tables do you need?
- What columns does each table need?
- What are the relationships between tables?
- What constraints are necessary?

**Tip**: Use pen and paper or a tool like dbdiagram.io to visualize your design.

#### Step 2: Create the Database

```sql
CREATE DATABASE techstore_db;
\c techstore_db
```

#### Step 3: Implement Core Tables

Start with the foundation:

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    parent_category_id INTEGER REFERENCES categories(id),
    description TEXT
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    category_id INTEGER REFERENCES categories(id),
    sku VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Continue building the rest of the tables...

#### Step 4: Add Advanced Features

**Create Views** for common queries:
```sql
CREATE VIEW product_inventory_view AS
SELECT 
    products.id,
    products.name,
    products.price,
    inventory.quantity,
    categories.name as category
FROM products
JOIN inventory ON products.id = inventory.product_id
JOIN categories ON products.category_id = categories.id;
```

**Create Functions** for business logic:
```sql
CREATE FUNCTION calculate_order_total(order_id_param INTEGER)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
    total DECIMAL(10, 2);
BEGIN
    SELECT SUM(quantity * price) INTO total
    FROM order_items
    WHERE order_id = order_id_param;
    RETURN total;
END;
$$ LANGUAGE plpgsql;
```

**Create Triggers** for automatic updates:
```sql
CREATE TRIGGER update_product_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_modified_timestamp();
```

#### Step 5: Populate with Test Data

Insert realistic test data:
- At least 50 products across multiple categories
- 20+ customers
- 30+ orders with multiple items each
- Product reviews
- Inventory records

#### Step 6: Create Complex Queries

Build queries for:
1. **Sales Dashboard**: Total revenue, orders today, top products
2. **Customer Analytics**: Customer lifetime value, repeat customers
3. **Inventory Alerts**: Low stock products, out of stock items
4. **Product Performance**: Best sellers, most reviewed, highest rated
5. **Order Reports**: Pending orders, shipping status, revenue by category

#### Example Dashboard Query:
```sql
WITH daily_stats AS (
    SELECT 
        COUNT(DISTINCT id) as total_orders,
        SUM(total_amount) as total_revenue,
        COUNT(DISTINCT customer_id) as unique_customers
    FROM orders
    WHERE DATE(created_at) = CURRENT_DATE
),
top_products AS (
    SELECT 
        products.name,
        SUM(order_items.quantity) as units_sold
    FROM order_items
    JOIN products ON order_items.product_id = products.id
    JOIN orders ON order_items.order_id = orders.id
    WHERE DATE(orders.created_at) = CURRENT_DATE
    GROUP BY products.id, products.name
    ORDER BY units_sold DESC
    LIMIT 5
)
SELECT * FROM daily_stats, top_products;
```

#### Step 7: Optimize Performance

- Add indexes on frequently queried columns
- Use EXPLAIN ANALYZE to identify slow queries
- Optimize JOIN operations
- Consider partitioning large tables

#### Step 8: Document Your Work

Create a README for your database that includes:
- Schema diagram
- Table descriptions
- Common queries
- Setup instructions
- Sample data

### C2 - Integration with Applications

Now that you have a complete database, learn how to connect it to applications.

#### Using PostgreSQL with Python

```python
import psycopg2

# Connect to database
conn = psycopg2.connect(
    dbname="techstore_db",
    user="postgres",
    password="your_password",
    host="localhost"
)

# Create cursor
cur = conn.cursor()

# Execute query
cur.execute("SELECT * FROM products WHERE price < 100")
products = cur.fetchall()

for product in products:
    print(product)

# Close connection
cur.close()
conn.close()
```

#### Using PostgreSQL with Node.js

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'techstore_db',
  password: 'your_password',
  port: 5432,
});

// Query products
pool.query('SELECT * FROM products WHERE price < $1', [100], (err, res) => {
  if (err) throw err;
  console.log(res.rows);
  pool.end();
});
```

### C3 - Advanced Topics to Explore

Once you've completed the main project, explore these advanced topics:

1. **Full-Text Search**: Implement search functionality using PostgreSQL's text search features
2. **JSON/JSONB**: Store and query JSON data for flexible schemas
3. **Transactions**: Ensure data consistency with ACID transactions
4. **Replication**: Set up database replication for high availability
5. **Partitioning**: Partition large tables for better performance
6. **Security**: Implement row-level security and user permissions
7. **Backup & Recovery**: Set up automated backups
8. **Monitoring**: Use pg_stat_statements for query analysis

---

## 📚 Additional Resources

### Official Documentation
- PostgreSQL Docs: https://www.postgresql.org/docs/
- PostgreSQL Tutorial: https://www.postgresqltutorial.com/

### Practice Platforms
- SQLZoo: https://sqlzoo.net/
- LeetCode SQL: https://leetcode.com/problemset/database/
- HackerRank SQL: https://www.hackerrank.com/domains/sql
- pgexercises: https://pgexercises.com/

### Books
- "PostgreSQL: Up and Running" by Regina Obe & Leo Hsu
- "SQL Performance Explained" by Markus Winand
- "Designing Data-Intensive Applications" by Martin Kleppmann

### Communities
- r/PostgreSQL: https://reddit.com/r/PostgreSQL
- r/SQL: https://reddit.com/r/SQL
- Stack Overflow: https://stackoverflow.com/questions/tagged/postgresql

---

## 🎯 Tips for Success

1. **Practice Daily**: Even 30 minutes a day is better than long sessions once a week
2. **Type Everything**: Don't copy-paste. Typing helps you learn
3. **Make Mistakes**: Errors are learning opportunities
4. **Read Error Messages**: They usually tell you exactly what's wrong
5. **Use \d Commands**: Frequently check your table structures
6. **Comment Your Code**: Explain your logic for future reference
7. **Start Simple**: Build complex queries incrementally
8. **Ask Questions**: No question is too basic
9. **Experiment**: Try variations of queries to see what happens
10. **Build Projects**: Apply what you learn to your own ideas

---

## ✅ Completion Checklist

### Part A - Individual
- [ ] Installed PostgreSQL successfully
- [ ] Created library_db database
- [ ] Created books, members, and categories tables
- [ ] Inserted and queried data
- [ ] Used UPDATE and DELETE statements
- [ ] Practiced aggregate functions

### Part B - Collaborative
- [ ] Created relationships with foreign keys
- [ ] Practiced all types of JOINs
- [ ] Implemented many-to-many relationships
- [ ] Used GROUP BY and HAVING
- [ ] Wrote subqueries
- [ ] Explored window functions and CTEs

### Part C - Advanced
- [ ] Designed complete e-commerce database schema
- [ ] Implemented all required tables
- [ ] Created views, functions, and triggers
- [ ] Populated with realistic test data
- [ ] Built complex analytical queries
- [ ] Optimized query performance
- [ ] Documented the database system

---

## 🎉 Congratulations!

If you've completed all three parts, you now have professional-level SQL and database design skills. You can:

✅ Design normalized database schemas  
✅ Write complex SQL queries efficiently  
✅ Optimize query performance  
✅ Implement business logic in the database  
✅ Build production-ready database systems  

**What's Next?**
- Build your own database project
- Contribute to open-source projects
- Learn database administration
- Explore NoSQL databases
- Study distributed databases

**Keep practicing, keep building, and keep learning!** 🚀
