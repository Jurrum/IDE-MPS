-- ============================================
-- EXERCISE 4 SOLUTION
-- Advanced Queries & Aggregations
-- ============================================

-- Make sure you're connected to library_db
-- \c library_db

-- ============================================
-- Task 1: GROUP BY Fundamentals
-- ============================================

-- 1.1: Count books in each category
SELECT 
    c.name AS category,
    COUNT(b.id) AS book_count
FROM categories c
LEFT JOIN books b ON c.id = b.category_id
GROUP BY c.id, c.name
ORDER BY book_count DESC;

-- 1.2: Average book price by publication decade
SELECT 
    (publication_year / 10) * 10 AS decade,
    COUNT(*) AS book_count,
    ROUND(AVG(price), 2) AS avg_price
FROM books
WHERE publication_year IS NOT NULL
GROUP BY decade
ORDER BY decade;

-- 1.3: Count active vs inactive members
SELECT 
    membership_active,
    COUNT(*) AS member_count
FROM members
GROUP BY membership_active;

-- 1.4: Total loans per member
SELECT 
    m.first_name,
    m.last_name,
    COUNT(l.id) AS total_loans
FROM members m
LEFT JOIN loans l ON m.id = l.member_id
GROUP BY m.id, m.first_name, m.last_name
ORDER BY total_loans DESC;

-- 1.5: Number of books per author
SELECT 
    CONCAT(a.first_name, ' ', a.last_name) AS author_name,
    COUNT(ba.book_id) AS book_count
FROM authors a
LEFT JOIN book_authors ba ON a.id = ba.author_id
GROUP BY a.id, a.first_name, a.last_name
ORDER BY book_count DESC;

-- ============================================
-- Task 2: HAVING Clause
-- ============================================

-- 2.1: Categories with more than 2 books
SELECT 
    c.name AS category,
    COUNT(b.id) AS book_count
FROM categories c
LEFT JOIN books b ON c.id = b.category_id
GROUP BY c.id, c.name
HAVING COUNT(b.id) > 2;

-- 2.2: Members who borrowed more than 3 books
SELECT 
    m.first_name,
    m.last_name,
    COUNT(l.id) AS loan_count
FROM members m
INNER JOIN loans l ON m.id = l.member_id
GROUP BY m.id, m.first_name, m.last_name
HAVING COUNT(l.id) > 3;

-- 2.3: Authors with more than 1 book
SELECT 
    CONCAT(a.first_name, ' ', a.last_name) AS author_name,
    COUNT(ba.book_id) AS book_count
FROM authors a
INNER JOIN book_authors ba ON a.id = ba.author_id
GROUP BY a.id, a.first_name, a.last_name
HAVING COUNT(ba.book_id) > 1;

-- 2.4: Categories where average price > $13
SELECT 
    c.name AS category,
    ROUND(AVG(b.price), 2) AS avg_price,
    COUNT(b.id) AS book_count
FROM categories c
INNER JOIN books b ON c.id = b.category_id
GROUP BY c.id, c.name
HAVING AVG(b.price) > 13;

-- 2.5: Books borrowed more than twice
SELECT 
    b.title,
    b.author,
    COUNT(l.id) AS loan_count
FROM books b
INNER JOIN loans l ON b.id = l.book_id
GROUP BY b.id, b.title, b.author
HAVING COUNT(l.id) > 2;

-- ============================================
-- Task 3: Window Functions - Ranking
-- ============================================

-- 3.1: Rank books by price within category
SELECT 
    b.title,
    c.name AS category,
    b.price,
    RANK() OVER (PARTITION BY c.id ORDER BY b.price DESC) AS price_rank
FROM books b
LEFT JOIN categories c ON b.category_id = c.id
ORDER BY c.name, price_rank;

-- 3.2: Row numbers for members by join date
SELECT 
    ROW_NUMBER() OVER (ORDER BY join_date) AS row_num,
    first_name,
    last_name,
    join_date
FROM members
ORDER BY join_date;

