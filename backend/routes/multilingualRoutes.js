const express = require("express");

const {
  translate,
} = require("../controllers/multilingualController");

const router = express.Router();

router.post("/", translate);

module.exports = router;
