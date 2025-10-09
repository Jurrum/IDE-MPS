# Exercise 2: Data Insertion & Querying

## 🎯 Learning Goals

- Insert data into tables
- Query data using SELECT statements
- Filter results with WHERE clauses
- Sort and limit results
- Update and delete records
- Practice basic DML (Data Manipulation Language)

## 📚 Prerequisites

- Completed Exercise 1
- `library_db` database with tables created

## 🔨 Tasks

### Task 1: Insert Books

Insert the following books into your `books` table:

1. "The Great Gatsby" by F. Scott Fitzgerald, ISBN: 9780743273565, published 1925, 180 pages, $12.99
2. "To Kill a Mockingbird" by Harper Lee, ISBN: 9780061120084, published 1960, 324 pages, $14.99
3. "1984" by George Orwell, ISBN: 9780451524935, published 1949, 328 pages, $13.99
4. "Pride and Prejudice" by Jane Austen, ISBN: 9780141439518, published 1813, 432 pages, $11.99
5. "The Catcher in the Rye" by J.D. Salinger, ISBN: 9780316769488, published 1951, 277 pages, $15.99

```sql
-- Your code here
```

### Task 2: Insert Members

Add these library members:

1. John Smith, email: john.smith@email.com, phone: 555-0101, joined today
2. Emma Johnson, email: emma.j@email.com, phone: 555-0102, joined today
3. Michael Brown, email: m.brown@email.com, phone: 555-0103, joined today
4. Sarah Davis, email: sarah.d@email.com, phone: 555-0104, joined today
5. David Wilson, email: d.wilson@email.com, phone: 555-0105, joined today

```sql
-- Your code here
```

### Task 3: Insert Categories

Add these book categories:

1. Fiction - "Literary works of imagination"
2. Classic - "Timeless literary works"
3. Dystopian - "Fiction set in undesirable societies"
4. Romance - "Stories focused on romantic relationships"
5. Coming of Age - "Stories about character growth and maturity"

```sql
-- Your code here
```

### Task 4: Basic SELECT Queries

Write queries to:

1. Select all books
2. Select only book titles and authors
3. Select all members' first and last names
4. Select all category names

```sql
-- Your code here
```

### Task 5: Filtering with WHERE

Write queries to find:

1. Books published after 1950
2. Books priced under $14
3. Books with more than 300 pages
4. Members with email containing "email.com"
5. Books by "George Orwell"

```sql
-- Your code here
```

### Task 6: Advanced Filtering

Write queries using multiple conditions:

1. Books published between 1900 and 1960
2. Books that are in stock AND cost less than $15
3. Books with more than 200 pages OR published before 1900
4. Members whose first name starts with 'S'
5. Books with ISBN starting with "978"

```sql
-- Your code here
```

### Task 7: Sorting and Limiting

Write queries to:

1. List all books sorted by price (lowest to highest)
2. List all books sorted by publication year (newest first)
3. Show the 3 most expensive books
4. Show the 5 oldest books
5. List members alphabetically by last name

```sql
-- Your code here
```

### Task 8: Update Records

Perform these updates:

1. Increase all book prices by 10%
2. Update "The Great Gatsby" to be out of stock
3. Change John Smith's email to "johnsmith@newmail.com"
4. Update all books published before 1950 to have language 'English (Classic)'
5. Set membership_active to FALSE for member with email "d.wilson@email.com"

```sql
-- Your code here
```

### Task 9: Delete Records

Perform these deletions (be careful!):

1. Delete the category with name "Coming of Age"
2. Delete all books that are out of stock
3. Delete members who joined more than 30 days ago (there shouldn't be any yet)

```sql
-- Your code here
```

### Task 10: Aggregate Functions

Write queries using aggregate functions:

1. Count total number of books
2. Find the average price of all books
3. Find the most expensive book price
4. Find the cheapest book price
5. Count how many members are active

```sql
-- Your code here
```

## 🧪 Testing Your Work

Verify your data with these queries:

```sql
-- Check all books
SELECT * FROM books;

-- Check all members
SELECT * FROM members;

-- Check all categories
SELECT * FROM categories;

-- Verify counts
SELECT 
    (SELECT COUNT(*) FROM books) as total_books,
    (SELECT COUNT(*) FROM members) as total_members,
    (SELECT COUNT(*) FROM categories) as total_categories;
```

## 💡 Bonus Challenges

1. **Pattern Matching**: Find all books where the title contains the word "The"

2. **NULL Handling**: Insert a book without a publication year, then write a query to find all books with missing publication years

3. **DISTINCT Values**: Find all unique authors in the books table

4. **CASE Statements**: Create a query that categorizes books as "Cheap" (< $13), "Moderate" ($13-$15), or "Expensive" (> $15)

5. **String Functions**: Write a query that shows member names in uppercase

```sql
-- Bonus challenge code here
```

## 🤔 Reflection Questions

1. What's the difference between WHERE and HAVING?
2. Why should you always use WHERE when deleting or updating records?
3. What happens if you try to insert duplicate values in a UNIQUE column?
4. How does ORDER BY affect query performance?
5. What's the difference between COUNT(*) and COUNT(column_name)?

## ✅ Checklist

- [ ] Inserted all books successfully
- [ ] Inserted all members successfully
- [ ] Inserted all categories successfully
- [ ] Completed all basic SELECT queries
- [ ] Completed all WHERE clause exercises
- [ ] Completed sorting and limiting exercises
- [ ] Performed all UPDATE operations
- [ ] Performed all DELETE operations
- [ ] Completed aggregate function queries
- [ ] Completed bonus challenges (optional)

## 📝 Query Results Log

Keep track of interesting query results:

```
Example:
Query: SELECT AVG(price) FROM books;
Result: $13.79
```

---

## Next Steps

Once you've completed this exercise, move on to **Exercise 3: Relationships & Joins** where you'll learn to connect tables and work with foreign keys.

Need help? Check the solution file in `solutions/exercise-02/solution.sql`
