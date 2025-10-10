const express = require("express");
const AdminController = require("../controllers/adminController");
const router = express.Router();
const adminController = new AdminController();

router.get("/", adminController.adminView);

module.exports = router;