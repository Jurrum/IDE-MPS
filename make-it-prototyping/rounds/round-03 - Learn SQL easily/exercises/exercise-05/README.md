# Exercise 5: Final Project - Build a Complete E-Commerce Database

## 🎯 Project Goal

Design and implement a complete database system for an e-commerce platform from scratch. This project combines everything you've learned in Exercises 1-4.

## 📚 Project Overview

You will build a database for **"TechStore"** - an online electronics retailer. The system must handle:
- Product catalog management
- Customer accounts
- Shopping carts
- Orders and order items
- Product reviews
- Inventory tracking
- Shipping information

## 🎨 Requirements

### Phase 1: Database Design (Planning)

Before writing any code, design your database schema:

1. **Identify Entities**: What main objects does the system need?
   - Customers
   - Products
   - Categories
   - Orders
   - Reviews
   - etc.

2. **Define Relationships**: How do entities relate?
   - One-to-many
   - Many-to-many
   - One-to-one

3. **List Attributes**: What information does each entity store?

4. **Identify Constraints**: What rules must the data follow?
   - Required fields
   - Unique values
   - Value ranges
   - Foreign keys

**Deliverable**: Create an ERD (Entity Relationship Diagram) on paper or using a tool.

### Phase 2: Database Implementation

#### Task 1: Create the Database

Create a new database called `techstore_db`.

```sql
-- Your code here
```

#### Task 2: Create Core Tables

Implement these tables with appropriate columns, data types, and constraints:

**Customers Table**
- Customer ID (primary key)
- Email (unique, required)
- Password hash
- First name, last name
- Phone number
- Registration date
- Account status (active/inactive)

**Products Table**
- Product ID (primary key)
- Name (required)
- Description (text)
- SKU (unique)
- Price (must be positive)
- Stock quantity
- Category ID (foreign key)
- Brand
- Created date
- Updated date

**Categories Table**
- Category ID (primary key)
- Name (unique, required)
- Description
- Parent category ID (for hierarchical categories)

**Orders Table**
- Order ID (primary key)
- Customer ID (foreign key)
- Order date
- Status (pending, processing, shipped, delivered, cancelled)
- Total amount
- Shipping address
- Billing address

**Order Items Table**
- Order item ID (primary key)
- Order ID (foreign key)
- Product ID (foreign key)
- Quantity
- Unit price (price at time of order)
- Subtotal

**Reviews Table**
- Review ID (primary key)
- Product ID (foreign key)
- Customer ID (foreign key)
- Rating (1-5)
- Title
- Comment
- Review date
- Helpful count

**Shopping Cart Table**
- Cart ID (primary key)
- Customer ID (foreign key)
- Product ID (foreign key)
- Quantity
- Added date

```sql
-- Your code here
```

#### Task 3: Add Indexes

Create indexes for frequently queried columns:
- Customer email
- Product SKU
- Order status
- Product category
- Review product and customer

```sql
-- Your code here
```

#### Task 4: Create Views

Create useful views:

1. **Product Catalog View**: Products with category names and stock status
2. **Order Summary View**: Orders with customer info and totals
3. **Product Reviews View**: Products with average ratings and review counts
4. **Low Stock Alert View**: Products with stock below threshold

```sql
-- Your code here
```

### Phase 3: Populate with Sample Data

Insert realistic sample data:

1. At least 5 categories (Electronics, Computers, Accessories, etc.)
2. At least 20 products across different categories
3. At least 10 customers
4. At least 15 orders with multiple items each
5. At least 25 reviews
6. Some shopping cart items

```sql
-- Your code here
```

### Phase 4: Business Logic Queries

Write queries to answer business questions:

#### Sales Analytics

1. **Total Revenue**: Calculate total revenue by month
2. **Top Products**: Find best-selling products by quantity and revenue
3. **Customer Lifetime Value**: Calculate total spending per customer
4. **Average Order Value**: Calculate average order value by month
5. **Category Performance**: Revenue and order count by category

#### Inventory Management

1. **Low Stock Alert**: Products with stock below 10 units
2. **Out of Stock**: Products with zero stock
3. **Inventory Value**: Total value of inventory by category
4. **Stock Movement**: Products ordered in last 30 days

#### Customer Analytics

1. **Top Customers**: Customers by total spending
2. **Customer Segmentation**: Categorize customers by order frequency
3. **Inactive Customers**: Customers who haven't ordered in 90 days
4. **New Customers**: Customers who joined in last month
5. **Customer Retention**: Month-over-month customer retention rate

#### Product Analytics

1. **Product Ratings**: Average rating per product with review count
2. **Top Rated Products**: Products with rating >= 4.5 and at least 5 reviews
3. **Products Without Reviews**: Products that have been ordered but not reviewed
4. **Review Trends**: Average rating by month

```sql
-- Your code here
```

### Phase 5: Advanced Features

