const ProdutoModel = require("../models/produtoModel");
const PessoaModel = require("../models/pessoaModel");
//ver aqui
const OrdemServicoModel = require("../models/odemServicoModel");

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
    async listarProdutosRel(req, res) {
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
    async relatorioEstoqueZerado(req, res) {
        let filtro = 0;
        let produto = new ProdutoModel();
        let lista = await produto.listarRelatorioProduto(filtro);
        res.json({ lista });
    }
    async relatorioOrdemStatus(req, res) {
        let filtro = req.query.filtro;
        let ordem = new OrdemServicoModel();
        let lista = await ordem.listarRelatorioOrdemServico(filtro);
        res.json({ lista });
    }
    async relatorioOrdemPeriodo(req, res) {
        let filtro = req.query.filtro;
        let ordem = new OrdemServicoModel();
        let lista = await ordem.listarRelatorioOrdemServicoPeriodo(filtro);
        res.json({ lista });
    }
    async relatorioOrdemMarca(req, res) {
    let ordem = new OrdemServicoModel();
    let lista = await ordem.listarRelatorioOrdemMarca();
    res.json({ lista });
}
}
module.exports = RelatorioController;