-- 3.3: Top 3 most expensive books using DENSE_RANK
SELECT * FROM (
    SELECT 
        title,
        author,
        price,
        DENSE_RANK() OVER (ORDER BY price DESC) AS price_rank
    FROM books
) ranked
WHERE price_rank <= 3;

-- 3.4: Rank authors by number of books
SELECT 
    CONCAT(a.first_name, ' ', a.last_name) AS author_name,
    COUNT(ba.book_id) AS book_count,
    RANK() OVER (ORDER BY COUNT(ba.book_id) DESC) AS author_rank
FROM authors a
LEFT JOIN book_authors ba ON a.id = ba.author_id
GROUP BY a.id, a.first_name, a.last_name
ORDER BY author_rank;

-- 3.5: Percentile rank of book prices
SELECT 
    title,
    price,
    ROUND(PERCENT_RANK() OVER (ORDER BY price)::numeric, 2) AS percentile_rank
FROM books
ORDER BY price;

-- ============================================
-- Task 4: Window Functions - Aggregates
-- ============================================

-- 4.1: Running total of book prices by publication year
SELECT 
    title,
    publication_year,
    price,
    SUM(price) OVER (ORDER BY publication_year, title) AS running_total
FROM books
WHERE publication_year IS NOT NULL
ORDER BY publication_year, title;

-- 4.2: Moving average of book prices (3-book window)
SELECT 
    title,
    price,
    ROUND(AVG(price) OVER (
        ORDER BY id 
        ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
    ), 2) AS moving_avg_3
FROM books
ORDER BY id;

-- 4.3: Cumulative count of members by join date
SELECT 
    first_name,
    last_name,
    join_date,
    COUNT(*) OVER (ORDER BY join_date) AS cumulative_members
FROM members
ORDER BY join_date;

-- 4.4: Each book's price vs category average
SELECT 
    b.title,
    c.name AS category,
    b.price,
    ROUND(AVG(b.price) OVER (PARTITION BY c.id), 2) AS category_avg,
    ROUND(b.price - AVG(b.price) OVER (PARTITION BY c.id), 2) AS diff_from_avg
FROM books b
LEFT JOIN categories c ON b.category_id = c.id
ORDER BY c.name, b.price DESC;

-- 4.5: Percentage of total loans for each book
SELECT 
    b.title,
    COUNT(l.id) AS loan_count,
    ROUND(
        100.0 * COUNT(l.id) / SUM(COUNT(l.id)) OVER (),
        2
    ) AS percentage_of_total
FROM books b
LEFT JOIN loans l ON b.id = l.book_id
GROUP BY b.id, b.title
ORDER BY loan_count DESC;

-- ============================================
-- Task 5: Common Table Expressions (CTEs)
-- ============================================

-- 5.1: Books above average price with categories
WITH avg_price AS (
    SELECT AVG(price) AS average FROM books
)
SELECT 
    b.title,
    b.price,
    c.name AS category,
    ap.average AS overall_avg
FROM books b
LEFT JOIN categories c ON b.category_id = c.id
CROSS JOIN avg_price ap
WHERE b.price > ap.average
ORDER BY b.price DESC;

-- 5.2: Member loan statistics and top borrowers
WITH member_stats AS (
    SELECT 
        m.id,
        m.first_name,
        m.last_name,
        COUNT(l.id) AS total_loans,
        COUNT(CASE WHEN l.status = 'active' THEN 1 END) AS active_loans,
        COUNT(CASE WHEN l.status = 'returned' THEN 1 END) AS returned_loans
    FROM members m
    LEFT JOIN loans l ON m.id = l.member_id
    GROUP BY m.id, m.first_name, m.last_name
)
SELECT *
FROM member_stats
WHERE total_loans > 0
ORDER BY total_loans DESC;

