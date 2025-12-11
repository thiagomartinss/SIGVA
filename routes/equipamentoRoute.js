const express = require("express");
const EquipamentoController = require("../controllers/equipamentoController");
const router = express.Router();
const equipamentoController = new EquipamentoController();

router.get("/", equipamentoController.equipamentoView);
router.post("/cadastrar", equipamentoController.cadastrar);
router.get("/buscar/:id", equipamentoController.buscar);
router.get("/pesquisar/:nome", equipamentoController.buscarPorNome);
router.post("/alterar", equipamentoController.alterar);
router.post("/excluir", equipamentoController.excluir);

module.exports = router;