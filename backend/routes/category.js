const express = require("express");
const { getAllCategory } = require("../controllers/category");
const router = express.Router();

router.get("/", getAllCategory);

module.exports = router;
