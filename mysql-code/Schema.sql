-- MySql Version 9.2.0
CREATE DATABASE Marketplace;

USE Marketplace;

-- User Entity
CREATE TABLE User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    UCID VARCHAR(20) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Phone VARCHAR(20),
    Address VARCHAR(255)
);

CREATE TABLE UserRole (
    UserID INT,
    Client BOOLEAN DEFAULT True,
    Admin BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (UserID),
    FOREIGN KEY (UserID) REFERENCES User (UserID) ON DELETE CASCADE
);

-- Category Entity (must be created before Product or else error)
CREATE TABLE Category (
    CategoryID INT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL
);

-- Product Entity
CREATE TABLE Product (
    ProductID INT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    StockQuantity INT,
    UserID INT,
    Description TEXT,
    CategoryID INT NOT NULL,
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User (UserID),
    FOREIGN KEY (CategoryID) REFERENCES Category (CategoryID)
);

-- Fixed Image_URL table
CREATE TABLE Image_URL (
    URL VARCHAR(255),
    ProductID INT,
    FOREIGN KEY (ProductID) REFERENCES Product (ProductID)
);

-- Fixed Review Entity (Many-to-One with User, Many-to-One with Product)
CREATE TABLE Review (
    ReviewID INT PRIMARY KEY,
    UserID INT,
    ProductID INT,
    Comment TEXT,
    Rating INT CHECK (
        Rating >= 1
        AND Rating <= 5
    ),
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User (UserID),
    FOREIGN KEY (ProductID) REFERENCES Pprint(item[0])roduct (ProductID)
);

-- Transaction Entity (Many-to-One with User, Many-to-One with Product)
CREATE TABLE Transaction (
    TransactionID INT PRIMARY KEY,
    UserID INT,
    ProductID INT,
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PaymentStatus VARCHAR(50),
    FOREIGN KEY (UserID) REFERENCES User (UserID),
    FOREIGN KEY (ProductID) REFERENCES Product (ProductID)
);

-- Recommendation Entity (Many-to-One with User, Many-to-One with Product)
CREATE TABLE Recommendation (
    RecommendationID_PK INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    RecommendedProductID INT,
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User (UserID),
    FOREIGN KEY (RecommendedProductID) REFERENCES Product (ProductID)
);

-- History Entity (Many-to-One with User, Many-to-One with Product)
CREATE TABLE History (
    HistoryID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    ProductID INT,
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User (UserID),
    FOREIGN KEY (ProductID) REFERENCES Product (ProductID)
);

-- Favorites Entity (Many-to-One with User, Many-to-One with Product)
CREATE TABLE Favorites (
    FavoriteID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    ProductID INT,
    FOREIGN KEY (UserID) REFERENCES User (UserID),
    FOREIGN KEY (ProductID) REFERENCES Product (ProductID)
);

-- Product-Category Junction Table (Many-to-Many)
CREATE TABLE Product_Category (
    ProductID INT,
    CategoryID INT,
    PRIMARY KEY (ProductID, CategoryID),
    FOREIGN KEY (ProductID) REFERENCES Product (ProductID),
    FOREIGN KEY (CategoryID) REFERENCES Category (CategoryID)
);

