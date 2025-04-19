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
      `Generated verification code for ${email}: ${verificationCode}`,
    );

    // Check if email already exists in verification table
    const [results, fields] = await db.execute(
      "SELECT * FROM AuthVerification WHERE Email = ?",
      [email],
    );

    if (results.length > 0) {
      // Update existing record
      const [result] = await db.execute(
        `UPDATE AuthVerification SET VerificationCode = ?, Authenticated = FALSE, Date = CURRENT_TIMESTAMP
         WHERE Email = ?`,
        [verificationCode, email],
      );

      // Send email and respond
      await sendVerificationEmail(email, verificationCode);
      res.json({ success: true, message: "Verification code sent" });
    } else {
      // Insert new record
      const [result] = await db.execute(
        "INSERT INTO AuthVerification (Email, VerificationCode, Authenticated) VALUES (?, ?, FALSE)",
        [email, verificationCode],
      );
      // Send email and respond
      await sendVerificationEmail(email, verificationCode);
      res.json({ success: true, message: "Verification code sent" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  console.log(`Attempting to verify code for ${email}: ${code}`);

  try {
    // Check verification code
    const [results, fields] = await db.execute(
      "SELECT * FROM AuthVerification WHERE Email = ? AND VerificationCode = ? AND Authenticated = 0 AND Date > DATE_SUB(NOW(), INTERVAL 15 MINUTE)",
      [email, code],
    );
    if (results.length === 0) {
      console.log(`Invalid or expired verification code for email ${email}`);
      return res
        .status(400)
        .json({ error: "Invalid or expired verification code" });
    }

    const userId = results[0].UserID;

    // Mark as authenticated
    const [result] = await db.execute(
      "UPDATE AuthVerification SET Authenticated = TRUE WHERE Email = ?",
      [email],
    );
    res.json({
      success: true,
      message: "Verification successful",
      userId,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Database error!" });
  }
};

exports.completeSignUp = async (req, res) => {
  const data = req.body;

  try {
    const [results, fields] = await db.execute(
      `SELECT * FROM AuthVerification WHERE Email = ? AND Authenticated = 1;`,
      [data.email],
    );

    if (results.length === 0) {
      return res.status(400).json({ error: "Email not verified" });
    }

    // Create the user
    const [createResult] = await db.execute(
      `INSERT INTO User (Name, Email, UCID, Password, Phone, Address)
          VALUES ('${data.name}', '${data.email}', '${data.UCID}', '${data.password}', '${data.phone}', '${data.address}')`,
    );

    // Insert role using the user's ID
    const [insertResult] = await db.execute(
      `INSERT INTO UserRole (UserID, Client, Admin)
                VALUES (LAST_INSERT_ID(), ${data.client || true}, ${
                  data.admin || false
                })`,
    );

    // Delete verification record
    const [deleteResult] = await db.execute(
      `DELETE FROM AuthVerification WHERE Email = '${data.email}'`,
    );

    res.json({
      success: true,
      message: "User registration completed successfully",
      name: data.name,
      email: data.email,
      UCID: data.UCID,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Database error!" });
  }
};

exports.doLogin = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({
      found: false,
      error: "Email and password are required",
    });
  }

  try {
    // Query to find user with matching email
    const query = "SELECT * FROM User WHERE email = ?";
    const [data, fields] = await db.execute(query, [email]);

    // Check if user was found
    if (data && data.length > 0) {
      const user = data[0];

      // Verify password match
      if (user.Password === password) {
        // Consider using bcrypt for secure password comparison
        // Return user data without password
        return res.json({
          found: true,
          userID: user.UserID,
          name: user.Name,
          email: user.Email,
          UCID: user.UCID,
          phone: user.Phone,
          address: user.Address,
        });
      } else {
        // Password doesn't match
        return res.json({
          found: false,
          error: "Invalid email or password",
        });
      }
    } else {
      // User not found
      return res.json({
        found: false,
        error: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      found: false,
      error: "Database error occurred",
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const [users, fields] = await db.execute("SELECT * FROM User;");
    res.json({ Users: users });
  } catch (error) {
    console.error("Errors: ", error);
    return res.status(500).json({ error: "\nCould not fetch users!" });
  }
};

exports.findUserByEmail = async (req, res) => {
  const { email } = req.body;

  // Input validation
  if (!email) {
    return res.status(400).json({
      found: false,
      error: "Email is required",
    });
  }

  try {
    // Query to find user with matching email and password
    const query = "SELECT * FROM User WHERE email = ?";
    const [data, fields] = await db.execute(query, [email]);

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
        password: user.Password,
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
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({
      found: false,
      error: "Database error occurred",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.body?.userId;
    const name = req.body?.name;
    const email = req.body?.email;
    const phone = req.body?.phone;
    const UCID = req.body?.UCID;
    const address = req.body?.address;
    const password = req.body?.password;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Build updateData manually
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (UCID) updateData.UCID = UCID;
    if (address) updateData.address = address;
    if (password) updateData.password = password;
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const updateFields = [];
    const values = [];

    Object.entries(updateData).forEach(([key, value]) => {
      updateFields.push(`${key} = ?`);
      values.push(value);
    });

    values.push(userId);

    const query = `UPDATE User SET ${updateFields.join(", ")} WHERE userId = ?`;
    const [updateResult] = await db.execute(query, values);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Could not update user" });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Delete from UserRole first (assuming foreign key constraint)
    const [result1] = await db.execute(
      "DELETE FROM UserRole WHERE UserID = ?",
      [userId],
    );

    // Then delete from User table
    const [result2] = await db.execute("DELETE FROM User WHERE UserID = ?", [
      userId,
    ]);

    if (result2.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ error: "Could not delete user!" });
  }
};
