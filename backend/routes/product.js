// routes/product.js
const express = require("express");
const {
  addFavorite,
  getFavorites,
  removeFavorite,
  getAllProducts,
  getProductById,
  addProduct,
} = require("../controllers/product");
const router = express.Router();

// Add detailed logging middleware
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.path}`);
  next();
});

router.post("/addFavorite", addFavorite);
router.post("/getFavorites", getFavorites);
router.post("/delFavorite", removeFavorite);

router.post("/addProduct", addProduct);
router.get("/getProduct", getAllProducts);
router.get("/:id", getProductById); // Simplified route

module.exports = router;
