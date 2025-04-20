// routes/product.js
const express = require("express");
const {
  addFavorite,
  getFavorites,
  removeFavorite,
  getAllProducts,
  getProductById,
  getProductWithPagination,
  removeProduct,
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

router.get("/getProduct", getAllProducts);

//Get products with pagination
router.get("/getProductWithPagination", getProductWithPagination);

router.get("/:id", getProductById); // Simplified route

//Remove product
router.delete("/:id", removeProduct);

module.exports = router;
