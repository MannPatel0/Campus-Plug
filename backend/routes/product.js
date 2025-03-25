const express = require("express");
const {
  addToFavorite,
  getAllProducts,
  getProductById,
} = require("../controllers/product");

const router = express.Router();

router.post("/add_fav_product", addToFavorite);

router.get("/get_product", getAllProducts);

router.post("/get_productID", getProductById);

module.exports = router;