-- 5.3: Multiple CTEs for book analysis
WITH book_loans AS (
    SELECT 
        book_id,
        COUNT(*) AS loan_count
    FROM loans
    GROUP BY book_id
),
book_prices AS (
    SELECT 
        id,
        price,
        CASE 
            WHEN price < 13 THEN 'Budget'
            WHEN price BETWEEN 13 AND 15 THEN 'Standard'
            ELSE 'Premium'
        END AS price_tier
    FROM books
)
SELECT 
    b.title,
    b.author,
    bp.price,
    bp.price_tier,
    COALESCE(bl.loan_count, 0) AS times_borrowed
FROM books b
LEFT JOIN book_loans bl ON b.id = bl.book_id
LEFT JOIN book_prices bp ON b.id = bp.id
ORDER BY times_borrowed DESC, bp.price DESC;

-- 5.4: Recursive CTE for category hierarchy (if you have parent categories)
-- This assumes categories have a parent_category_id column
-- WITH RECURSIVE category_tree AS (
--     SELECT id, name, parent_category_id, 1 AS level
--     FROM categories
--     WHERE parent_category_id IS NULL
--     UNION ALL
--     SELECT c.id, c.name, c.parent_category_id, ct.level + 1
--     FROM categories c
--     INNER JOIN category_tree ct ON c.parent_category_id = ct.id
-- )
-- SELECT * FROM category_tree ORDER BY level, name;

-- 5.5: Year-over-year membership growth
WITH monthly_joins AS (
    SELECT 
        DATE_TRUNC('month', join_date) AS month,
        COUNT(*) AS new_members
    FROM members
    GROUP BY DATE_TRUNC('month', join_date)
)
SELECT 
    month,
    new_members,
    LAG(new_members) OVER (ORDER BY month) AS prev_month,
    new_members - LAG(new_members) OVER (ORDER BY month) AS growth
FROM monthly_joins
ORDER BY month;

-- ============================================
-- Task 6: Complex Subqueries
-- ============================================

-- 6.1: Books more expensive than category average
SELECT 
    b.title,
    c.name AS category,
    b.price,
    (SELECT ROUND(AVG(price), 2) FROM books WHERE category_id = b.category_id) AS category_avg
FROM books b
LEFT JOIN categories c ON b.category_id = c.id
WHERE b.price > (SELECT AVG(price) FROM books WHERE category_id = b.category_id);

-- 6.2: Members who borrowed the most popular book
SELECT 
    m.first_name,
    m.last_name,
    b.title AS borrowed_book
FROM members m
INNER JOIN loans l ON m.id = l.member_id
INNER JOIN books b ON l.book_id = b.id
WHERE b.id = (
    SELECT book_id
    FROM loans
    GROUP BY book_id
    ORDER BY COUNT(*) DESC
    LIMIT 1
);

-- 6.3: Categories with no books currently on loan
SELECT c.name, c.description
FROM categories c
WHERE c.id NOT IN (
    SELECT DISTINCT b.category_id
    FROM books b
    INNER JOIN loans l ON b.id = l.book_id
    WHERE l.status = 'active' AND b.category_id IS NOT NULL
);

-- 6.4: Authors whose average book price is above overall average
SELECT 
    CONCAT(a.first_name, ' ', a.last_name) AS author_name,
    ROUND(AVG(b.price), 2) AS avg_book_price,
    (SELECT ROUND(AVG(price), 2) FROM books) AS overall_avg
FROM authors a
INNER JOIN book_authors ba ON a.id = ba.author_id
INNER JOIN books b ON ba.book_id = b.id
GROUP BY a.id, a.first_name, a.last_name
HAVING AVG(b.price) > (SELECT AVG(price) FROM books);

-- 6.5: Books borrowed by more than 2 different members
SELECT 
    b.title,
    b.author,
    COUNT(DISTINCT l.member_id) AS unique_borrowers
FROM books b
INNER JOIN loans l ON b.id = l.book_id
GROUP BY b.id, b.title, b.author
HAVING COUNT(DISTINCT l.member_id) > 2;

-- ============================================
-- Task 7: CASE Statements
-- ============================================

-- 7.1: Categorize books by era
SELECT 
    title,
    author,
    publication_year,
    CASE 
        WHEN publication_year >= 2000 THEN 'New'
        WHEN publication_year BETWEEN 1950 AND 1999 THEN 'Modern'
        WHEN publication_year < 1950 THEN 'Classic'
        ELSE 'Unknown'
    END AS era
