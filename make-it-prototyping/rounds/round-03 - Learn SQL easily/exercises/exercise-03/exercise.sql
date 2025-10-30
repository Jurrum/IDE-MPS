-- Exercise 3: Relationships & Joins
-- Make sure you're connected to library_db
-- \c library_db

-- ============================================
-- Task 1: Add Foreign Keys to Existing Tables
-- ============================================

-- 1.1: Add category_id column to books


-- 1.2: Create foreign key constraint


-- 1.3: Update existing books with category assignments



-- ============================================
-- Task 2: Create a Borrowing System
-- ============================================

-- Create loans table with foreign keys




-- ============================================
-- Task 3: Create Many-to-Many Relationship
-- ============================================

-- 3.1: Create authors table


-- 3.2: Create book_authors junction table



-- ============================================
-- Task 4: Insert Related Data
-- ============================================

-- 4.1: Insert authors


-- 4.2: Link books to authors in book_authors


-- 4.3: Create loan records



-- ============================================
-- Task 5: INNER JOIN Queries
-- ============================================

-- 5.1: Books with their category names


-- 5.2: Active loans with book titles and member names


-- 5.3: Books with their authors


-- 5.4: Members who have active loans


-- 5.5: Books in "Fiction" category



-- ============================================
-- Task 6: LEFT JOIN Queries
-- ============================================

-- 6.1: All books and categories (including books without categories)


-- 6.2: All members and their loan count


-- 6.3: All categories and count of books


-- 6.4: All books and their loan status



-- ============================================
-- Task 7: Multiple Joins
-- ============================================

-- 7.1: Loan details with book, member, and category


-- 7.2: Books with authors and categories


-- 7.3: Members with borrowed books and due dates


-- 7.4: Overdue loans with all details


-- 7.5: Authors with their books and categories



-- ============================================
-- Task 8: Aggregation with Joins
-- ============================================

-- 8.1: Count books borrowed per member


-- 8.2: Find most popular book


-- 8.3: Total revenue per category


-- 8.4: Authors with most books


-- 8.5: Members who never borrowed a book



-- ============================================
-- Task 9: Subqueries with Joins
-- ============================================

-- 9.1: Books never borrowed


-- 9.2: Members who borrowed more than 2 books


-- 9.3: Categories with more than 3 books


-- 9.4: Most expensive book in each category


-- 9.5: Authors whose books have been borrowed



-- ============================================
-- Task 10: Update and Delete with Joins
-- ============================================

-- 10.1: Mark overdue loans


-- 10.2: Update book stock based on active loans


-- 10.3: Delete authors with no books



-- ============================================
-- BONUS CHALLENGES
-- ============================================

-- Bonus 1: Self-referencing table for recommendations


-- Bonus 2: Test CASCADE operations


-- Bonus 3: Cross join example


-- Bonus 4: Full outer join


-- Bonus 5: Recursive query (if applicable)



-- ============================================
-- VERIFICATION QUERIES
-- ============================================

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

-- Complex join test
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
