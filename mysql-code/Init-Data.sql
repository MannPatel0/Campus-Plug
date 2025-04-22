-- Inserting sample data into the Marketplace database
SET
    FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Product_Category;

TRUNCATE TABLE Favorites;

TRUNCATE TABLE History;

TRUNCATE TABLE Recommendation;

TRUNCATE TABLE Transaction;

TRUNCATE TABLE Review;

TRUNCATE TABLE Image_URL;

TRUNCATE TABLE Product;

TRUNCATE TABLE Category;

TRUNCATE TABLE UserRole;

TRUNCATE TABLE User;

TRUNCATE TABLE AuthVerification;

SET
    FOREIGN_KEY_CHECKS = 1;

-- Insert Users
INSERT INTO
    User (
        UserID,
        Name,
        Email,
        UCID,
        Password,
        Phone,
        Address
    )
VALUES
    (
        1,
        'John Doe',
        'john.doe@ucalgary.ca',
        'U123456',
        'hashedpassword1',
        '555-123-4567',
        '123 Main St, Calgary, AB'
    ),
    (
        2,
        'Jane Smith',
        'jane.smith@ucalgary.ca',
        'U234567',
        'hashedpassword2',
        '555-234-5678',
        '456 Oak Ave, Calgary, AB'
    );

-- Insert User Roles
INSERT INTO
    UserRole (UserID, Client, Admin)
VALUES
    (1, TRUE, TRUE),
    (2, TRUE, FALSE);

-- Insert Categories
-- Insert Categories
INSERT INTO
    Category (Name)
VALUES
    ('Other'),
    ('Textbooks'),
    ('Electronics'),
    ('Furniture'),
    ('Clothing'),
    ('Sports Equipment'),
    ('Musical Instruments'),
    ('Art Supplies'),
    ('Kitchen Appliances'),
    ('Gaming'),
    ('Bicycles'),
    ('Computer Accessories'),
    ('Stationery'),
    ('Fitness Equipment'),
    ('Winter Sports'),
    ('Lab Equipment'),
    ('Camping Gear'),
    ('School Supplies'),
    ('Office Furniture'),
    ('Books (-textbook)'),
    ('Math & Science Resources'),
    ('Engineering Tools'),
    ('Backpacks & Bags'),
    ('Audio Equipment'),
    ('Dorm Essentials'),
    ('Smartphones & Tablets'),
    ('Winter Clothing'),
    ('Photography Equipment'),
    ('Event Tickets'),
    ('Software Licenses');

-- Insert Products
INSERT INTO
    Product (
        ProductID,
        Name,
        Price,
        StockQuantity,
        UserID,
        Description,
        CategoryID,
        Date
    )
