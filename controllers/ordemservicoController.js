const EquipamentoModel = require("../models/equipamentoModel");
const ProdutoModel = require("../models/produtoModel");
const ServicoModel = require("../models/servicoModel");

class OrdemServicoController {
    async ordemView(req, res) {
        let equipamento = new EquipamentoModel();
        let produto = new ProdutoModel();
        let servico = new ServicoModel();

        const listaEquipamentos = await equipamento.listarEquipamentosParaOrdem();
        const listaProdutos = await produto.listarProdutos();
        const listaServicos = await servico.listarServico();

        res.render('ordemServico/ordemServico', { listaEquipamentos: listaEquipamentos, listaProdutos: listaProdutos, listaServicos: listaServicos });
    }
}
module.exports = OrdemServicoController;