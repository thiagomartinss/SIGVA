const express = require("express");
const multer = require("multer");
const ProdutoController = require("../controllers/produtoController");
const router = express.Router();
const produtoController = new ProdutoController();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/produtos');
    },
    filename: function (req, file, cb) {
        let nomeIMG = "PRD-" + Date.now();
        let extensao = file.originalname.split(".").pop()
        cb(null, `${nomeIMG}.${extensao}`);
    }
})

const upload = multer({ storage: storage })
router.get("/", produtoController.produtoView);
router.post("/cadastrar", upload.single("imagem"), produtoController.cadastrar);
router.get("/buscar/:id", produtoController.obterProduto);
router.get("/pesquisar/:nome", produtoController.buscarPorNome);
// router.get("/obter/:id", produtoController.obterProduto); //obter funciona pro carrinho
router.post("/alterar",upload.single("imagem"), produtoController.alterar);
router.post("/excluir", produtoController.excluir);

module.exports = router;