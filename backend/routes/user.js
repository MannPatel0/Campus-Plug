const express = require("express");
const {
  sendVerificationCode,
  verifyCode,
  completeSignUp,
  getAllUser,
  findUserByEmail,
  updateUser,
  deleteUser,
  doLogin,
  isAdmin,
  getUsersWithPagination,
} = require("../controllers/user");

const router = express.Router();

// Generate and send verification code for signup
router.post("/send-verification", sendVerificationCode);

// Verify the code
router.post("/verify-code", verifyCode);

// Create a users and Complete user registration after verification
router.post("/complete-signup", completeSignUp);

//Fetch all users data:
router.get("/fetch_all_users", getAllUser);

//Fetch One user Data with all fields:
router.post("/find_user", findUserByEmail);

//Fetch One user Data with all fields:
router.post("/do_login", doLogin);

//Update A uses Data:
router.post("/update", updateUser);

//Delete A uses Data:
router.post("/delete", deleteUser);

//Check admin status
router.get("/isAdmin/:id", isAdmin);

//Fetch user with pagination
router.get("/getUserWithPagination", getUsersWithPagination);

module.exports = router;
