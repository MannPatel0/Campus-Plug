-- Inserting sample data into the Marketplace database
-- Clear existing data (if needed)
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
        'john.doe@example.com',
        'U123456',
        'hashedpassword1',
        '555-123-4567',
        '123 Main St, Calgary, AB'
    ),
    (
        2,
        'Jane Smith',
        'jane.smith@example.com',
        'U234567',
        'hashedpassword2',
        '555-234-5678',
        '456 Oak Ave, Calgary, AB'
    ),
    (
        3,
        'Michael Brown',
        'michael.b@example.com',
        'U345678',
        'hashedpassword3',
        '555-345-6789',
        '789 Pine Rd, Calgary, AB'
    ),
    (
        4,
        'Sarah Wilson',
        'sarah.w@example.com',
        'U456789',
        'hashedpassword4',
        '555-456-7890',
        '101 Elm Blvd, Calgary, AB'
    ),
    (
        5,
        'David Taylor',
        'david.t@example.com',
        'U567890',
        'hashedpassword5',
        '555-567-8901',
        '202 Maple Dr, Calgary, AB'
    );

-- Insert User Roles
INSERT INTO
    UserRole (UserID, Client, Admin)
VALUES
    (1, TRUE, TRUE),
    (2, TRUE, FALSE),
    (3, TRUE, FALSE),
    (4, TRUE, FALSE),
    (5, TRUE, FALSE);

-- Insert Categories
INSERT INTO
    Category (CategoryID, Name)
VALUES
    (1, 'Textbooks'),
    (2, 'Electronics'),
    (3, 'Furniture'),
    (4, 'Clothing'),
    (5, 'Sports Equipment'),
    (6, 'Musical Instruments'),
    (7, 'Art Supplies'),
    (8, 'Kitchen Appliances'),
    (9, 'Gaming'),
    (10, 'Bicycles'),
    (11, 'Computer Accessories'),
    (12, 'Stationery'),
    (13, 'Fitness Equipment'),
    (14, 'Winter Sports'),
    (15, 'Lab Equipment'),
    (16, 'Camping Gear'),
    (17, 'School Supplies'),
    (18, 'Office Furniture'),
    (19, 'Books (Non-textbook)'),
    (20, 'Math & Science Resources'),
    (21, 'Engineering Tools'),
    (22, 'Backpacks & Bags'),
    (23, 'Audio Equipment'),
    (24, 'Dorm Essentials'),
    (25, 'Smartphones & Tablets'),
    (26, 'Winter Clothing'),
    (27, 'Photography Equipment'),
    (28, 'Event Tickets'),
    (29, 'Software Licenses'),
    (30, 'Transportation (Car Pool)');

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
        2,
        '2023 HP Pavilion, 16GB RAM, 512GB SSD',
        2,
        '2024-10-10 14:30:00'
    ),
    (
        3,
        'Dorm Desk',
        120.00,
        1,
        3,
        'Sturdy desk perfect for studying, minor scratches',
        3,
        '2024-10-12 09:15:00'
    ),
    (
        4,
        'University Hoodie',
        35.00,
        3,
        1,
        'Size L, university logo, worn twice',
        4,
        '2024-10-14 16:45:00'
    ),
    (
        5,
        'Basketball',
        25.50,
        1,
        4,
        'Slightly used indoor basketball',
        5,
        '2024-10-11 11:20:00'
    ),
    (
        6,
        'Acoustic Guitar',
        175.00,
        1,
        2,
        'Beginner acoustic guitar with case',
        6,
        '2024-10-09 13:10:00'
    ),
    (
        7,
        'Physics Textbook',
        65.00,
        2,
        5,
        'University Physics 14th Edition, good condition',
        1,
        '2024-10-08 10:30:00'
    ),
    (
        8,
        'Mini Fridge',
        85.00,
        1,
        3,
        'Small dorm fridge, works perfectly',
        8,
        '2024-10-13 15:00:00'
    ),
    (
        9,
        'PlayStation 5 Controller',
        55.00,
        1,
        4,
        'Extra controller, barely used',
        9,
        '2024-10-07 17:20:00'
    ),
    (
        10,
        'Mountain Bike',
        350.00,
        1,
        5,
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
        3,
        'TI-84 Plus, perfect working condition',
        12,
        '2024-10-03 11:15:00'
    ),
    (
        14,
        'Yoga Mat',
        20.00,
        1,
        4,
        'Thick yoga mat, barely used',
        13,
        '2024-10-02 16:00:00'
    ),
    (
        15,
        'Winter Jacket',
        120.00,
        1,
        5,
        'Columbia winter jacket, size XL, very warm',
        26,
        '2024-10-01 10:20:00'
    ),
    (
        16,
        'Computer Science Textbook',
        70.00,
        1,
        1,
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
        3,
        'Casio scientific calculator',
        12,
        '2024-09-28 11:30:00'
    ),
    (
        19,
        'Bluetooth Speaker',
        45.00,
        1,
        4,
        'JBL Bluetooth speaker, great sound',
        23,
        '2024-09-27 15:45:00'
    ),
    (
        20,
        'Backpack',
        40.00,
        1,
        5,
        'North Face backpack, lots of pockets',
        22,
        '2024-09-26 09:15:00'
    );

