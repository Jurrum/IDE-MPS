-- Exercise 4: Advanced Queries & Aggregations
-- Make sure you're connected to library_db
-- \c library_db

-- ============================================
-- Task 1: GROUP BY Fundamentals
-- ============================================

-- 1.1: Count books in each category


-- 1.2: Average book price by publication decade


-- 1.3: Count active vs inactive members


-- 1.4: Total loans per member


-- 1.5: Number of books per author



-- ============================================
-- Task 2: HAVING Clause
-- ============================================

-- 2.1: Categories with more than 2 books


-- 2.2: Members who borrowed more than 3 books


-- 2.3: Authors with more than 1 book


-- 2.4: Categories where average price > $13


-- 2.5: Books borrowed more than twice



-- ============================================
-- Task 3: Window Functions - Ranking
-- ============================================

-- 3.1: Rank books by price within category


-- 3.2: Row numbers for members by join date


-- 3.3: Top 3 most expensive books using DENSE_RANK


-- 3.4: Rank authors by number of books


-- 3.5: Percentile rank of book prices



-- ============================================
-- Task 4: Window Functions - Aggregates
-- ============================================

-- 4.1: Running total of book prices by publication year


-- 4.2: Moving average of book prices (3-book window)


-- 4.3: Cumulative count of members by join date


-- 4.4: Each book's price vs category average


-- 4.5: Percentage of total loans for each book



-- ============================================
-- Task 5: Common Table Expressions (CTEs)
-- ============================================

-- 5.1: Books above average price with categories


-- 5.2: Member loan statistics and top borrowers


-- 5.3: Multiple CTEs for book analysis


-- 5.4: Recursive CTE (if applicable)


-- 5.5: Year-over-year membership growth



-- ============================================
-- Task 6: Complex Subqueries
-- ============================================

-- 6.1: Books more expensive than category average


-- 6.2: Members who borrowed most popular book


-- 6.3: Categories with no books on loan


-- 6.4: Authors with above-average book prices


-- 6.5: Books borrowed by more than 2 members



-- ============================================
-- Task 7: CASE Statements
-- ============================================

-- 7.1: Categorize books by era


-- 7.2: Label members by activity level


-- 7.3: Create price tier system


-- 7.4: Classify loan status


-- 7.5: Rate book popularity



-- ============================================
-- Task 8: Advanced Joins and Aggregations
-- ============================================

-- 8.1: Category statistics


-- 8.2: Member loan summary


-- 8.3: Author statistics


-- 8.4: Monthly loan statistics


-- 8.5: Loans by day of week



-- ============================================
-- Task 9: Set Operations
-- ============================================

-- 9.1: Members who borrowed fiction OR classics (UNION)


-- 9.2: Members who borrowed fiction AND classics (INTERSECT)


-- 9.3: Books in stock but never borrowed (EXCEPT)


-- 9.4: Unified view of members and authors


-- 9.5: Categories with books but no active loans



-- ============================================
-- Task 10: Performance Optimization
-- ============================================

-- 10.1: Use EXPLAIN on a complex query


-- 10.2: Create performance indexes


-- 10.3: Rewrite subquery as JOIN


-- 10.4: Use EXPLAIN ANALYZE


-- 10.5: Optimize a slow query



-- ============================================
-- BONUS CHALLENGES
-- ============================================

-- Bonus 1: Pivot table for loans by category and month


-- Bonus 2: Cohort analysis


-- Bonus 3: Percentile analysis


-- Bonus 4: Time series moving average


-- Bonus 5: LAG/LEAD window functions



-- ============================================
-- VERIFICATION QUERIES
-- ============================================

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
