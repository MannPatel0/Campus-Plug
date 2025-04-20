// routes/product.js
const express = require("express");
const { RecommondationByUserId } = require("../controllers/recommendation");
const router = express.Router();

router.post("/recommended", RecommondationByUserId);

module.exports = router;
