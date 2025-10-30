-- Exercise 2: Data Insertion & Querying
-- Make sure you're connected to library_db before starting
-- \c library_db

-- ============================================
-- Task 1: Insert Books
-- ============================================

-- Insert 5 books into the books table




-- ============================================
-- Task 2: Insert Members
-- ============================================

-- Insert 5 members into the members table




-- ============================================
-- Task 3: Insert Categories
-- ============================================

-- Insert 5 categories into the categories table




-- ============================================
-- Task 4: Basic SELECT Queries
-- ============================================

-- 4.1: Select all books


-- 4.2: Select only book titles and authors


-- 4.3: Select all members' first and last names


-- 4.4: Select all category names



-- ============================================
-- Task 5: Filtering with WHERE
-- ============================================

-- 5.1: Books published after 1950


-- 5.2: Books priced under $14


-- 5.3: Books with more than 300 pages


-- 5.4: Members with email containing "email.com"


-- 5.5: Books by "George Orwell"



-- ============================================
-- Task 6: Advanced Filtering
-- ============================================

-- 6.1: Books published between 1900 and 1960


-- 6.2: Books in stock AND cost less than $15


-- 6.3: Books with more than 200 pages OR published before 1900


-- 6.4: Members whose first name starts with 'S'


-- 6.5: Books with ISBN starting with "978"



-- ============================================
-- Task 7: Sorting and Limiting
-- ============================================

-- 7.1: Books sorted by price (lowest to highest)


-- 7.2: Books sorted by publication year (newest first)


-- 7.3: Show the 3 most expensive books


-- 7.4: Show the 5 oldest books


-- 7.5: Members alphabetically by last name



-- ============================================
-- Task 8: Update Records
-- ============================================

-- 8.1: Increase all book prices by 10%


-- 8.2: Update "The Great Gatsby" to be out of stock


-- 8.3: Change John Smith's email


-- 8.4: Update books published before 1950


-- 8.5: Set membership_active to FALSE for specific member



-- ============================================
-- Task 9: Delete Records
-- ============================================

-- 9.1: Delete "Coming of Age" category


-- 9.2: Delete all books that are out of stock


-- 9.3: Delete members who joined more than 30 days ago



-- ============================================
-- Task 10: Aggregate Functions
-- ============================================

-- 10.1: Count total number of books


-- 10.2: Find average price of all books


-- 10.3: Find most expensive book price


-- 10.4: Find cheapest book price


-- 10.5: Count active members



-- ============================================
-- BONUS CHALLENGES
-- ============================================

-- Bonus 1: Pattern matching - titles containing "The"


-- Bonus 2: Find books with missing publication years


-- Bonus 3: Find all unique authors


-- Bonus 4: Categorize books by price


-- Bonus 5: Show member names in uppercase



-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all data
SELECT * FROM books;
SELECT * FROM members;
SELECT * FROM categories;

-- Summary counts
SELECT 
    (SELECT COUNT(*) FROM books) as total_books,
    (SELECT COUNT(*) FROM members) as total_members,
    (SELECT COUNT(*) FROM categories) as total_categories;
