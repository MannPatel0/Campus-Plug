import express, { json } from "express";
import cors from "cors";
import mysql from "mysql2";
import nodemailer from "nodemailer";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

//TODO: Connect with the database:
const db_con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "marketplace",
  enableKeepAlive: true, // false by default.
});

db_con.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Configure email transporter for Zoho
const transporter = nodemailer.createTransport({
  host: "smtp.zohocloud.ca",
  secure: true,
  port: 465,
  auth: {
    user: "campusplug@zohomailcloud.ca", //Zoho email
    pass: "e0YRrNSeJZQd", //Zoho password
  },
});

// Test the email connection
transporter
  .verify()
  .then(() => {
    console.log("Email connection successful!");
  })
  .catch((error) => {
    console.error("Email connection failed:", error);
  });
// Generate and send verification code for signup
app.post("/send-verification", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Generate a random 6-digit code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    console.log(
      `Generated verification code for ${email}: ${verificationCode}`,
    );

    // Check if email already exists in verification table
    db_con.query(
      "SELECT * FROM AuthVerification WHERE Email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (results.length > 0) {
          // Update existing record
          db_con.query(
            `UPDATE AuthVerification SET VerificationCode = ?, Authenticated = FALSE, Date = CURRENT_TIMESTAMP
            WHERE Email = ?`,
            [verificationCode, email],
            async (err) => {
              if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
              }

              // Send email and respond
              await sendVerificationEmail(email, verificationCode);
              res.json({ success: true, message: "Verification code sent" });
            },
          );
        } else {
          // Insert new record
          db_con.query(
            "INSERT INTO AuthVerification (Email, VerificationCode, Authenticated) VALUES (?, ?, FALSE)",
            [email, verificationCode],
            async (err) => {
              if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
              }

              // Send email and respond
              await sendVerificationEmail(email, verificationCode);
              res.json({ success: true, message: "Verification code sent" });
            },
          );
        }
      },
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Helper function to send email
async function sendVerificationEmail(email, verificationCode) {
  // Send the email with Zoho
  await transporter.sendMail({
    from: "campusplug@zohomailcloud.ca",
    to: email,
    subject: "Campus Plug: Signup Verification Code",
    text: `Your verification code is: ${verificationCode}. This code will expire in 15 minutes.`,
    html: `<p>Your verification code is: <strong>${verificationCode}</strong></p><p>This code will expire in 15 minutes.</p>`,
  });

  console.log(`Verification code sent to ${email}`);
}

// Verify the code
app.post("/verify-code", (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  console.log(`Attempting to verify code for ${email}: ${code}`);

  // Check verification code
  db_con.query(
    "SELECT * FROM AuthVerification WHERE Email = ? AND VerificationCode = ? AND Authenticated = 0 AND Date > DATE_SUB(NOW(), INTERVAL 15 MINUTE)",
    [email, code],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        console.log(`Invalid or expired verification code for email ${email}`);
        return res
          .status(400)
          .json({ error: "Invalid or expired verification code" });
      }

      const userId = results[0].UserID;

      // Mark as authenticated
      db_con.query(
        "UPDATE AuthVerification SET Authenticated = TRUE WHERE Email = ?",
        [email],
        (err) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
          }

          console.log(`Email ${email} successfully verified`);

          res.json({
            success: true,
            message: "Verification successful",
            userId,
          });
        },
      );
    },
  );
});

// Create a users and Complete user registration after verification
app.post("/complete-signup", (req, res) => {
  const data = req.body;

  db_con.query(
    `SELECT * FROM AuthVerification WHERE Email = '${data.email}' AND Authenticated = 1;`,
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length === 0) {
        return res.status(400).json({ error: "Email not verified" });
      }

      // Create the user
      db_con.query(
        `INSERT INTO User (Name, Email, UCID, Password, Phone, Address)
        VALUES ('${data.name}', '${data.email}', '${data.UCID}', '${data.password}', '${data.phone}', '${data.address}')`,
        (err, result) => {
          if (err) {
            console.error("Error creating user:", err);
            return res.status(500).json({ error: "Could not create user" });
          }

          // Insert role using the user's ID
          db_con.query(
            `INSERT INTO UserRole (UserID, Client, Admin)
            VALUES (LAST_INSERT_ID(), ${data.client || true}, ${data.admin || false})`,
            (roleErr) => {
              if (roleErr) {
                console.error("Error creating role:", roleErr);
                return res.status(500).json({ error: "Could not create role" });
              }

              // Delete verification record
              db_con.query(
                `DELETE FROM AuthVerification WHERE Email = '${data.email}'`,
                (deleteErr) => {
                  if (deleteErr) {
                    console.error("Error deleting verification:", deleteErr);
                  }
                  res.json({
                    success: true,
                    message: "User registration completed successfully",
                    name: data.name,
                    email: data.email,
                    UCID: data.UCID,
                  });
                },
              );
            },
          );
        },
      );
    },
  );
});