VALUES
    (
        1,
        'Calculus Textbook 8th Edition',
        79.99,
        5,
        1,
        'Like new calculus textbook, minor highlighting',
        1,
        '2024-10-15 10:00:00'
    ),
    (
        2,
        'HP Laptop',
        699.99,
        1,
        1,
        '2023 HP Pavilion, 16GB RAM, 512GB SSD',
        2,
        '2024-10-10 14:30:00'
    ),
    (
        3,
        'Dorm Desk',
        120.00,
        1,
        2,
        'Sturdy desk perfect for studying, minor scratches',
        3,
        '2024-10-12 09:15:00'
    ),
    (
        4,
        'University Hoodie',
        35.00,
        3,
        2,
        'Size L, university logo, worn twice',
        4,
        '2024-10-14 16:45:00'
    ),
    (
        5,
        'Basketball',
        25.50,
        1,
        2,
        'Slightly used indoor basketball',
        5,
        '2024-10-11 11:20:00'
    ),
    (
        6,
        'Acoustic Guitar',
        175.00,
        1,
        1,
        'Beginner acoustic guitar with case',
        6,
        '2024-10-09 13:10:00'
    ),
    (
        7,
        'Physics Textbook',
        65.00,
        2,
        2,
        'University Physics 14th Edition, good condition',
        1,
        '2024-10-08 10:30:00'
    ),
    (
        8,
        'Mini Fridge',
        85.00,
        1,
        1,
        'Small dorm fridge, works perfectly',
        8,
        '2024-10-13 15:00:00'
    ),
    (
        9,
        'PlayStation 5 Controller',
        55.00,
        1,
        2,
        'Extra controller, barely used',
        9,
        '2024-10-07 17:20:00'
    ),
    (
        10,
        'Mountain Bike',
        350.00,
        1,
        1,
        'Trek mountain bike, great condition, new tires',
        10,
        '2024-10-06 14:00:00'
    ),
    (
        11,
        'Wireless Mouse',
        22.99,
        3,
        1,
        'Logitech wireless mouse with battery',
        11,
        '2024-10-05 09:30:00'
    ),
    (
        12,
        'Chemistry Lab Coat',
        30.00,
        2,
        2,
        'Size M, required for chem labs',
        15,
        '2024-10-04 13:45:00'
    ),
    (
        13,
        'Graphing Calculator',
        75.00,
        1,
        1,
        'TI-84 Plus, perfect working condition',
        12,
        '2024-10-03 11:15:00'
    ),
    (
        14,
        'Yoga Mat',
        20.00,
        1,
        2,
        'Thick yoga mat, barely used',
        13,
        '2024-10-02 16:00:00'
    ),
    (
        15,
        'Winter Jacket',
        120.00,
        1,
        1,
        'Columbia winter jacket, size XL, very warm',
        26,
        '2024-10-01 10:20:00'
    ),
    (
        16,
        'Computer Science Textbook',
        70.00,
        1,
        2,
        'Introduction to Algorithms, like new',
        1,
        '2024-09-30 14:30:00'
    ),
    (
        17,
        'Desk Lamp',
        15.00,
        2,
        2,
        'LED desk lamp with adjustable brightness',
        24,
        '2024-09-29 12:00:00'
    ),
    (
        18,
        'Scientific Calculator',
        25.00,
        1,
        1,
        'Casio scientific calculator',
        12,
        '2024-09-28 11:30:00'
    ),
    (
        19,
        'Bluetooth Speaker',
        45.00,
        1,
        1,
        'JBL Bluetooth speaker, great sound',
        23,
        '2024-09-27 15:45:00'
    ),
    (
        20,
        'Backpack',
        40.00,
        1,
        2,
        'North Face backpack, lots of pockets',
        22,
        '2024-09-26 09:15:00'
    );

INSERT INTO
    Image_URL (URL, ProductID)
VALUES
    ('/Uploads/Dell1.jpg', 1),
    ('/Uploads/Dell2.jpg', 1),
    ('/Uploads/Dell3.jpg', 1),
    ('/Uploads/HP-Laptop1.jpg', 2),
    ('/Uploads/HP-Laptop1.jpg', 2),
    ('/Uploads/Dorm-Desk.jpg', 3),
    ('/Uploads/University-Hoodie.jpg', 4),
    ('/Uploads/Basketball.jpg', 5),
    ('/Uploads/Acoustic-Guitar.jpg', 6),
    ('/Uploads/Physics-Textbook.jpg', 7),
    ('/Uploads/Mini-Fridge.jpg', 8),
    ('/Uploads/Controller.jpg', 9),
    ('/Uploads/Mountain-Bike.jpg', 10),
    ('/Uploads/Wireless-Mouse.jpg', 11),
    ('/Uploads/Lab-Coat.jpg', 12),
    ('/Uploads/Calculator.jpg', 13),
    ('/Uploads/Yoga-Mat.jpg', 14),
    ('/Uploads/Winter-Jacket.jpg', 15),
    ('/Uploads/CS-Textbook.jpg', 16),
    ('/Uploads/Desk-Lamp.jpg', 17),
    ('/Uploads/HP-Calculator.jpg', 18),
    ('/Uploads/Bluetooth-Speaker.jpg', 19),
    ('/Uploads/Backpack.jpg', 20);

-- Insert Product-Category relationships (products with multiple categories)
INSERT INTO
    Product_Category (ProductID, CategoryID)
