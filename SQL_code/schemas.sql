-- User Entity
CREATE TABLE User (
    UserID_PK INT PRIMARY KEY,
    Password VARCHAR(255),
    IP VARCHAR(15),
    Name VARCHAR(100),
    Email VARCHAR(255),
    UCID VARCHAR(20),
    Phone VARCHAR(20),
    Role VARCHAR(50),
    Address VARCHAR(255)
);

-- Buyer, Seller, Admin are roles within User (handled by Role attribute)

-- Product Entity
CREATE TABLE Product (
    ProductID_PK INT PRIMARY KEY,
    ProductID VARCHAR(50),
    Price DECIMAL(10, 2),
    Description TEXT,
    StockQuantity INT
);

-- Category Entity
CREATE TABLE Category (
    CategoryID_PK INT PRIMARY KEY,
    Name VARCHAR(100)
);

-- Review Entity (Many-to-One with User, Many-to-One with Product)
CREATE TABLE Review (
    ReviewID INT PRIMARY KEY,
    UserID_FK INT,
    ProductID_FK INT,
    Comment TEXT,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),
    Date DATE,
    FOREIGN KEY (UserID_FK) REFERENCES User(UserID_PK),
    FOREIGN KEY (ProductID_FK) REFERENCES Product(ProductID_PK)
);

-- Transaction Entity (Many-to-One with User, Many-to-One with Product)
CREATE TABLE Transaction (
    TransactionID_PK INT PRIMARY KEY,
    UserID_FK INT,
    ProductID_FK INT,
    Date DATE,
    PaymentStatus VARCHAR(50),
    FOREIGN KEY (UserID_FK) REFERENCES User(UserID_PK),
    FOREIGN KEY (ProductID_FK) REFERENCES Product(ProductID_PK)
);

-- Recommendation Entity (Many-to-One with User, Many-to-One with Product)
CREATE TABLE Recommendation (
    RecommendationID_PK INT PRIMARY KEY,
    UserID_FK INT,
    RecommendedProductID_FK INT,
    FOREIGN KEY (UserID_FK) REFERENCES User(UserID_PK),
    FOREIGN KEY (RecommendedProductID_FK) REFERENCES Product(ProductID_PK)
);

-- History Entity (Many-to-One with User, Many-to-One with Product)
CREATE TABLE History (
    HistoryID INT PRIMARY KEY,
    UserID_FK INT,
    ProductID_FK INT,
    TimeStamp DATETIME,
    FOREIGN KEY (UserID_FK) REFERENCES User(UserID_PK),
    FOREIGN KEY (ProductID_FK) REFERENCES Product(ProductID_PK)
);

-- Favorites Entity (Many-to-One with User, Many-to-One with Product)
CREATE TABLE Favorites (
    FavoriteID INT PRIMARY KEY,
    UserID_FK INT,
    ProductID_FK INT,
    FOREIGN KEY (UserID_FK) REFERENCES User(UserID_PK),
    FOREIGN KEY (ProductID_FK) REFERENCES Product(ProductID_PK)
);

-- Product-Category Junction Table (Many-to-Many)
CREATE TABLE Product_Category (
    ProductID_FK INT,
    CategoryID_FK INT,
    PRIMARY KEY (ProductID_FK, CategoryID_FK),
    FOREIGN KEY (ProductID_FK) REFERENCES Product(ProductID_PK),
    FOREIGN KEY (CategoryID_FK) REFERENCES Category(CategoryID_PK)
);