// Clean up expired verification codes (run this periodically)
function cleanupExpiredCodes() {
  db_con.query(
    "DELETE FROM AuthVerification WHERE Date < DATE_SUB(NOW(), INTERVAL 15 MINUTE) AND Authenticated = 0",
    (err, result) => {
      if (err) {
        console.error("Error cleaning up expired codes:", err);
      } else {
        console.log(`Cleaned up ${result} expired verification codes`);
      }
    },
  );
}

// Set up a scheduler to run cleanup every hour
setInterval(cleanupExpiredCodes, 60 * 60 * 1000);
//Fetch all users data:
app.get("/fetch_all_users", (req, res) => {
  db_con.query("SELECT * FROM User;", (err, data) => {
    if (err) {
      console.error("Errors: ", err);
      return res.status(500).json({ error: "\nCould not fetch users!" });
    }
    res.json({ Users: data });
  });
});

//Fetch One user Data with all fields:
app.post("/find_user", (req, res) => {
  const { email } = req.body;

  // Input validation
  if (!email) {
    return res.status(400).json({
      found: false,
      error: "Email is required",
    });
  }

  // Query to find user with matching email and password
  const query = "SELECT * FROM User WHERE email = ?";
  db_con.query(query, [email], (err, data) => {
    if (err) {
      console.error("Error finding user:", err);
      return res.status(500).json({
        found: false,
        error: "Database error occurred",
      });
    }

    // Check if user was found
    if (data && data.length > 0) {
      console.log(data);
      const user = data[0];

      // Return all user data except password
      return res.json({
        found: true,
        userID: user.UserID,
        name: user.Name,
        email: user.Email,
        UCID: user.UCID,
        phone: user.Phone,
        address: user.Address,
        // Include any other fields your user might have
        // Make sure the field names match exactly with your database column names
      });
    } else {
      // User not found or invalid credentials
      return res.json({
        found: false,
        error: "Invalid email or password",
      });
    }
  });
});

//Update A uses Data:
app.post("/update", (req, res) => {
  const { userId, ...updateData } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  //query dynamically based on provided fields
  const updateFields = [];
  const values = [];

  Object.entries(updateData).forEach(([key, value]) => {
    // Only include fields that are actually in the User table
    if (["Name", "Email", "Password", "Phone", "UCID"].includes(key)) {
      updateFields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (updateFields.length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  // Add userId to values array
  values.push(userId);

  const query = `UPDATE User SET ${updateFields.join(", ")} WHERE UserID = ?`;

  db_con.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "Could not update user" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "User updated successfully" });
  });
});

//Delete A uses Data:
app.post("/delete", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Delete from UserRole first (assuming foreign key constraint)
  db_con.query("DELETE FROM UserRole WHERE UserID = ?", [userId], (err) => {
    if (err) {
      console.error("Error deleting user role:", err);
      return res.status(500).json({ error: "Could not delete user role" });
    }

    // Then delete from User table
    db_con.query(
      "DELETE FROM User WHERE UserID = ?",
      [userId],
      (err, result) => {
        if (err) {
          console.error("Error deleting user:", err);
          return res.status(500).json({ error: "Could not delete user" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        res.json({ success: true, message: "User deleted successfully" });
      },
    );
  });
});

app.post("/add_fav_product", (req, res) => {
  const { userID, productsID } = req.body;

  // Use parameterized query to prevent SQL injection
  db_con.query(
    "INSERT INTO Favorites (UserID, ProductID) VALUES (?, ?)",
    [userID, productsID],
    (err, result) => {
      if (err) {
        console.error("Error adding favorite product:", err);
        return res.json({ error: "Could not add favorite product" });
      }
      res.json({
        success: true,
        message: "Product added to favorites successfully",
      });
    },
  );
});

app.get("/get_product", (req, res) => {
  const query = "SELECT * FROM Product";
  db_con.query(query, (err, data) => {
    if (err) {
      console.error("Error finding user:", err);
      return res.status(500).json({
        found: false,
        error: "Database error occurred",
      });
    }
    res.json({
      success: true,
      message: "Product added to favorites successfully",
      data,
    });
  });
});

// db_con.query(
//   "SELECT ProductID FROM product WHERE ProductID = ?",
//   [productID],
//   (err, results) => {
//     if (err) {
//       console.error("Error checking product:", err);
//       return res.json({ error: "Database error" });
//     }

//     if (results.length === 0) {
//       return res.json({ error: "Product does not exist" });
//     }
//   },
// );

// db_con.query(
//   "INSERT INTO Favorites (UserID, ProductID) VALUES (?, ?)",
//   [userID, productID],
//   (err, result) => {
//     if (err) {
//       console.error("Error adding favorite product:", err);
//       return res.json({ error: "Could not add favorite product" });
//     }
//     res.json({
//       success: true,
//       message: "Product added to favorites successfully",
//     });
//   },
// );

app.listen(3030, () => {
  console.log(`Running Backend on http://localhost:3030/`);
  console.log(`Send verification code: POST /send-verification`);
  console.log(`Verify code: POST /verify-code`);
});