VALUES
    (1, 1),
    (1, 17),
    (1, 20), -- Calculus book: Textbooks, School Supplies, Math Resources
    (2, 2),
    (2, 11),
    (2, 25), -- Laptop: Electronics, Computer Accessories, Smartphones & Tablets
    (3, 3),
    (3, 18),
    (3, 24), -- Desk: Furniture, Office Furniture, Dorm Essentials
    (4, 4),
    (4, 26), -- Hoodie: Clothing, Winter Clothing
    (5, 5),
    (5, 13), -- Basketball: Sports Equipment, Fitness Equipment
    (6, 6),
    (6, 23), -- Guitar: Musical Instruments, Audio Equipment
    (7, 1),
    (7, 15),
    (7, 20), -- Physics book: Textbooks, Lab Equipment, Math & Science Resources
    (8, 8),
    (8, 24), -- Mini Fridge: Kitchen Appliances, Dorm Essentials
    (9, 9),
    (9, 2), -- PS5 Controller: Gaming, Electronics
    (10, 10),
    (10, 5),
    (10, 13), -- Mountain Bike: Bicycles, Sports Equipment, Fitness Equipment
    (11, 11),
    (11, 2), -- Mouse: Computer Accessories, Electronics
    (12, 15),
    (12, 17), -- Lab Coat: Lab Equipment, School Supplies
    (13, 12),
    (13, 17),
    (13, 20), -- Calculator: Stationery, School Supplies, Math & Science Resources
    (14, 13),
    (14, 5), -- Yoga Mat: Fitness Equipment, Sports Equipment
    (15, 26),
    (15, 4),
    (15, 14), -- Winter Jacket: Winter Clothing, Clothing, Winter Sports
    (16, 1),
    (16, 17),
    (16, 19), -- CS Book: Textbooks, School Supplies, Books (Non-textbook)
    (17, 24),
    (17, 2), -- Desk Lamp: Dorm Essentials, Electronics
    (18, 12),
    (18, 17),
    (18, 20), -- Scientific Calculator: Stationery, School Supplies, Math & Science
    (19, 23),
    (19, 2),
    (19, 24), -- Bluetooth Speaker: Audio Equipment, Electronics, Dorm Essentials
    (20, 22),
    (20, 17),
    (20, 24);

-- Insert History records
INSERT INTO
    History (HistoryID, UserID, ProductID)
VALUES
    (1, 1, 1),
    (2, 1, 3),
    (3, 1, 5),
    (4, 1, 7),
    (5, 1, 9),
    (6, 1, 11),
    (7, 2, 2),
    (8, 2, 4),
    (9, 2, 5),
    (10, 1, 15),
    (11, 1, 18);

-- Insert Favorites
INSERT INTO
    Favorites (UserID, ProductID)
VALUES
    (1, 2), -- User 1 likes HP Laptop
    (1, 7), -- User 1 likes Physics Textbook
    (2, 3), -- User 2 likes Dorm Desk
    (2, 10), -- User 2 likes Mountain Bike
    (1, 6), -- User 3 likes Acoustic Guitar
    (1, 5), -- User 4 likes Basketball
    (2, 8);

-- User 5 likes Mini Fridge
-- Insert Transactions
INSERT INTO
    Transaction (
        TransactionID,
        UserID,
        ProductID,
        Date,
        PaymentStatus
    )
VALUES
    (1, 1, 1, '2024-10-16 10:30:00', 'Completed'),
    (2, 1, 6, '2024-10-15 15:45:00', 'Completed'),
    (3, 1, 8, '2024-10-14 12:20:00', 'Pending'),
    (4, 2, 10, '2024-10-13 17:10:00', 'Completed'),
    (5, 2, 4, '2024-10-12 14:30:00', 'Completed');

INSERT INTO
    Review (UserID, ProductID, Comment, Rating, Date)
VALUES
    (
        1,
        1,
        'This is a great fake product! Totally recommend it.',
        5,
        '2024-10-02 16:00:00'
    )
