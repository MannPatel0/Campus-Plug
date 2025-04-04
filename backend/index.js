const express = require("express");
const cors = require("cors");
//Get the db connection
const db = require("./utils/database");

const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const searchRouter = require("./routes/search");
const recommendedRouter = require("./routes/recommendation");
const { generateEmailTransporter } = require("./utils/mail");
const {
  cleanupExpiredCodes,
  checkDatabaseConnection,
} = require("./utils/helper");

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

//Check database connection
checkDatabaseConnection(db);

//Routes
app.use("/api/user", userRouter); //prefix with /api/user
app.use("/api/product", productRouter); //prefix with /api/product
app.use("/api/search_products", searchRouter); //prefix with /api/product
app.use("/api/Engine", recommendedRouter); //prefix with /api/

// Set up a scheduler to run cleanup every hour
setInterval(cleanupExpiredCodes, 60 * 60 * 1000);

app.listen(3030, () => {
  console.log(`Running Backend on http://localhost:3030/`);
  console.log(`Send verification code: POST /send-verification`);
  console.log(`Verify code: POST /verify-code`);
});
