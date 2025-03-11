-- Create the main User table with auto-incrementing ID
CREATE TABLE Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    UCID VARCHAR(20) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Phone VARCHAR(20),
    Address VARCHAR(255)
);

-- Create a separate table for the multi-valued Role attribute
CREATE TABLE UserRole (
    UserID INT,
    Role VARCHAR(20) NOT NULL, -- Contains 'Buyer', 'Seller', or 'Admin'
    PRIMARY KEY (UserID, Role),
    FOREIGN KEY (UserID) REFERENCES Users (ID) ON DELETE CASCADE
);