FROM books
ORDER BY publication_year DESC;

-- 7.2: Label members by activity level
SELECT 
    m.first_name,
    m.last_name,
    COUNT(l.id) AS loan_count,
    CASE 
        WHEN COUNT(l.id) > 3 THEN 'Active'
        WHEN COUNT(l.id) BETWEEN 1 AND 3 THEN 'Moderate'
        ELSE 'Inactive'
    END AS activity_level
FROM members m
LEFT JOIN loans l ON m.id = l.member_id
GROUP BY m.id, m.first_name, m.last_name
ORDER BY loan_count DESC;

-- 7.3: Create price tier system
SELECT 
    title,
    price,
    CASE 
        WHEN price < 12 THEN 'Budget ($0-$11.99)'
        WHEN price < 14 THEN 'Standard ($12-$13.99)'
        WHEN price < 16 THEN 'Premium ($14-$15.99)'
        ELSE 'Luxury ($16+)'
    END AS price_tier
FROM books
ORDER BY price;

-- 7.4: Classify loan status
SELECT 
    l.id,
    b.title,
    m.first_name || ' ' || m.last_name AS member,
    l.due_date,
    CASE 
        WHEN l.status = 'returned' THEN 'Returned'
        WHEN l.status = 'overdue' THEN 'Overdue'
        WHEN l.due_date < CURRENT_DATE THEN 'Overdue (needs update)'
        WHEN l.due_date - CURRENT_DATE <= 3 THEN 'Due Soon'
        ELSE 'On Time'
    END AS loan_status
FROM loans l
INNER JOIN books b ON l.book_id = b.id
INNER JOIN members m ON l.member_id = m.id
ORDER BY l.due_date;

-- 7.5: Rate book popularity
SELECT 
    b.title,
    COUNT(l.id) AS loan_count,
    CASE 
        WHEN COUNT(l.id) >= 5 THEN 'Very Popular'
        WHEN COUNT(l.id) >= 3 THEN 'Popular'
        WHEN COUNT(l.id) >= 1 THEN 'Moderate'
        ELSE 'Not Borrowed'
    END AS popularity_rating
FROM books b
LEFT JOIN loans l ON b.id = l.book_id
GROUP BY b.id, b.title
ORDER BY loan_count DESC;

-- ============================================
-- Task 8: Advanced Joins and Aggregations
-- ============================================

-- 8.1: Category statistics
SELECT 
    c.name AS category,
    COUNT(b.id) AS total_books,
    ROUND(AVG(b.price), 2) AS avg_price,
    MAX(b.price) AS max_price,
    MIN(b.price) AS min_price,
    COUNT(l.id) AS total_loans
FROM categories c
LEFT JOIN books b ON c.id = b.category_id
LEFT JOIN loans l ON b.id = l.book_id
GROUP BY c.id, c.name
ORDER BY total_loans DESC;

-- 8.2: Member loan summary
SELECT 
    m.first_name,
    m.last_name,
    COUNT(l.id) AS total_loans,
    COUNT(CASE WHEN l.status = 'active' THEN 1 END) AS currently_borrowed,
    COUNT(CASE WHEN l.status = 'overdue' THEN 1 END) AS overdue_count,
    COUNT(CASE WHEN l.status = 'returned' THEN 1 END) AS returned_count
FROM members m
LEFT JOIN loans l ON m.id = l.member_id
GROUP BY m.id, m.first_name, m.last_name
ORDER BY total_loans DESC;

-- 8.3: Author statistics
SELECT 
    CONCAT(a.first_name, ' ', a.last_name) AS author_name,
    a.country,
    COUNT(DISTINCT ba.book_id) AS book_count,
    ROUND(AVG(b.price), 2) AS avg_price,
    COUNT(l.id) AS total_borrows