Implement these advanced features:

#### Task 1: Stored Procedures

Create stored procedures for:

1. **Place Order**: Takes customer ID and cart items, creates order
2. **Update Inventory**: Decreases stock when order is placed
3. **Cancel Order**: Cancels order and restores inventory
4. **Calculate Shipping**: Calculates shipping cost based on weight/distance

```sql
-- Your code here
```

#### Task 2: Triggers

Create triggers for:

1. **Update Product Timestamp**: Auto-update `updated_date` on product changes
2. **Validate Stock**: Prevent orders if insufficient stock
3. **Update Order Total**: Recalculate order total when items change
4. **Archive Old Orders**: Move completed orders older than 1 year to archive table

```sql
-- Your code here
```

#### Task 3: Functions

Create functions for:

1. **Calculate Discount**: Apply discount based on customer tier
2. **Get Product Availability**: Check if product is available in quantity
3. **Format Price**: Format price with currency symbol
4. **Calculate Tax**: Calculate tax based on location

```sql
-- Your code here
```

### Phase 6: Reporting

Create comprehensive reports:

1. **Daily Sales Report**: Orders, revenue, and top products for today
2. **Monthly Dashboard**: Key metrics for current month
3. **Customer Report**: Customer list with order history and lifetime value
4. **Inventory Report**: Current stock levels with reorder recommendations
5. **Product Performance Report**: Sales, reviews, and profitability by product

```sql
-- Your code here
```

## 🧪 Testing

Test your database thoroughly:

1. **Data Integrity**: Verify all constraints work correctly
2. **Query Performance**: Use EXPLAIN ANALYZE on complex queries
3. **Edge Cases**: Test with NULL values, zero quantities, etc.
4. **Concurrent Operations**: Simulate multiple users
5. **Backup and Restore**: Test backup procedures

```sql
-- Your test queries here
```

## 💡 Bonus Challenges

1. **Wishlist Feature**: Add tables for customer wishlists
2. **Coupon System**: Implement discount codes and promotions
3. **Product Variants**: Handle products with sizes, colors, etc.
4. **Shipping Tracking**: Add shipping carrier and tracking numbers
5. **Return Management**: Implement order returns and refunds
6. **Product Recommendations**: Query for "customers who bought X also bought Y"
7. **Search Functionality**: Implement full-text search for products
8. **Audit Trail**: Track all changes to orders and products

```sql
-- Bonus implementations here
```

## 📋 Deliverables

1. **Schema SQL File**: Complete DDL for all tables, indexes, views
2. **Sample Data SQL File**: INSERT statements for test data
3. **Queries SQL File**: All business logic queries
4. **Documentation**: README explaining your design decisions
5. **ERD Diagram**: Visual representation of your database schema

## 🤔 Reflection Questions

1. What normalization level did you achieve? Why?
2. What were your biggest design challenges?
3. How did you handle price changes over time?
4. What indexes did you create and why?
5. How would you scale this database for millions of products?
6. What security considerations did you implement?
7. How did you handle inventory concurrency issues?

## ✅ Project Checklist

- [ ] Completed database design and ERD
- [ ] Created all required tables with proper constraints
- [ ] Added appropriate indexes
- [ ] Created useful views
- [ ] Populated database with sample data
- [ ] Wrote all sales analytics queries
- [ ] Wrote all inventory management queries
- [ ] Wrote all customer analytics queries
- [ ] Wrote all product analytics queries
- [ ] Implemented stored procedures
- [ ] Implemented triggers
- [ ] Implemented functions
- [ ] Created comprehensive reports
- [ ] Tested thoroughly
- [ ] Completed bonus challenges (optional)
- [ ] Documented design decisions

## 🎓 Evaluation Criteria

Your project will be evaluated on:

1. **Database Design** (30%)
   - Proper normalization
   - Appropriate relationships
   - Constraint usage

2. **Implementation** (25%)
   - Code quality
   - Naming conventions
   - Index strategy

3. **Functionality** (25%)
   - All queries work correctly
   - Business logic is sound
   - Edge cases handled

4. **Advanced Features** (10%)
   - Stored procedures
   - Triggers
   - Functions

5. **Documentation** (10%)
   - Clear explanations
   - Well-commented code
   - Complete README

## 🚀 Next Steps

After completing this project:

1. **Deploy**: Set up PostgreSQL on a cloud provider
2. **Build an API**: Create a REST API using Node.js/Python
3. **Create a Frontend**: Build a web interface
4. **Add Authentication**: Implement user login/security
5. **Monitor Performance**: Set up query monitoring
6. **Implement Caching**: Add Redis for frequently accessed data

## 📚 Additional Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Database Design Best Practices
- E-commerce Database Patterns
- SQL Performance Tuning

---

Congratulations on completing the SQL Practice Project! You now have the skills to design and build production-ready database systems. 🎉