-- Insert Image URLs
INSERT INTO
    Image_URL (URL, ProductID)
VALUES
    ('/image1.avif', 1),
    ('/image1.avif', 2),
    ('/image1.avif', 3),
    ('/image1.avif', 4),
    ('/image1.avif', 5),
    ('/image1.avif', 6),
    ('/image1.avif', 7),
    ('/image1.avif', 8),
    ('/image1.avif', 9),
    ('/image1.avif', 10);

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

-- Backpack: Backpacks & Bags, School Supplies, Dorm Essentials
-- Insert History records
--
INSERT INTO
    History (HistoryID, UserID, ProductID, Date)
VALUES
    (1, 1, 1, '2024-10-15 11:30:00'),
    (2, 1, 2, '2024-10-14 13:45:00'),
    (3, 1, 5, '2024-10-13 09:20:00'),
    (4, 1, 4, '2024-10-12 16:10:00');

--
INSERT INTO
    History (HistoryID, UserID, ProductID, Date)
VALUES
    (1, 2, 1, '2024-10-15 11:30:00'), -- User 2 viewed Calculus Textbook
    (2, 3, 2, '2024-10-14 13:45:00'), -- User 3 viewed HP Laptop
    (3, 4, 3, '2024-10-13 09:20:00'), -- User 4 viewed Dorm Desk
    (4, 5, 4, '2024-10-12 16:10:00'), -- User 5 viewed University Hoodie
    (5, 1, 5, '2024-10-11 14:30:00'), -- User 1 viewed Basketball
    (6, 2, 6, '2024-10-10 10:15:00'), -- User 2 viewed Acoustic Guitar
    (7, 3, 7, '2024-10-09 15:40:00'), -- User 3 viewed Physics Textbook
    (8, 4, 8, '2024-10-08 11:25:00'), -- User 4 viewed Mini Fridge
    (9, 5, 9, '2024-10-07 17:50:00'), -- User 5 viewed PS5 Controller
    (10, 1, 10, '2024-10-06 14:15:00');

-- User 1 viewed Mountain Bike
-- Insert Reviews
INSERT INTO
    Review (
        ReviewID,
        UserID,
        ProductID,
        Comment,
        Rating,
        Date
    )
VALUES
    (
        1,
        2,
        1,
        'Great condition, exactly as described!',
        5,
        '2024-10-16 09:30:00'
    ),
    (
        2,
        3,
        2,
        'Works well, but had a small scratch not mentioned in the listing.',
        4,
        '2024-10-15 14:20:00'
    ),
    (
        3,
        4,
        6,
        'Perfect for beginners, sounds great!',
        5,
        '2024-10-14 11:10:00'
    ),
    (
        4,
        5,
        8,
        'Keeps my drinks cold, but a bit noisy at night.',
        3,
        '2024-10-13 16:45:00'
    ),
    (
        5,
        1,
        10,
        'Excellent bike, well maintained!',
        5,
        '2024-10-12 13:25:00'
    );

-- Insert Favorites
INSERT INTO
    Favorites (UserID, ProductID)
VALUES
    (1, 2), -- User 1 likes HP Laptop
    (1, 7), -- User 1 likes Physics Textbook
    (2, 3), -- User 2 likes Dorm Desk
    (2, 10), -- User 2 likes Mountain Bike
    (3, 6), -- User 3 likes Acoustic Guitar
    (4, 5), -- User 4 likes Basketball
    (5, 8);

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
    (1, 2, 1, '2024-10-16 10:30:00', 'Completed'),
    (2, 3, 6, '2024-10-15 15:45:00', 'Completed'),
    (3, 4, 8, '2024-10-14 12:20:00', 'Pending'),
    (4, 5, 10, '2024-10-13 17:10:00', 'Completed'),
    (5, 1, 4, '2024-10-12 14:30:00', 'Completed');

-- Insert Recommendations
INSERT INTO
    Recommendation (RecommendationID_PK, UserID, RecommendedProductID)
