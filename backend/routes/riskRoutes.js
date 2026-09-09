const express = require("express");

const {
  analyzeRisk,
} = require("../controllers/riskController");

const router = express.Router();

router.post("/", analyzeRisk);

module.exports = router;
