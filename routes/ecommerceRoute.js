const express = require("express");
const EcommerceController = require("../controllers/ecommerceController");
const router = express.Router();
const ctrl = new EcommerceController();

router.get('/', ctrl.ecommerceView);

module.exports = router;