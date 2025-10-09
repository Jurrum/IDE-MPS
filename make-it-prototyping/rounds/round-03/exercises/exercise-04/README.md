# Exercise 4: Advanced Queries & Aggregations

## 🎯 Learning Goals

- Master GROUP BY and HAVING clauses
- Use window functions
- Write complex subqueries
- Work with CTEs (Common Table Expressions)
- Perform advanced data analysis
- Optimize query performance

## 📚 Prerequisites

- Completed Exercises 1-3
- Understanding of joins and basic aggregations
- Familiarity with subqueries

## 🔨 Tasks

### Task 1: GROUP BY Fundamentals

Write queries using GROUP BY:

1. Count the number of books in each category
2. Calculate average book price by publication decade
3. Count active vs inactive members
4. Find total number of loans per member
5. Show number of books per author

```sql
-- Your code here
```

### Task 2: HAVING Clause

Use HAVING to filter aggregated results:

1. Find categories with more than 2 books
2. Show members who have borrowed more than 3 books
3. List authors who have written more than 1 book
4. Find categories where average book price is above $13
5. Show books that have been borrowed more than twice

```sql
-- Your code here
```

### Task 3: Window Functions - Ranking

Use window functions for ranking:

1. Rank books by price within each category
2. Show row numbers for members ordered by join date
3. Find the top 3 most expensive books using DENSE_RANK
4. Rank authors by number of books written
5. Show percentile rank of book prices

```sql
-- Your code here
```

### Task 4: Window Functions - Aggregates

Use window functions for running calculations:

1. Calculate running total of book prices ordered by publication year
2. Show moving average of book prices (3-book window)
3. Calculate cumulative count of members by join date
4. Show each book's price compared to category average
5. Calculate percentage of total loans for each book

```sql
-- Your code here
```

### Task 5: Common Table Expressions (CTEs)

Write queries using WITH clauses:

1. Use CTE to find books above average price, then join with categories
2. Create a CTE for member loan statistics, then find top borrowers
3. Use multiple CTEs to analyze book popularity and pricing
4. Create a recursive CTE for a category hierarchy (if you have one)
5. Use CTE to calculate year-over-year growth in library membership

```sql
-- Your code here
```

### Task 6: Complex Subqueries

Write advanced subqueries:

1. Find books more expensive than the average in their category
2. List members who borrowed the most popular book
3. Show categories with no books currently on loan
4. Find authors whose average book price is above overall average
5. List books that have been borrowed by more than 2 different members

```sql
-- Your code here
```

### Task 7: CASE Statements

Use CASE for conditional logic:

1. Categorize books as "New" (after 2000), "Modern" (1950-2000), or "Classic" (before 1950)
2. Label members as "Active" (>3 loans), "Moderate" (1-3 loans), or "Inactive" (0 loans)
3. Create a price tier system for books
4. Classify loans as "On Time", "Due Soon" (< 3 days), or "Overdue"
5. Rate book popularity based on loan count

```sql
-- Your code here
```

### Task 8: Advanced Joins and Aggregations

Combine multiple concepts:

1. Show each category with total books, average price, and most expensive book
2. List members with their total loans, books currently borrowed, and overdue count
3. Display authors with book count, average price, and total times borrowed
4. Create a report showing monthly loan statistics
5. Analyze which day of the week has most loans

```sql
-- Your code here
```

### Task 9: Set Operations

Use UNION, INTERSECT, and EXCEPT:

1. Combine lists of members who borrowed fiction OR classics
2. Find members who borrowed both fiction AND classics (INTERSECT)
3. List books in stock but never borrowed (EXCEPT)
4. Create a unified view of all people (members and authors)
5. Find categories that have books but no active loans

```sql
-- Your code here
```

### Task 10: Performance Optimization

Analyze and optimize queries:

1. Use EXPLAIN to analyze a complex join query
2. Create appropriate indexes for frequently queried columns
3. Rewrite a subquery as a JOIN for better performance
4. Use EXPLAIN ANALYZE to compare query execution times
5. Identify and fix a slow query in your database

```sql
-- Your code here
```

## 🧪 Testing Your Work

Run these analytical queries to verify:

```sql
-- Comprehensive library statistics
WITH book_stats AS (
    SELECT 
        c.name AS category,
        COUNT(b.id) AS book_count,
        AVG(b.price) AS avg_price,
        COUNT(l.id) AS total_loans
    FROM categories c
    LEFT JOIN books b ON c.id = b.category_id
    LEFT JOIN loans l ON b.id = l.book_id
    GROUP BY c.id, c.name
)
SELECT * FROM book_stats
ORDER BY total_loans DESC;

-- Member engagement analysis
SELECT 
    m.first_name,
    m.last_name,
    COUNT(l.id) AS total_loans,
    COUNT(CASE WHEN l.status = 'active' THEN 1 END) AS active_loans,
    COUNT(CASE WHEN l.status = 'overdue' THEN 1 END) AS overdue_loans,
    CASE 
        WHEN COUNT(l.id) > 3 THEN 'Active'
        WHEN COUNT(l.id) BETWEEN 1 AND 3 THEN 'Moderate'
        ELSE 'Inactive'
    END AS engagement_level
FROM members m
LEFT JOIN loans l ON m.id = l.member_id
GROUP BY m.id, m.first_name, m.last_name
ORDER BY total_loans DESC;
```

## 💡 Bonus Challenges

1. **Pivot Table**: Create a pivot showing loan counts by category and month

2. **Cohort Analysis**: Analyze member retention by join month

3. **Percentile Analysis**: Find books in the 90th percentile of price and loan count

4. **Time Series**: Calculate 7-day moving average of daily loans

5. **Advanced Window**: Use LAG/LEAD to compare each book's price to the previous/next

```sql
-- Bonus challenge code here
```

## 🤔 Reflection Questions

1. When should you use a CTE vs a subquery?
2. What's the difference between WHERE and HAVING?
3. How do window functions differ from GROUP BY?
4. When would you use UNION vs UNION ALL?
5. What factors affect query performance?

## ✅ Checklist

- [ ] Completed all GROUP BY exercises
- [ ] Completed all HAVING clause exercises
- [ ] Mastered ranking window functions
- [ ] Mastered aggregate window functions
- [ ] Created complex CTEs
- [ ] Wrote advanced subqueries
- [ ] Used CASE statements effectively
- [ ] Combined joins with aggregations
- [ ] Used set operations (UNION, INTERSECT, EXCEPT)
- [ ] Analyzed and optimized query performance
- [ ] Completed bonus challenges (optional)

## 📊 Query Performance Log

Track your optimization results:

```
Example:
Query: SELECT with multiple joins
Before optimization: 245ms
After adding index: 12ms
Improvement: 95%
```

---

## Next Steps

Once you've completed this exercise, move on to **Exercise 5: Final Project** where you'll design and build a complete database system from scratch!

Need help? Check the solution file in `solutions/exercise-04/solution.sql`
