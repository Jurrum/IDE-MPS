-- ============================================
-- EXERCISE 3 SOLUTION
-- Relationships & Joins
-- ============================================

-- Make sure you're connected to library_db
-- \c library_db

-- ============================================
-- Task 1: Add Foreign Keys to Existing Tables
-- ============================================

-- 1.1: Add category_id column to books
ALTER TABLE books 
ADD COLUMN category_id INTEGER;

-- 1.2: Create foreign key constraint
ALTER TABLE books 
ADD CONSTRAINT fk_books_category 
FOREIGN KEY (category_id) REFERENCES categories(id);

-- 1.3: Update existing books with category assignments
-- First, let's see what categories we have
SELECT * FROM categories;

-- Assign categories to books (adjust IDs based on your data)
UPDATE books SET category_id = 1 WHERE title IN ('The Great Gatsby', '1984');
UPDATE books SET category_id = 2 WHERE title IN ('Pride and Prejudice', 'To Kill a Mockingbird');
UPDATE books SET category_id = 3 WHERE title = 'The Catcher in the Rye';

-- ============================================
-- Task 2: Create a Borrowing System
-- ============================================

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    loan_date DATE DEFAULT CURRENT_DATE,
    due_date DATE DEFAULT CURRENT_DATE + INTERVAL '14 days',
    return_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue'))
);

-- ============================================
-- Task 3: Create Many-to-Many Relationship
-- ============================================

-- 3.1: Create authors table
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_year INTEGER,
    country VARCHAR(50)
);

