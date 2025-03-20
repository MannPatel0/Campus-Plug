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

-- Category Entity  (must be created before Product or else error)
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
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    CategoryID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User (UserID),
    FOREIGN KEY (CategoryID) REFERENCES Category (CategoryID)
);

CREATE TABLE Image_URL (
    URL VARCHAR(255),
    FOREIGN KEY (ProductID) REFERENCES Product (ProductID)
)


-- Review Entity (Many-to-One with User, Many-to-One with Product)
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
    FOREIGN KEY (ProductID) REFERENCES Product (ProductID)
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
    RecommendationID_PK INT PRIMARY KEY,
    UserID INT,
    RecommendedProductID INT,
    FOREIGN KEY (UserID) REFERENCES User (UserID),
    FOREIGN KEY (RecommendedProductID) REFERENCES Product (ProductID)
);

-- History Entity (Many-to-One with User, Many-to-One with Product)
CREATE TABLE History (
    HistoryID INT PRIMARY KEY,
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

-- Login Authentication table, Store the userID,and a emailed code of user who have not authenticated,
CREATE TABLE AuthVerification (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    VerificationCode VARCHAR(6) NOT NULL,
    Authenticated BOOLEAN DEFAULT FALSE,
    Date DATETIME DEFAULT CURRENT_TIMESTAMP
);
