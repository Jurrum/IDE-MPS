-- Exercise 1: Database Basics & Table Creation
-- Complete each task by writing SQL statements below

-- ============================================
-- Task 1: Create Your First Database
-- ============================================

-- Create a database called 'library_db'



-- ============================================
-- Task 2: Create a Books Table
-- ============================================

-- First, connect to the database:
-- \c library_db

-- Create the books table with all required columns and constraints




-- ============================================
-- Task 3: Create a Members Table
-- ============================================

-- Create the members table




-- ============================================
-- Task 4: Create a Categories Table
-- ============================================

-- Create the categories table




-- ============================================
-- Task 5: Modify Tables
-- ============================================

-- 5.1: Add 'language' column to books table


-- 5.2: Add 'address' column to members table


-- 5.3: Rename 'phone' to 'phone_number' in members table



-- ============================================
-- Task 6: Create Indexes
-- ============================================

-- 6.1: Create index on author column in books table


-- 6.2: Create index on email column in members table



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


-- Bonus 2: Create a Publishers Table


-- Bonus 3: Create an Enum Type for book condition


-- ============================================
-- TESTING QUERIES
-- ============================================

-- Verify your tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check constraints on books table
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'books';