-- 3.2: Create book_authors junction table
CREATE TABLE book_authors (
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

-- ============================================
-- Task 4: Insert Related Data
-- ============================================

-- 4.1: Insert authors
INSERT INTO authors (first_name, last_name, birth_year, country) VALUES
('F. Scott', 'Fitzgerald', 1896, 'USA'),
('Harper', 'Lee', 1926, 'USA'),
('George', 'Orwell', 1903, 'UK'),
('Jane', 'Austen', 1775, 'UK'),
('J.D.', 'Salinger', 1919, 'USA');

-- 4.2: Link books to authors
-- Get book and author IDs first
SELECT id, title FROM books;
SELECT id, first_name, last_name FROM authors;

-- Insert relationships (adjust IDs based on your data)
INSERT INTO book_authors (book_id, author_id) VALUES
(1, 1),  -- The Great Gatsby - F. Scott Fitzgerald
(2, 2),  -- To Kill a Mockingbird - Harper Lee
(3, 3),  -- 1984 - George Orwell
(4, 4),  -- Pride and Prejudice - Jane Austen
(5, 5);  -- The Catcher in the Rye - J.D. Salinger

-- 4.3: Create loan records
INSERT INTO loans (book_id, member_id, loan_date, status) VALUES
(1, 1, CURRENT_DATE - INTERVAL '5 days', 'active'),
(2, 2, CURRENT_DATE - INTERVAL '10 days', 'active'),
(3, 3, CURRENT_DATE - INTERVAL '20 days', 'overdue'),
(4, 1, CURRENT_DATE - INTERVAL '30 days', 'returned'),
(5, 4, CURRENT_DATE - INTERVAL '2 days', 'active');

-- Update return_date for returned loans
UPDATE loans SET return_date = loan_date + INTERVAL '12 days' WHERE status = 'returned';

-- ============================================
-- Task 5: INNER JOIN Queries
-- ============================================

-- 5.1: Books with their category names
SELECT b.title, b.author, c.name AS category
FROM books b
INNER JOIN categories c ON b.category_id = c.id;

-- 5.2: Active loans with book titles and member names
SELECT 
    l.id AS loan_id,
    b.title AS book_title,
    CONCAT(m.first_name, ' ', m.last_name) AS member_name,
    l.loan_date,
    l.due_date
FROM loans l
INNER JOIN books b ON l.book_id = b.id
INNER JOIN members m ON l.member_id = m.id
WHERE l.status = 'active';

-- 5.3: Books with their authors
SELECT 
    b.title,
    CONCAT(a.first_name, ' ', a.last_name) AS author_name,
    a.country
FROM books b
INNER JOIN book_authors ba ON b.id = ba.book_id
INNER JOIN authors a ON ba.author_id = a.id;

-- 5.4: Members who have active loans
SELECT DISTINCT
    m.first_name,
    m.last_name,
    m.email
FROM members m
INNER JOIN loans l ON m.id = l.member_id
WHERE l.status = 'active';

-- 5.5: Books in "Fiction" category
SELECT b.title, b.author, b.price
FROM books b
INNER JOIN categories c ON b.category_id = c.id
WHERE c.name = 'Fiction';

-- ============================================
-- Task 6: LEFT JOIN Queries
-- ============================================

-- 6.1: All books and categories (including books without categories)
SELECT 
    b.title,
    b.author,
    COALESCE(c.name, 'Uncategorized') AS category
FROM books b
LEFT JOIN categories c ON b.category_id = c.id;

-- 6.2: All members and their loan count
SELECT 
    m.first_name,
    m.last_name,
    COUNT(l.id) AS loan_count
FROM members m
LEFT JOIN loans l ON m.id = l.member_id
GROUP BY m.id, m.first_name, m.last_name
ORDER BY loan_count DESC;

-- 6.3: All categories and count of books
SELECT 
    c.name AS category,
    COUNT(b.id) AS book_count
FROM categories c
LEFT JOIN books b ON c.id = b.category_id
GROUP BY c.id, c.name
ORDER BY book_count DESC;

-- 6.4: All books and their loan status
SELECT 
    b.title,
    b.author,
    CASE 
        WHEN COUNT(l.id) = 0 THEN 'Never borrowed'
        WHEN COUNT(CASE WHEN l.status = 'active' THEN 1 END) > 0 THEN 'Currently on loan'
        ELSE 'Available'
    END AS loan_status,
    COUNT(l.id) AS total_loans
FROM books b
LEFT JOIN loans l ON b.id = l.book_id
GROUP BY b.id, b.title, b.author;

-- ============================================
-- Task 7: Multiple Joins
-- ============================================

-- 7.1: Loan details with book, member, and category
SELECT 
    l.id AS loan_id,
    b.title AS book_title,
    c.name AS category,
    CONCAT(m.first_name, ' ', m.last_name) AS member_name,
    l.loan_date,
    l.due_date,
    l.status
FROM loans l
INNER JOIN books b ON l.book_id = b.id
INNER JOIN members m ON l.member_id = m.id
LEFT JOIN categories c ON b.category_id = c.id;

-- 7.2: Books with authors and categories
SELECT 
    b.title,
    CONCAT(a.first_name, ' ', a.last_name) AS author_name,
    c.name AS category,
    b.price
FROM books b
LEFT JOIN book_authors ba ON b.id = ba.book_id
LEFT JOIN authors a ON ba.author_id = a.id
LEFT JOIN categories c ON b.category_id = c.id;

-- 7.3: Members with borrowed books and due dates
SELECT 
    CONCAT(m.first_name, ' ', m.last_name) AS member_name,
    b.title AS book_title,
    l.loan_date,
    l.due_date,
    l.status
FROM members m
INNER JOIN loans l ON m.id = l.member_id
INNER JOIN books b ON l.book_id = b.id
WHERE l.status IN ('active', 'overdue')
ORDER BY l.due_date;

-- 7.4: Overdue loans with all details
SELECT 
    l.id AS loan_id,
    b.title AS book_title,
    CONCAT(a.first_name, ' ', a.last_name) AS author_name,
    CONCAT(m.first_name, ' ', m.last_name) AS member_name,
    m.email,
    l.loan_date,
    l.due_date,
    CURRENT_DATE - l.due_date AS days_overdue
FROM loans l
INNER JOIN books b ON l.book_id = b.id
INNER JOIN members m ON l.member_id = m.id
LEFT JOIN book_authors ba ON b.id = ba.book_id
LEFT JOIN authors a ON ba.author_id = a.id
WHERE l.status = 'overdue' OR (l.status = 'active' AND l.due_date < CURRENT_DATE);

-- 7.5: Authors with their books and categories
SELECT 
    CONCAT(a.first_name, ' ', a.last_name) AS author_name,
    a.country,
    b.title AS book_title,
    c.name AS category
FROM authors a
INNER JOIN book_authors ba ON a.id = ba.author_id
INNER JOIN books b ON ba.book_id = b.id
LEFT JOIN categories c ON b.category_id = c.id
ORDER BY author_name, book_title;

-- ============================================
-- Task 8: Aggregation with Joins
-- ============================================

-- 8.1: Count books borrowed per member
SELECT 
    CONCAT(m.first_name, ' ', m.last_name) AS member_name,
    COUNT(l.id) AS books_borrowed
FROM members m
LEFT JOIN loans l ON m.id = l.member_id
GROUP BY m.id, m.first_name, m.last_name
ORDER BY books_borrowed DESC;

-- 8.2: Find most popular book
SELECT 
    b.title,
    b.author,
    COUNT(l.id) AS times_borrowed
FROM books b
LEFT JOIN loans l ON b.id = l.book_id
GROUP BY b.id, b.title, b.author
ORDER BY times_borrowed DESC
LIMIT 1;

-- 8.3: Total revenue per category
SELECT 
    c.name AS category,
    COUNT(b.id) AS book_count,
    SUM(b.price) AS total_value,
    AVG(b.price) AS avg_price
FROM categories c
LEFT JOIN books b ON c.id = b.category_id
GROUP BY c.id, c.name
ORDER BY total_value DESC;

-- 8.4: Authors with most books
SELECT 
    CONCAT(a.first_name, ' ', a.last_name) AS author_name,
    a.country,
    COUNT(ba.book_id) AS book_count
FROM authors a
LEFT JOIN book_authors ba ON a.id = ba.author_id
GROUP BY a.id, a.first_name, a.last_name, a.country
ORDER BY book_count DESC;

-- 8.5: Members who never borrowed a book
SELECT 
    m.first_name,
    m.last_name,
    m.email,
    m.join_date
FROM members m
LEFT JOIN loans l ON m.id = l.member_id
WHERE l.id IS NULL;

-- ============================================
-- Task 9: Subqueries with Joins
-- ============================================

-- 9.1: Books never borrowed
SELECT b.title, b.author, b.price
FROM books b
WHERE b.id NOT IN (SELECT DISTINCT book_id FROM loans);

-- 9.2: Members who borrowed more than 2 books
SELECT 
    m.first_name,
    m.last_name,
    (SELECT COUNT(*) FROM loans WHERE member_id = m.id) AS loan_count
FROM members m
WHERE (SELECT COUNT(*) FROM loans WHERE member_id = m.id) > 2;

-- 9.3: Categories with more than 3 books
SELECT c.name, c.description
FROM categories c
WHERE (SELECT COUNT(*) FROM books WHERE category_id = c.id) > 3;

-- 9.4: Most expensive book in each category
SELECT 
    c.name AS category,
    b.title,
    b.price
FROM books b
INNER JOIN categories c ON b.category_id = c.id
WHERE b.price = (
    SELECT MAX(price) 
    FROM books 
    WHERE category_id = c.id
);

-- 9.5: Authors whose books have been borrowed
SELECT DISTINCT
    a.first_name,
    a.last_name
FROM authors a
WHERE EXISTS (
    SELECT 1 
    FROM book_authors ba
    INNER JOIN loans l ON ba.book_id = l.book_id
    WHERE ba.author_id = a.id
);

-- ============================================
-- Task 10: Update and Delete with Joins
-- ============================================

-- 10.1: Mark overdue loans
UPDATE loans
SET status = 'overdue'
WHERE status = 'active' AND due_date < CURRENT_DATE;

-- 10.2: Update book stock based on active loans
UPDATE books
SET in_stock = FALSE
WHERE id IN (
    SELECT DISTINCT book_id 
    FROM loans 
    WHERE status = 'active'
);

-- 10.3: Delete authors with no books (be careful!)
-- First, check which authors would be deleted
SELECT a.* 
FROM authors a
LEFT JOIN book_authors ba ON a.id = ba.author_id
WHERE ba.book_id IS NULL;

-- Then delete (if any exist)
DELETE FROM authors
WHERE id NOT IN (SELECT DISTINCT author_id FROM book_authors);

-- ============================================
-- BONUS CHALLENGES
-- ============================================

-- Bonus 1: Self-referencing table for recommendations
CREATE TABLE book_recommendations (
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    recommended_book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, recommended_book_id),
    CHECK (book_id != recommended_book_id)
);

-- Insert some recommendations
INSERT INTO book_recommendations (book_id, recommended_book_id) VALUES
(1, 2), (1, 3), (2, 1), (3, 1);

-- Query recommendations
SELECT 
    b1.title AS book,
    b2.title AS recommended_book
FROM book_recommendations br
INNER JOIN books b1 ON br.book_id = b1.id
INNER JOIN books b2 ON br.recommended_book_id = b2.id;

-- Bonus 2: Test CASCADE operations
-- This would delete all related loans when a book is deleted
-- DELETE FROM books WHERE id = 1;

-- Bonus 3: Cross join (all possible combinations)
SELECT 
    b.title AS book,
    m.first_name || ' ' || m.last_name AS member
FROM books b
CROSS JOIN members m
LIMIT 20;  -- Limit to avoid too many results

-- Bonus 4: Full outer join
SELECT 
    COALESCE(b.title, 'No book') AS book,
    COALESCE(m.first_name || ' ' || m.last_name, 'No member') AS member
FROM books b
FULL OUTER JOIN loans l ON b.id = l.book_id
FULL OUTER JOIN members m ON l.member_id = m.id;

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
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;

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
GROUP BY b.id, b.title, c.name, a.first_name, a.last_name
ORDER BY times_borrowed DESC;
