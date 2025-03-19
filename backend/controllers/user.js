const crypto = require("crypto");
const db = require("../utils/database");
const { sendVerificationEmail } = require("../utils/helper");

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Generate a random 6-digit code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    console.log(
      `Generated verification code for ${email}: ${verificationCode}`
    );

    // Check if email already exists in verification table
    db.execute(
      "SELECT * FROM AuthVerification WHERE Email = ?",
      [email],
      async (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (results.length > 0) {
          // Update existing record
          db.execute(
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
            }
          );
        } else {
          // Insert new record
          db.execute(
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
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.verifyCode = (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  console.log(`Attempting to verify code for ${email}: ${code}`);

  // Check verification code
  db.execute(
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
      db.execute(
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
        }
      );
    }
  );
};

exports.completeSignUp = (req, res) => {
  const data = req.body;

  db.execute(
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
      db.execute(
        `INSERT INTO User (Name, Email, UCID, Password, Phone, Address)
          VALUES ('${data.name}', '${data.email}', '${data.UCID}', '${data.password}', '${data.phone}', '${data.address}')`,
        (err, result) => {
          if (err) {
            console.error("Error creating user:", err);
            return res.status(500).json({ error: "Could not create user" });
          }

          // Insert role using the user's ID
          db.execute(
            `INSERT INTO UserRole (UserID, Client, Admin)
              VALUES (LAST_INSERT_ID(), ${data.client || true}, ${
              data.admin || false
            })`,
            (roleErr) => {
              if (roleErr) {
                console.error("Error creating role:", roleErr);
                return res.status(500).json({ error: "Could not create role" });
              }

              // Delete verification record
              db.execute(
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
                }
              );
            }
          );
        }
      );
    }
  );
};

exports.getAllUser = (req, res) => {
  db.execute("SELECT * FROM User;", (err, data) => {
    if (err) {
      console.error("Errors: ", err);
      return res.status(500).json({ error: "\nCould not fetch users!" });
    }
    res.json({ Users: data });
  });
};

exports.findUserByEmail = (req, res) => {
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
  db.execute(query, [email], (err, data) => {
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
};

exports.updateUser = (req, res) => {
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

  db.execute(query, values, (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "Could not update user" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "User updated successfully" });
  });
};

exports.deleteUser = (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Delete from UserRole first (assuming foreign key constraint)
  db.execute("DELETE FROM UserRole WHERE UserID = ?", [userId], (err) => {
    if (err) {
      console.error("Error deleting user role:", err);
      return res.status(500).json({ error: "Could not delete user role" });
    }

    // Then delete from User table
    db.execute("DELETE FROM User WHERE UserID = ?", [userId], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ error: "Could not delete user" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ success: true, message: "User deleted successfully" });
    });
  });
};
