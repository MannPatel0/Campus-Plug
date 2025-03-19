const express = require("express");
const cors = require("cors");
//Get the db connection
const db = require("./utils/database");

const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const { generateEmailTransporter } = require("./utils/mail");
const { cleanupExpiredCodes } = require("./utils/helper");

const app = express();

app.use(cors());
app.use(express.json());

// Configure email transporter for Zoho
const transporter = generateEmailTransporter();
// Test the email connection
transporter
  .verify()
  .then(() => {
    console.log("Email connection successful!");
  })
  .catch((error) => {
    console.error("Email connection failed:", error);
  });

//Routes
app.use("/api/user", userRouter); //prefix with /api/user
app.use("/api/product", productRouter); //prefix with /api/product

// Set up a scheduler to run cleanup every hour
setInterval(cleanupExpiredCodes, 60 * 60 * 1000);

app.listen(3030, () => {
  console.log(`Running Backend on http://localhost:3030/`);
  console.log(`Send verification code: POST /send-verification`);
  console.log(`Verify code: POST /verify-code`);
});
