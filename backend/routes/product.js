// routes/product.js
const express = require("express");
const {
  addToFavorite,
  getAllProducts,
  getProductById,
} = require("../controllers/product");
const router = express.Router();

// Add detailed logging middleware
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.path}`);
  next();
});

router.post("/add_fav_product", addToFavorite);
router.get("/get_product", getAllProducts);
router.get("/:id", getProductById); // Simplified route

module.exports = router;
