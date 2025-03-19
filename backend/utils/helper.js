const { generateEmailTransporter } = require("./mail");

// Helper function to send email
async function sendVerificationEmail(email, verificationCode) {
  const transporter = generateEmailTransporter();

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
    }
  );
}

const checkDatabaseConnection = async (db) => {
  try {
    const connection = await db.getConnection();
    //If no error, release the connection
    console.log("Connect to database successfully!");
    connection.release();
  } catch (error) {
    console.log("Cannot connect to database: ", error.sqlMessage);
  }
};

module.exports = {
  sendVerificationEmail,
  cleanupExpiredCodes,
  checkDatabaseConnection,
};
