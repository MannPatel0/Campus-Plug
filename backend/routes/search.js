// routes/product.js
const express = require("express");
const { searchProductsByName } = require("../controllers/search");
const router = express.Router();

// Add detailed logging middleware
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.path}`);
  next();
});

router.get("/search", searchProductsByName);

module.exports = router;
