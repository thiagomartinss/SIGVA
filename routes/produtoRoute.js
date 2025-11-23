const express = require("express");
const ProdutoController = require("../controllers/produtoController");
const router = express.Router();
const produtoController = new ProdutoController();

router.get("/", produtoController.produtoView);
router.post("/cadastrar", produtoController.cadastrar);
//router.get("/buscar/:id", produtoController.buscar);
router.get("/obter/:id", produtoController.obterProduto);
//router.post("/alterar", produtoController.alterar);
//router.post("/excluir", produtoController.excluir);

module.exports = router;