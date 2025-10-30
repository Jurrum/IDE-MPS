-- ============================================
-- EXERCISE 2 SOLUTION
-- Data Insertion & Querying
-- ============================================

-- Make sure you're connected to library_db
-- \c library_db

-- ============================================
-- Task 1: Insert Books
-- ============================================

INSERT INTO books (title, author, isbn, publication_year, pages, price) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 1925, 180, 12.99),
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 1960, 324, 14.99),
('1984', 'George Orwell', '9780451524935', 1949, 328, 13.99),
('Pride and Prejudice', 'Jane Austen', '9780141439518', 1813, 432, 11.99),
('The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 1951, 277, 15.99);

-- ============================================
-- Task 2: Insert Members
-- ============================================

INSERT INTO members (first_name, last_name, email, phone_number) VALUES
('John', 'Smith', 'john.smith@email.com', '555-0101'),
('Emma', 'Johnson', 'emma.j@email.com', '555-0102'),
('Michael', 'Brown', 'm.brown@email.com', '555-0103'),
('Sarah', 'Davis', 'sarah.d@email.com', '555-0104'),
('David', 'Wilson', 'd.wilson@email.com', '555-0105');

-- ============================================
-- Task 3: Insert Categories
-- ============================================

INSERT INTO categories (name, description) VALUES
('Fiction', 'Literary works of imagination'),
('Classic', 'Timeless literary works'),
('Dystopian', 'Fiction set in undesirable societies'),
('Romance', 'Stories focused on romantic relationships'),
('Coming of Age', 'Stories about character growth and maturity');

-- ============================================
-- Task 4: Basic SELECT Queries
-- ============================================

-- 4.1: Select all books
SELECT * FROM books;

-- 4.2: Select only book titles and authors
SELECT title, author FROM books;

-- 4.3: Select all members' first and last names
SELECT first_name, last_name FROM members;

-- 4.4: Select all category names
SELECT name FROM categories;

-- ============================================
-- Task 5: Filtering with WHERE
-- ============================================

-- 5.1: Books published after 1950
SELECT * FROM books WHERE publication_year > 1950;

-- 5.2: Books priced under $14
SELECT * FROM books WHERE price < 14;

-- 5.3: Books with more than 300 pages
SELECT * FROM books WHERE pages > 300;

-- 5.4: Members with email containing "email.com"
SELECT * FROM members WHERE email LIKE '%email.com%';

-- 5.5: Books by "George Orwell"
SELECT * FROM books WHERE author = 'George Orwell';

-- ============================================
-- Task 6: Advanced Filtering
-- ============================================

-- 6.1: Books published between 1900 and 1960
SELECT * FROM books 
WHERE publication_year BETWEEN 1900 AND 1960;

-- 6.2: Books in stock AND cost less than $15
SELECT * FROM books 
WHERE in_stock = TRUE AND price < 15;

-- 6.3: Books with more than 200 pages OR published before 1900
SELECT * FROM books 
WHERE pages > 200 OR publication_year < 1900;

-- 6.4: Members whose first name starts with 'S'
SELECT * FROM members 
WHERE first_name LIKE 'S%';

-- 6.5: Books with ISBN starting with "978"
SELECT * FROM books 
WHERE isbn LIKE '978%';

-- ============================================
-- Task 7: Sorting and Limiting
-- ============================================

-- 7.1: Books sorted by price (lowest to highest)
SELECT * FROM books ORDER BY price ASC;

-- 7.2: Books sorted by publication year (newest first)
SELECT * FROM books ORDER BY publication_year DESC;

-- 7.3: Show the 3 most expensive books
SELECT * FROM books ORDER BY price DESC LIMIT 3;

-- 7.4: Show the 5 oldest books
SELECT * FROM books ORDER BY publication_year ASC LIMIT 5;

-- 7.5: Members alphabetically by last name
SELECT * FROM members ORDER BY last_name ASC;

-- ============================================
-- Task 8: Update Records
-- ============================================

-- 8.1: Increase all book prices by 10%
UPDATE books SET price = price * 1.10;

-- 8.2: Update "The Great Gatsby" to be out of stock
UPDATE books 
SET in_stock = FALSE 
WHERE title = 'The Great Gatsby';

-- 8.3: Change John Smith's email
UPDATE members 
SET email = 'johnsmith@newmail.com' 
WHERE first_name = 'John' AND last_name = 'Smith';

-- 8.4: Update books published before 1950
UPDATE books 
SET language = 'English (Classic)' 
WHERE publication_year < 1950;

-- 8.5: Set membership_active to FALSE for specific member
UPDATE members 
SET membership_active = FALSE 
WHERE email = 'd.wilson@email.com';

-- ============================================
-- Task 9: Delete Records
-- ============================================

-- 9.1: Delete "Coming of Age" category
DELETE FROM categories WHERE name = 'Coming of Age';

-- 9.2: Delete all books that are out of stock
DELETE FROM books WHERE in_stock = FALSE;

-- 9.3: Delete members who joined more than 30 days ago
DELETE FROM members 
WHERE join_date < CURRENT_DATE - INTERVAL '30 days';

-- ============================================
-- Task 10: Aggregate Functions
-- ============================================

-- 10.1: Count total number of books
SELECT COUNT(*) AS total_books FROM books;

-- 10.2: Find average price of all books
SELECT AVG(price) AS average_price FROM books;

-- 10.3: Find most expensive book price
SELECT MAX(price) AS max_price FROM books;

-- 10.4: Find cheapest book price
SELECT MIN(price) AS min_price FROM books;

-- 10.5: Count active members
SELECT COUNT(*) AS active_members 
FROM members 
WHERE membership_active = TRUE;

-- ============================================
-- BONUS CHALLENGES
-- ============================================

-- Bonus 1: Pattern matching - titles containing "The"
SELECT * FROM books WHERE title LIKE '%The%';

-- Bonus 2: Insert book without publication year, then find them
INSERT INTO books (title, author, isbn, pages, price) 
VALUES ('Unknown Date Book', 'Unknown Author', '9999999999999', 200, 10.00);

SELECT * FROM books WHERE publication_year IS NULL;

-- Bonus 3: Find all unique authors
SELECT DISTINCT author FROM books ORDER BY author;

-- Bonus 4: Categorize books by price
SELECT 
    title,
    price,
    CASE 
        WHEN price < 13 THEN 'Cheap'
        WHEN price BETWEEN 13 AND 15 THEN 'Moderate'
        ELSE 'Expensive'
    END AS price_category
FROM books;

-- Bonus 5: Show member names in uppercase
SELECT 
    UPPER(first_name) AS first_name_upper,
    UPPER(last_name) AS last_name_upper,
    email
FROM members;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

SELECT * FROM books;
SELECT * FROM members;
SELECT * FROM categories;

SELECT 
    (SELECT COUNT(*) FROM books) as total_books,
    (SELECT COUNT(*) FROM members) as total_members,
    (SELECT COUNT(*) FROM categories) as total_categories;
