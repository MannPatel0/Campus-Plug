const express = require("express");
const { addToFavorite, getAllProducts } = require("../controllers/product");

const router = express.Router();

router.post("/add_fav_product", addToFavorite);

router.get("/get_product", getAllProducts);

module.exports = router;