FROM authors a
LEFT JOIN book_authors ba ON a.id = ba.author_id
LEFT JOIN books b ON ba.book_id = b.id
LEFT JOIN loans l ON b.id = l.book_id
GROUP BY a.id, a.first_name, a.last_name, a.country
ORDER BY total_borrows DESC;

-- 8.4: Monthly loan statistics
SELECT 
    DATE_TRUNC('month', loan_date) AS month,
    COUNT(*) AS total_loans,
    COUNT(DISTINCT member_id) AS unique_borrowers,
    COUNT(DISTINCT book_id) AS unique_books
FROM loans
GROUP BY DATE_TRUNC('month', loan_date)
ORDER BY month DESC;

-- 8.5: Loans by day of week
SELECT 
    TO_CHAR(loan_date, 'Day') AS day_of_week,
    EXTRACT(DOW FROM loan_date) AS day_number,
    COUNT(*) AS loan_count
FROM loans
GROUP BY day_of_week, day_number
ORDER BY day_number;

-- ============================================
-- Task 9: Set Operations
-- ============================================

-- 9.1: Members who borrowed fiction OR classics (UNION)
SELECT DISTINCT m.first_name, m.last_name, 'Fiction' AS category
FROM members m
INNER JOIN loans l ON m.id = l.member_id
INNER JOIN books b ON l.book_id = b.id
INNER JOIN categories c ON b.category_id = c.id
WHERE c.name = 'Fiction'
UNION
SELECT DISTINCT m.first_name, m.last_name, 'Classic' AS category
FROM members m
INNER JOIN loans l ON m.id = l.member_id
INNER JOIN books b ON l.book_id = b.id
INNER JOIN categories c ON b.category_id = c.id
WHERE c.name = 'Classic';

-- 9.2: Members who borrowed fiction AND classics (INTERSECT)
SELECT m.first_name, m.last_name
FROM members m
INNER JOIN loans l ON m.id = l.member_id
INNER JOIN books b ON l.book_id = b.id
INNER JOIN categories c ON b.category_id = c.id
WHERE c.name = 'Fiction'
INTERSECT
SELECT m.first_name, m.last_name
FROM members m
INNER JOIN loans l ON m.id = l.member_id
INNER JOIN books b ON l.book_id = b.id
INNER JOIN categories c ON b.category_id = c.id
WHERE c.name = 'Classic';

-- 9.3: Books in stock but never borrowed (EXCEPT)
SELECT id, title, author FROM books WHERE in_stock = TRUE
EXCEPT
SELECT DISTINCT b.id, b.title, b.author 
FROM books b
INNER JOIN loans l ON b.id = l.book_id;

-- 9.4: Unified view of members and authors
SELECT first_name, last_name, 'Member' AS type, join_date::text AS date_info
FROM members
UNION ALL
SELECT first_name, last_name, 'Author' AS type, birth_year::text AS date_info
FROM authors
ORDER BY last_name, first_name;

-- 9.5: Categories with books but no active loans
SELECT c.id, c.name FROM categories c
WHERE c.id IN (SELECT DISTINCT category_id FROM books WHERE category_id IS NOT NULL)
EXCEPT
SELECT DISTINCT b.category_id, c.name
FROM books b
INNER JOIN loans l ON b.id = l.book_id
INNER JOIN categories c ON b.category_id = c.id
WHERE l.status = 'active';

-- ============================================
-- Task 10: Performance Optimization
-- ============================================

-- 10.1: Use EXPLAIN on a complex query
EXPLAIN 
SELECT 
    b.title,
    c.name AS category,
    COUNT(l.id) AS loan_count
FROM books b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN loans l ON b.id = l.book_id
GROUP BY b.id, b.title, c.name;

