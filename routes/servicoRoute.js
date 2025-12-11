const express = require("express");
const ServicoController = require("../controllers/servicoController");
const router = express.Router();
const servicoController = new ServicoController();

router.get("/", servicoController.servicoView);
router.post("/cadastrar", servicoController.cadastrar);
router.get("/buscar/:id", servicoController.buscar);
router.get("/pesquisar/:nome", servicoController.buscarPorNome);
router.post("/alterar", servicoController.alterar);
router.post("/excluir", servicoController.excluir);

module.exports = router;