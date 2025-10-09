# Solutions Guide

This directory contains reference solutions for all SQL practice exercises.

## 📝 Important Notes

- **Try the exercises first!** Only refer to solutions after attempting the problems yourself
- Solutions may have multiple correct approaches - yours might be different but still valid
- Use solutions to learn alternative techniques and best practices
- Compare your solution with the reference to understand different approaches

## 📚 Solution Files

### Exercise 1: Database Basics & Table Creation
**File**: `exercise-01-solution.sql`

Covers:
- Creating databases
- Table creation with constraints
- Data types selection
- ALTER TABLE operations
- Index creation
- Bonus: Custom types and additional tables

### Exercise 2: Data Insertion & Querying
**File**: `exercise-02-solution.sql`

Covers:
- INSERT statements (single and multiple rows)
- Basic SELECT queries
- WHERE clause filtering
- Pattern matching with LIKE
- Sorting with ORDER BY
- LIMIT and OFFSET
- UPDATE and DELETE operations
- Aggregate functions (COUNT, AVG, MIN, MAX)
- CASE statements
- String functions

### Exercise 3: Relationships & Joins
**File**: `exercise-03-solution.sql`

Covers:
- Foreign key constraints
- One-to-many relationships
- Many-to-many relationships with junction tables
- INNER JOIN
- LEFT JOIN
- Multiple table joins
- Aggregation with joins
- Subqueries with joins
- CASCADE operations

### Exercise 4: Advanced Queries & Aggregations
**File**: `exercise-04-solution.sql`

Covers:
- GROUP BY and HAVING
- Window functions (RANK, ROW_NUMBER, DENSE_RANK)
- Running totals and moving averages
- Common Table Expressions (CTEs)
- Complex subqueries
- CASE statements for categorization
- Set operations (UNION, INTERSECT, EXCEPT)
- Query optimization with EXPLAIN
- Performance indexing

### Exercise 5: Final Project
**File**: `exercise-05-solution.sql`

A complete e-commerce database implementation including:
- Full schema design
- Sample data
- Business analytics queries
- Stored procedures
- Triggers
- Functions
- Comprehensive reports

## 🎯 How to Use Solutions

### 1. Self-Assessment
```sql
-- First, try the exercise yourself
-- Then compare with solution
-- Note differences and learn from them
```

### 2. Learning Alternative Approaches
```sql
-- Your solution might use a subquery:
SELECT * FROM books 
WHERE price > (SELECT AVG(price) FROM books);

-- Solution might use a window function:
SELECT * FROM (
    SELECT *, AVG(price) OVER() as avg_price 
    FROM books
) sub WHERE price > avg_price;

-- Both are correct! Learn when to use each.
```

### 3. Understanding Best Practices
Solutions demonstrate:
- Proper naming conventions
- Efficient query patterns
- Index usage
- Constraint implementation
- Code organization

## 💡 Tips for Learning

1. **Don't just copy** - Understand why the solution works
2. **Experiment** - Modify solutions to see different outcomes
3. **Compare performance** - Use EXPLAIN ANALYZE on different approaches
4. **Ask questions** - If you don't understand something, research it
5. **Practice variations** - Try similar problems with different data

## 🔍 Common Patterns in Solutions

### Pattern 1: Defensive Programming
```sql
-- Always check before deleting
SELECT * FROM table WHERE condition;  -- Preview
DELETE FROM table WHERE condition;    -- Then delete
```

### Pattern 2: Using CTEs for Readability
```sql
WITH summary AS (
    SELECT category, COUNT(*) as count
    FROM products
    GROUP BY category
)
SELECT * FROM summary WHERE count > 5;
```

### Pattern 3: Proper Join Order
```sql
-- Start with the main table, then join related tables
SELECT b.title, c.name, a.author_name
FROM books b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN book_authors ba ON b.id = ba.book_id
LEFT JOIN authors a ON ba.author_id = a.id;
```

## 🐛 Debugging Your Solutions

If your solution doesn't match the expected output:

1. **Check data types** - Ensure columns have correct types
2. **Verify constraints** - Check if constraints are properly set
3. **Test incrementally** - Build complex queries step by step
4. **Use EXPLAIN** - Understand query execution
5. **Check for NULLs** - Handle NULL values appropriately

## 📊 Performance Comparison

Solutions include performance considerations:

```sql
-- Slower: Subquery in SELECT
SELECT 
    title,
    (SELECT COUNT(*) FROM loans WHERE book_id = books.id) as loan_count
FROM books;

-- Faster: JOIN with GROUP BY
SELECT 
    b.title,
    COUNT(l.id) as loan_count
FROM books b
LEFT JOIN loans l ON b.id = l.book_id
GROUP BY b.id, b.title;
```

## 🎓 Advanced Topics Covered

- **Normalization**: Examples of 1NF, 2NF, 3NF
- **Denormalization**: When and why to denormalize
- **Indexing strategies**: B-tree, Hash, GiST indexes
- **Query optimization**: Rewriting for performance
- **Transaction handling**: ACID properties
- **Concurrency**: Handling simultaneous operations

## 📖 Additional Resources

- PostgreSQL Official Docs: https://www.postgresql.org/docs/
- SQL Style Guide: https://www.sqlstyle.guide/
- Explain Visualizer: https://explain.dalibo.com/
- SQL Fiddle: http://sqlfiddle.com/

## ✅ Verification Checklist

After reviewing solutions, ensure you understand:

- [ ] Why specific data types were chosen
- [ ] How constraints enforce data integrity
- [ ] When to use different types of joins
- [ ] How window functions differ from GROUP BY
- [ ] When to use CTEs vs subqueries
- [ ] How indexes improve performance
- [ ] Best practices for query optimization

---

Remember: The goal is not to match the solution exactly, but to understand the concepts and apply them effectively. Keep practicing! 🚀
