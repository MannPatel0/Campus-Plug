const express = require("express");
const {
  getAllCategoriesWithPagination,
  addCategory,
  removeCategory,
  getAllCategory,
} = require("../controllers/category");

const router = express.Router();

router.get("/getCategories", getAllCategoriesWithPagination);
router.post("/addCategory", addCategory);
router.delete("/:id", removeCategory);
router.get("/", getAllCategory);

module.exports = router;