VALUES
    (1, 1, 7), -- Recommend Physics Textbook to User 1
    (2, 1, 13), -- Recommend Graphing Calculator to User 1
    (3, 2, 3), -- Recommend Dorm Desk to User 2
    (4, 2, 17), -- Recommend Desk Lamp to User 2
    (5, 3, 16), -- Recommend CS Textbook to User 3
    (6, 4, 14), -- Recommend Yoga Mat to User 4
    (7, 5, 15);

INSERT INTO
    Recommendation (RecommendationID_PK, UserID, RecommendedProductID)
VALUES
    (12, 1, 19),
    (13, 1, 9),
    (14, 1, 11),
    (15, 1, 16),
    -- Insert Authentication records
INSERT INTO
    AuthVerification (Email, VerificationCode, Authenticated, Date)
VALUES
    (
        'john.doe@example.com',
        '123456',
        TRUE,
        '2024-10-01 09:00:00'
    ),
    (
        'jane.smith@example.com',
        '234567',
        TRUE,
        '2024-10-02 10:15:00'
    ),
    (
        'michael.b@example.com',
        '345678',
        TRUE,
        '2024-10-03 11:30:00'
    ),
    (
        'sarah.w@example.com',
        '456789',
        TRUE,
        '2024-10-04 12:45:00'
    ),
    (
        'david.t@example.com',
        '567890',
        TRUE,
        '2024-10-05 14:00:00'
    );

INSERT INTO
    Product (
        ProductID,
        Name,
        Description,
        Price,
        StockQuantity,
        CategoryID
    )
VALUES
    (
        101,
        'Smart Coffee Maker',
        'Wi-Fi enabled coffee machine with scheduling feature',
        129.99,
        50,
        11
    ),
    (
        102,
        'Ergonomic Office Chair',
        'Adjustable mesh chair with lumbar support',
        199.99,
        35,
        12
    ),
    (
        103,
        'Wireless Mechanical Keyboard',
        'RGB-backlit wireless keyboard with mechanical switches',
        89.99,
        60,
        13
    ),
    (
        104,
        'Portable Solar Charger',
        'Foldable solar power bank with USB-C support',
        59.99,
        40,
        14
    ),
    (
        105,
        'Noise-Canceling Headphones',
        'Over-ear Bluetooth headphones with ANC',
        179.99,
        25,
        15
    ),
    (
        106,
        'Smart Water Bottle',
        'Tracks water intake and glows as a hydration reminder',
        39.99,
        75,
        11
    ),
    (
        107,
        'Compact Air Purifier',
        'HEPA filter air purifier for small rooms',
        149.99,
        30,
        16
    ),
    (
        108,
        'Smart LED Desk Lamp',
        'Adjustable LED lamp with voice control',
        69.99,
        45,
        12
    ),
    (
        109,
        '4K Streaming Device',
        'HDMI streaming stick with voice remote',
        49.99,
        80,
        17
    ),
    (
        110,
        'Smart Plant Monitor',
        'Bluetooth-enabled sensor for plant health tracking',
        34.99,
        55,
        18
    ),
    (
        111,
        'Wireless Charging Pad',
        'Fast-charging pad for Qi-compatible devices',
        29.99,
        90,
        13
    ),
    (
        112,
        'Mini Projector',
        'Portable projector with built-in speakers',
        129.99,
        20,
        14
    ),
    (
        113,
        'Foldable Bluetooth Keyboard',
        'Ultra-thin keyboard for travel use',
        39.99,
        70,
        19
    ),
    (
        114,
        'Smart Alarm Clock',
        'AI-powered alarm clock with sunrise simulation',
        79.99,
        40,
        15
    ),
    (
        115,
        'Touchscreen Toaster',
        'Customizable toaster with a digital display',
        99.99,
        30,
        11
    ),
    (
        116,
        'Cordless Vacuum Cleaner',
        'Lightweight handheld vacuum with strong suction',
        159.99,
        25,
        16
    ),
    (
        117,
        'Smart Bike Lock',
        'Fingerprint and app-controlled bike security lock',
        89.99,
        35,
        20
    ),
    (
        118,
        'Bluetooth Sleep Headband',
        'Comfortable sleep headband with built-in speakers',
        49.99,
        60,
        18
    ),
    (
        119,
        'Retro Game Console',
        'Plug-and-play console with 500+ classic games',
        79.99,
        50,
        17
    ),
    (
        120,
        'Automatic Pet Feeder',
        'App-controlled food dispenser for pets',
        99.99,
        40,
        20
    );

SELECT
    p.*,
    i.URL AS image_url
FROM
    Product p
    LEFT JOIN Image_URL i ON p.ProductID = i.ProductID
WHERE
    p.ProductID = 1
