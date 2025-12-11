const express = require("express");
const PessoaController = require("../controllers/pessoaController");
const router = express.Router();
const pessoaController = new PessoaController();

router.get("/", pessoaController.pessoaView);
router.post("/cadastrar", pessoaController.cadastrar);
router.get("/buscar/:id", pessoaController.buscar);
router.get("/pesquisar/:nome", pessoaController.buscarPorNome);
router.post("/alterar", pessoaController.alterar);
router.post("/excluir", pessoaController.excluir);

module.exports = router;