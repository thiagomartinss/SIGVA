const ProdutoModel = require("../models/produtoModel");
class EcommerceController {

    async ecommerceView(req, res) {
        let produto = new ProdutoModel();
        const listaProdutos = await produto.listarProdutos();
        res.render('ecommerce', { listaProdutos: listaProdutos });
    }
}
module.exports = EcommerceController;