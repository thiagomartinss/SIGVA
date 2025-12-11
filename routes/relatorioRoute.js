const express = require("express");
const RelatorioController = require("../controllers/relatorioController");
const router = express.Router();
const ctrl = new RelatorioController();

router.get("/", ctrl.relatorioView);
router.get("/relatorioProduto", ctrl.relatorioProduto);
router.get("/relatorioOsPeriodo", ctrl.relatorioOsPeriodo);
router.get("/relatorioOsMarca", ctrl.relatorioOsMarca);
router.get("/relatorioOsStatus", ctrl.relatorioOsStatus);
router.get("/relatorioEstoque", ctrl.relatorioEstoque);
router.get("/relatorioCliente", ctrl.relatorioCliente);
//relatorios
router.get("/produtos", ctrl.listarProdutosRel);
router.get("/pessoas",ctrl.listarPessoasRel);
router.get("/relatorioStatus", ctrl.relatorioOrdemStatus);
router.get("/relatorioPeriodo", ctrl.relatorioOrdemPeriodo);
router.get("/relatorioMarca", ctrl.relatorioOrdemMarca);
module.exports = router;