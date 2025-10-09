# Exercise 3: Relationships & Joins

## 🎯 Learning Goals

- Understand table relationships (one-to-many, many-to-many)
- Create and use foreign keys
- Master different types of joins (INNER, LEFT, RIGHT, FULL)
- Work with junction tables
- Query data across multiple tables

## 📚 Prerequisites

- Completed Exercise 1 and 2
- Understanding of primary and foreign keys
- Familiarity with basic SELECT queries

## 🔨 Tasks

### Task 1: Add Foreign Keys to Existing Tables

Modify the `books` table to add a relationship with categories:

1. Add a `category_id` column to the `books` table (INTEGER)
2. Create a foreign key constraint linking to `categories(id)`
3. Update existing books to assign them to appropriate categories

```sql
-- Your code here
```

### Task 2: Create a Borrowing System

Create a new table called `loans` to track book borrowing:

- `id`: Auto-incrementing primary key
- `book_id`: Foreign key referencing books(id)
- `member_id`: Foreign key referencing members(id)
- `loan_date`: Date, default to current date
- `due_date`: Date (14 days from loan date)
- `return_date`: Date (NULL if not returned)
- `status`: VARCHAR(20), default 'active' (active, returned, overdue)

```sql
-- Your code here
```

### Task 3: Create a Many-to-Many Relationship

Books can have multiple authors, and authors can write multiple books. Create:

1. An `authors` table with:
   - `id`: Primary key
   - `first_name`: VARCHAR(50), required
   - `last_name`: VARCHAR(50), required
   - `birth_year`: INTEGER
   - `country`: VARCHAR(50)

2. A junction table `book_authors` with:
   - `book_id`: Foreign key to books(id)
   - `author_id`: Foreign key to authors(id)
   - Primary key on (book_id, author_id)

```sql
-- Your code here
```

### Task 4: Insert Related Data

1. Insert at least 5 authors into the `authors` table
2. Link books to their authors in the `book_authors` table
3. Create at least 5 loan records in the `loans` table

```sql
-- Your code here
```

### Task 5: INNER JOIN Queries

Write queries using INNER JOIN:

1. List all books with their category names
2. Show all active loans with book titles and member names
3. Display all books with their authors (using the junction table)
4. Show members who have active loans
5. List books in the "Fiction" category

```sql
-- Your code here
```

### Task 6: LEFT JOIN Queries

Write queries using LEFT JOIN:

1. List all books and their categories (including books without categories)
2. Show all members and their loan count (including members with no loans)
3. Display all categories and count of books in each (including empty categories)
4. List all books and their loan status (including never-borrowed books)

```sql
-- Your code here
```

### Task 7: Multiple Joins

Write complex queries joining 3+ tables:

1. Show loan details with book title, member name, and category
2. List all books with their authors and categories
3. Display members with their borrowed books and due dates
4. Show overdue loans with all relevant details
5. List authors with the books they've written and categories

```sql
-- Your code here
```

### Task 8: Aggregation with Joins

Combine joins with aggregate functions:

1. Count how many books each member has borrowed
2. Find the most popular book (most loans)
3. Calculate total revenue per category (sum of book prices)
4. Show authors with the most books
5. Find members who have never borrowed a book

```sql
-- Your code here
```

### Task 9: Subqueries with Joins

Write queries using subqueries:

1. Find books that have never been borrowed
2. List members who have borrowed more than 2 books
3. Show categories with more than 3 books
4. Find the most expensive book in each category
5. List authors whose books have been borrowed

```sql
-- Your code here
```

### Task 10: Update and Delete with Joins

Perform operations across related tables:

1. Mark all loans as 'overdue' where due_date has passed and status is 'active'
2. Update book stock status based on active loans
3. Delete authors who have no books (be careful with foreign keys!)

```sql
-- Your code here
```

## 🧪 Testing Your Work

Verify your relationships:

```sql
-- Check foreign key constraints
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';

-- Test a complex join
SELECT 
    b.title,
    c.name AS category,
    CONCAT(a.first_name, ' ', a.last_name) AS author,
    COUNT(l.id) AS times_borrowed
FROM books b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN book_authors ba ON b.id = ba.book_id
LEFT JOIN authors a ON ba.author_id = a.id
LEFT JOIN loans l ON b.id = l.book_id
GROUP BY b.id, b.title, c.name, a.first_name, a.last_name;
```

## 💡 Bonus Challenges

1. **Self-Referencing Table**: Create a `book_recommendations` table where books can recommend other books

2. **Cascade Operations**: Modify foreign keys to use ON DELETE CASCADE and test the behavior

3. **Cross Join**: Write a query that creates all possible combinations of books and members

4. **FULL OUTER JOIN**: Find all books and members, showing which are connected via loans

5. **Recursive Query**: If you created a hierarchical category system, write a recursive query to show the hierarchy

```sql
-- Bonus challenge code here
```

## 🤔 Reflection Questions

1. What's the difference between INNER JOIN and LEFT JOIN?
2. When would you use a junction table?
3. What happens when you delete a record that has foreign key references?
4. Why is it important to index foreign key columns?
5. How do you decide between one-to-many and many-to-many relationships?

## ✅ Checklist

- [ ] Added foreign key to books table
- [ ] Created loans table with proper relationships
- [ ] Created authors and book_authors tables
- [ ] Inserted related data across all tables
- [ ] Completed all INNER JOIN exercises
- [ ] Completed all LEFT JOIN exercises
- [ ] Completed multiple join queries
- [ ] Completed aggregation with joins
- [ ] Completed subquery exercises
- [ ] Completed update/delete with joins
- [ ] Completed bonus challenges (optional)

## 📝 Relationship Diagram

Draw or describe your database relationships:

```
books ──< loans >── members
  │
  └──< book_authors >── authors
  │
  └── categories
```

---

## Next Steps

Once you've completed this exercise, move on to **Exercise 4: Advanced Queries & Aggregations** where you'll learn complex SQL techniques.

Need help? Check the solution file in `solutions/exercise-03/solution.sql`
