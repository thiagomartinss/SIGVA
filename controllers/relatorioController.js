const ProdutoModel = require("../models/produtoModel");
const PessoaModel = require("../models/pessoaModel");

class RelatorioController {
    async relatorioView(req, res) {
        res.render("relatorio/relatorios");
    }
    async relatorioOsPeriodo(req, res) {
        res.render("relatorio/relatorioOsPeriodo");
    }
    async relatorioOsMarca(req, res) {
        res.render("relatorio/relatorioOsMarca");
    }
    async relatorioOsStatus(req, res) {
        res.render("relatorio/relatorioOsStatus");
    }
    async relatorioProduto(req, res) {
        res.render("relatorio/relatorioProduto");
    }
    async relatorioEstoque(req, res) {
        res.render("relatorio/relatorioEstoque");
    }
    async relatorioCliente(req, res) {
        res.render("relatorio/relatorioCliente");
    }
    async listarProdutosRel(req, res) {//confirmar 
        let filtro = req.query.filtro;
        let produto = new ProdutoModel();
        let lista = await produto.listarRelatorioProduto(filtro);
        res.json({ lista });
    }
    async listarPessoasRel(req, res) {
        let filtro = req.query.filtro;
        let pessoa = new PessoaModel();
        let lista = await pessoa.listarRelatorioPessoa(filtro);
        res.json({ lista })
    }
}
module.exports = RelatorioController;