-- Login Authentication table
CREATE TABLE AuthVerification (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    VerificationCode VARCHAR(6) NOT NULL,
    Authenticated BOOLEAN DEFAULT FALSE,
    Date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -- Insert sample categories
-- INSERT INTO
--     Category (CategoryID, Name)
-- VALUES
--     (1, 'Electronics'),
--     (2, 'Clothing'),
--     (3, 'Books'),
--     (4, 'Home & Garden'),
--     (5, 'Sports & Outdoors');
-- -- -- USER CRUD OPERATIONS
-- -- -- Create User (INSERT)
-- -- INSERT INTO
-- --     User (Name, Email, UCID, Password, Phone, Address)
-- -- VALUES
-- --     (
-- --         'John Doe',
-- --         'john@example.com',
-- --         'UC123456',
-- --         'hashed_password_here',
-- --         '555-123-4567',
-- --         '123 Main St'
-- --     );
-- -- -- Set user role
-- -- INSERT INTO
-- --     UserRole (UserID, Client, Admin)
-- -- VALUES
-- --     (LAST_INSERT_ID (), TRUE, FALSE);
-- -- -- Read User (SELECT)
-- -- SELECT
-- --     u.*,
-- --     ur.Client,
-- --     ur.Admin
-- -- FROM
-- --     User u
-- --     JOIN UserRole ur ON u.UserID = ur.UserID
-- -- WHERE
-- --     u.UserID = 1;
-- -- -- Update User (UPDATE)
-- -- UPDATE User
-- -- SET
-- --     Name = 'John Smith',
-- --     Phone = '555-987-6543',
-- --     Address = '456 Elm St'
-- -- WHERE
-- --     UserID = 1;
-- -- -- Update User Role
-- -- UPDATE UserRole
-- -- SET
-- --     Admin = TRUE
-- -- WHERE
-- --     UserID = 1;
-- -- -- PRODUCT CRUD OPERATIONS
-- -- -- Create Product (INSERT)
-- -- INSERT INTO
-- --     Product (
-- --         ProductID,
-- --         Name,
-- --         Price,
-- --         StockQuantity,
-- --         UserID,
-- --         Description,
-- --         CategoryID
-- --     )
-- -- VALUES
-- --     (
-- --         1,
-- --         'Smartphone',
-- --         599.99,
-- --         50,
-- --         1,
-- --         'Latest model smartphone with amazing features',
-- --         1
-- --     );
-- -- -- Add product images with the placeholder URL
-- -- INSERT INTO
-- --     Image_URL (URL, ProductID)
-- -- VALUES
-- --     ('https://picsum.photos/id/237/200/300', 1),
-- --     ('https://picsum.photos/id/237/200/300', 1);
-- -- -- Create another product for recommendations
-- -- INSERT INTO
-- --     Product (
-- --         ProductID,
-- --         Name,
-- --         Price,
-- --         StockQuantity,
-- --         UserID,
-- --         Description,
-- --         CategoryID
-- --     )
-- -- VALUES
-- --     (
-- --         2,
-- --         'Tablet',
-- --         799.99,
-- --         30,
-- --         1,
-- --         'High-performance tablet',
-- --         1
-- --     );
-- -- -- Add placeholder images for the second product
-- -- INSERT INTO
-- --     Image_URL (URL, ProductID)
-- -- VALUES
-- --     ('https://picsum.photos/id/237/200/300', 2),
-- --     ('https://picsum.photos/id/237/200/300', 2);
-- -- -- Read Product (SELECT)
-- -- SELECT
-- --     p.*,
-- --     c.Name as CategoryName,
-- --     u.Name as SellerName,
-- --     i.URL as ImageURL
-- -- FROM
-- --     Product p
-- --     JOIN Category c ON p.CategoryID = c.CategoryID
-- --     JOIN User u ON p.UserID = u.UserID
-- --     LEFT JOIN Image_URL i ON p.ProductID = i.ProductID
-- -- WHERE
-- --     p.ProductID = 1;
-- -- -- Update Product (UPDATE)
-- -- UPDATE Product
-- -- SET
-- --     Name = 'Premium Smartphone',
-- --     Price = 649.99,
-- --     StockQuantity = 45,
-- --     Description = 'Updated description with new features'
-- -- WHERE
-- --     ProductID = 1;
-- -- -- CATEGORY CRUD OPERATIONS
-- -- -- Create Category (INSERT)
-- -- INSERT INTO
-- --     Category (CategoryID, Name)
-- -- VALUES
-- --     (6, 'Toys & Games');
-- -- -- Read Category (SELECT)
-- -- SELECT
-- --     *
-- -- FROM
-- --     Category
-- -- WHERE
-- --     CategoryID = 6;
-- -- -- Update Category (UPDATE)
-- -- UPDATE Category
-- -- SET
-- --     Name = 'Toys & Children''s Games'
-- -- WHERE
-- --     CategoryID = 6;
-- -- -- REVIEW OPERATIONS
-- -- INSERT INTO
-- --     Review (ReviewID, UserID, ProductID, Comment, Rating)
-- -- VALUES
-- --     (
-- --         1,
-- --         1,
-- --         1,
-- --         'Great product, very satisfied with the purchase!',
-- --         5
-- --     );
-- -- -- TRANSACTION OPERATIONS
-- -- INSERT INTO
-- --     Transaction (TransactionID, UserID, ProductID, PaymentStatus)
-- -- VALUES
-- --     (1, 1, 1, 'Completed');
-- -- -- HISTORY OPERATIONS
-- -- INSERT INTO
-- --     History (HistoryID, UserID, ProductID)
-- -- VALUES
-- --     (1, 1, 1);
-- -- -- Read History (SELECT)
-- -- SELECT
-- --     h.*,
-- --     p.Name as ProductName
-- -- FROM
-- --     History h
-- --     JOIN Product p ON h.ProductID = p.ProductID
-- -- WHERE
-- --     h.UserID = 1
-- -- ORDER BY
-- --     h.Date DESC;
-- -- -- FAVORITES OPERATIONS
-- -- INSERT INTO
-- --     Favorites (UserID, ProductID)
-- -- VALUES
-- --     (1, 1);
-- -- -- Read Favorites (SELECT)
-- -- SELECT
-- --     f.*,
-- --     p.Name as ProductName,
-- --     p.Price
-- -- FROM
-- --     Favorites f
-- --     JOIN Product p ON f.ProductID = p.ProductID
-- -- WHERE
-- --     f.UserID = 1;
-- -- -- RECOMMENDATION OPERATIONS
-- -- INSERT INTO
-- --     Recommendation (RecommendationID_PK, UserID, RecommendedProductID)
-- -- VALUES
-- --     (1, 1, 2);
-- -- -- Read Recommendations (SELECT)
-- -- SELECT
-- --     r.*,
-- --     p.Name as RecommendedProductName,
-- --     p.Price,
-- --     p.Description
-- -- FROM
-- --     Recommendation r
-- --     JOIN Product p ON r.RecommendedProductID = p.ProductID
-- -- WHERE
-- --     r.UserID = 1;
-- -- -- Authentication Operations
-- -- -- Create verification code
-- -- INSERT INTO
-- --     AuthVerification (Email, VerificationCode)
-- -- VALUES
-- --     ('new_user@example.com', '123456');
-- -- -- Update authentication status
-- -- UPDATE AuthVerification
-- -- SET
-- --     Authenticated = TRUE
-- -- WHERE
-- --     Email = 'new_user@example.com'
-- --     AND VerificationCode = '123456';
-- -- -- Get top-selling products
-- -- SELECT
-- --     p.ProductID,
-- --     p.Name,
-- --     COUNT(t.TransactionID) as SalesCount,
-- --     SUM(p.Price) as TotalRevenue
-- -- FROM
-- --     Product p
-- --     JOIN Transaction t ON p.ProductID = t.ProductID
-- -- WHERE
-- --     t.PaymentStatus = 'Completed'
-- -- GROUP BY
-- --     p.ProductID,
-- --     p.Name
-- -- ORDER BY
-- --     SalesCount DESC
-- -- LIMIT
-- --     10;
-- -- -- Get highest-rated products
-- -- SELECT
-- --     p.ProductID,
-- --     p.Name,
-- --     AVG(r.Rating) as AverageRating,
-- --     COUNT(r.ReviewID) as ReviewCount
-- -- FROM
-- --     Product p
-- --     JOIN Review r ON p.ProductID = r.ProductID
-- -- GROUP BY
-- --     p.ProductID,
-- --     p.Name
-- -- HAVING
-- --     ReviewCount >= 5
-- -- ORDER BY
-- --     AverageRating DESC
-- -- LIMIT
-- --     10;
-- -- -- Get user purchase history with product details
-- -- SELECT
-- --     t.TransactionID,
-- --     t.Date,
-- --     p.Name,
-- --     p.Price,
-- --     t.PaymentStatus
-- -- FROM
-- --     Transaction t
-- --     JOIN Product p ON t.ProductID = p.ProductID
-- -- WHERE
-- --     t.UserID = 1
-- -- ORDER BY
-- --     t.Date DESC;
