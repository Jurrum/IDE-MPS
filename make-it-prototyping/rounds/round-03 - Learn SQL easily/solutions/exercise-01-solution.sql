-- ============================================
-- EXERCISE 1 SOLUTION
-- Database Basics & Table Creation
-- ============================================

-- ============================================
-- Task 1: Create Your First Database
-- ============================================

CREATE DATABASE library_db;

-- Connect to the database
-- \c library_db

-- ============================================
-- Task 2: Create a Books Table
-- ============================================

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    isbn CHAR(13) UNIQUE,
    publication_year INTEGER,
    pages INTEGER CHECK (pages > 0),
    price DECIMAL(10, 2),
    in_stock BOOLEAN DEFAULT TRUE
);

-- ============================================
-- Task 3: Create a Members Table
-- ============================================

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    join_date DATE DEFAULT CURRENT_DATE,
    membership_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- Task 4: Create a Categories Table
-- ============================================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- ============================================
-- Task 5: Modify Tables
-- ============================================

-- 5.1: Add 'language' column to books table
ALTER TABLE books 
ADD COLUMN language VARCHAR(30) DEFAULT 'English';

-- 5.2: Add 'address' column to members table
ALTER TABLE members 
ADD COLUMN address TEXT;

-- 5.3: Rename 'phone' to 'phone_number' in members table
ALTER TABLE members 
RENAME COLUMN phone TO phone_number;

-- ============================================
-- Task 6: Create Indexes
-- ============================================

-- 6.1: Create index on author column in books table
CREATE INDEX idx_books_author ON books(author);

-- 6.2: Create index on email column in members table
CREATE INDEX idx_members_email ON members(email);

-- ============================================
-- Task 7: View Your Work
-- ============================================

-- List all tables
-- \dt

-- Describe each table
-- \d books
-- \d members
-- \d categories

-- ============================================
-- BONUS CHALLENGES
-- ============================================

-- Bonus 1: Create an Authors Table
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    biography TEXT,
    country VARCHAR(50)
);

-- Bonus 2: Create a Publishers Table
CREATE TABLE publishers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50),
    website VARCHAR(200)
);

-- Bonus 3: Create an Enum Type for book condition
CREATE TYPE book_condition AS ENUM ('new', 'good', 'fair', 'poor');

ALTER TABLE books 
ADD COLUMN condition book_condition DEFAULT 'good';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify your tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check constraints on books table
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'books';

-- Check all columns in books table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'books'
ORDER BY ordinal_position;
