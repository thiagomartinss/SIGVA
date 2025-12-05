const express = require("express");
const FuncionarioController = require("../controllers/funcionarioController");
const router = express.Router();
const funcionarioController = new FuncionarioController();

router.get("/", funcionarioController.funcionarioView);

module.exports = router;