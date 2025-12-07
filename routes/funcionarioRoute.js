const express = require("express");
const FuncionarioController = require("../controllers/funcionarioController");
const router = express.Router();
const funcionarioController = new FuncionarioController();

router.get("/", funcionarioController.funcionarioView);
router.post("/cadastrar", funcionarioController.cadastrar);
router.post('/buscar-pessoa', funcionarioController.buscarPessoas);
router.post('/alterar', funcionarioController.alterar);
router.post('/alterarSenha', funcionarioController.alterarSenha);

module.exports = router;