-- 10.2: Create performance indexes
CREATE INDEX IF NOT EXISTS idx_loans_book_id ON loans(book_id);
CREATE INDEX IF NOT EXISTS idx_loans_member_id ON loans(member_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_books_category_id ON books(category_id);
CREATE INDEX IF NOT EXISTS idx_book_authors_book_id ON book_authors(book_id);
CREATE INDEX IF NOT EXISTS idx_book_authors_author_id ON book_authors(author_id);

-- 10.3: Rewrite subquery as JOIN
-- Before (subquery):
-- SELECT * FROM books WHERE id IN (SELECT book_id FROM loans WHERE status = 'active');

-- After (JOIN):
SELECT DISTINCT b.*
FROM books b
INNER JOIN loans l ON b.id = l.book_id
WHERE l.status = 'active';

-- 10.4: Use EXPLAIN ANALYZE
EXPLAIN ANALYZE
SELECT 
    b.title,
    COUNT(l.id) AS loan_count
FROM books b
LEFT JOIN loans l ON b.id = l.book_id
GROUP BY b.id, b.title
ORDER BY loan_count DESC;

-- 10.5: Optimize a slow query
-- Slow version (correlated subquery):
-- SELECT 
--     title,
--     (SELECT COUNT(*) FROM loans WHERE book_id = books.id) AS loan_count
-- FROM books;

-- Optimized version (single JOIN):
SELECT 
    b.title,
    COUNT(l.id) AS loan_count
FROM books b
LEFT JOIN loans l ON b.id = l.book_id
GROUP BY b.id, b.title;

-- ============================================
-- BONUS CHALLENGES
-- ============================================

-- Bonus 1: Pivot table for loans by category and month
SELECT 
    c.name AS category,
    COUNT(CASE WHEN EXTRACT(MONTH FROM l.loan_date) = 1 THEN 1 END) AS jan,
    COUNT(CASE WHEN EXTRACT(MONTH FROM l.loan_date) = 2 THEN 1 END) AS feb,
    COUNT(CASE WHEN EXTRACT(MONTH FROM l.loan_date) = 3 THEN 1 END) AS mar,
    COUNT(*) AS total
FROM categories c
LEFT JOIN books b ON c.id = b.category_id
LEFT JOIN loans l ON b.id = l.book_id
GROUP BY c.id, c.name;

-- Bonus 2: Cohort analysis
WITH member_cohorts AS (
    SELECT 
        DATE_TRUNC('month', join_date) AS cohort_month,
        id AS member_id
    FROM members
),
loan_activity AS (
    SELECT 
        mc.cohort_month,
        DATE_TRUNC('month', l.loan_date) AS activity_month,
        COUNT(DISTINCT l.member_id) AS active_members
    FROM member_cohorts mc
    LEFT JOIN loans l ON mc.member_id = l.member_id
    GROUP BY mc.cohort_month, DATE_TRUNC('month', l.loan_date)
)
SELECT * FROM loan_activity
ORDER BY cohort_month, activity_month;

-- Bonus 3: Percentile analysis
SELECT 
    title,
    price,
    NTILE(10) OVER (ORDER BY price) AS price_decile,
    loan_count,
    NTILE(10) OVER (ORDER BY loan_count) AS popularity_decile
FROM (
    SELECT 
        b.title,
        b.price,
        COUNT(l.id) AS loan_count
    FROM books b
    LEFT JOIN loans l ON b.id = l.book_id
    GROUP BY b.id, b.title, b.price
) book_stats
WHERE price_decile >= 9 OR popularity_decile >= 9;

-- Bonus 4: Time series 7-day moving average
WITH daily_loans AS (
    SELECT 
        loan_date::date AS date,
        COUNT(*) AS loan_count
    FROM loans
    GROUP BY loan_date::date
)
SELECT 
    date,
    loan_count,
    ROUND(AVG(loan_count) OVER (
        ORDER BY date 
        ROWS BETWEEN 3 PRECEDING AND 3 FOLLOWING
    ), 2) AS moving_avg_7day
FROM daily_loans
ORDER BY date;

-- Bonus 5: LAG/LEAD window functions
SELECT 
    title,
    price,
    LAG(price) OVER (ORDER BY price) AS prev_price,
    LEAD(price) OVER (ORDER BY price) AS next_price,
    price - LAG(price) OVER (ORDER BY price) AS diff_from_prev
FROM books
ORDER BY price;
