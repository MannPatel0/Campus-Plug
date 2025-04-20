const express = require("express");
const cors = require("cors");

const db = require("./utils/database");

const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const searchRouter = require("./routes/search");
const recommendedRouter = require("./routes/recommendation");
const history = require("./routes/history");
const review = require("./routes/review");
const transactionRouter = require("./routes/transaction");

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

checkDatabaseConnection(db);

//Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/search", searchRouter);
app.use("/api/engine", recommendedRouter);
app.use("/api/history", history);
app.use("/api/review", review);
app.use("/api/transaction", transactionRouter);


// Set up a scheduler to run cleanup every hour
clean_up_time = 30*60*1000;
setInterval(cleanupExpiredCodes, clean_up_time);

app.listen(3030, () => {
  console.log(`Running Backend on http://localhost:3030/`);
  console.log(`Send verification code: POST /send-verification`);
  console.log(`Verify code: POST /verify-code`);
});
