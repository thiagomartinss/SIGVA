const express = require("express");
const EcommerceServController = require("../controllers/ecommerceServController");
const router = express.Router();
const ctrl = new EcommerceServController();

router.get('/', ctrl.ecommerceServView);

module.exports = router;