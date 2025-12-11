const Database = require("../db/database"); 
const OrdemServicoModel = require("../models/ordemServicoModel");
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

        res.render('ordemServico/criarOs', { 
            listaEquipamentos: listaEquipamentos, 
            listaProdutos: listaProdutos, 
            listaServicos: listaServicos });
    }

    async listarView(req, res) {
        let osModel = new OrdemServicoModel();
        let listaOs = await osModel.listarTodasOs();
        
        res.render('ordemServico/listarOs', { listaOs: listaOs });
    }

    async cadastrar(req, res) {
        try {
            let body = req.body;
            let clienteId = body.clienteId;
            let clienteEnderecoId = body.clienteEnderecoId;
            let descServico = body.descServico ? body.descServico.trim().toUpperCase() : "";
            let equipamentoId = body.equipamentoId || null; 
            let listaServicos = body.servicos || [];
            let listaProdutos = body.produtos || [];

            if (!clienteId) 
                return res.send({ ok: false, msg: "Erro: Cliente não selecionado." });
            if (!descServico) 
                return res.send({ ok: false, msg: "Erro: Informe a descrição." });
            if (!listaServicos || listaServicos.length == 0)
                return res.send({ ok: false, msg: "Erro: É necessário adicionar ao menos um serviço." });

            let totalOS = 0;

            listaServicos.forEach(item => {
                let val = parseFloat(item.valor);
                if (!isNaN(val)) totalOS += val;
            });

            listaProdutos.forEach(item => {
                let val = parseFloat(item.valor);
                let qtd = parseFloat(item.qtd);
                if (!isNaN(val) && !isNaN(qtd)) totalOS += (val * qtd);
            });

            const db = new Database();
            let connection;

            try {
                connection = await db.beginTransaction();
                let osModel = new OrdemServicoModel(totalOS, clienteId, clienteEnderecoId, descServico, equipamentoId);
                let idNovaOS = await osModel.cadastrarOS(connection);
            
                for (let item of listaServicos) {
                    await osModel.cadastrarItemServico(idNovaOS, item.id, item.valor, connection);
                }

                for (let item of listaProdutos) {
                    await osModel.cadastrarItemProduto(idNovaOS, item.id, item.qtd, item.valor, connection);
                }

                await db.commit(connection);
                res.send({ ok: true, msg: "Ordem de Serviço gerada com sucesso!", idOs: idNovaOS });

            } catch (error) {
                if (connection) 
                    await db.rollback(connection);
                console.error(error);
                res.send({ ok: false, msg: "Erro ao gravar: " + error.message });
            }

        } catch (ex) {
            console.error(ex);
            res.send({ ok: false, msg: "Erro interno no servidor." });
        }
    }

    async buscarDados(req, res) {
        try {
            let id = req.params.id;
            let model = new OrdemServicoModel();
            let dados = await model.buscarPorIdCompleto(id);
            res.json({ ok: true, dados: dados });
        } catch (error) {
            console.error(error);
            res.json({ ok: false, msg: error.message });
        }
    }

    async alterar(req, res) {
        try {
            let body = req.body;
            let idOs = body.idOs;
 
            let descServico = body.descServico ? body.descServico.trim().toUpperCase() : "";
            let equipamentoId = body.equipamentoId || null; 
            let listaServicos = body.servicos || [];
            let listaProdutos = body.produtos || [];

            if (!idOs) 
                return res.send({ ok: false, msg: "ID da OS não informado." });
            
        
            let totalOS = 0;
            listaServicos.forEach(i => totalOS += parseFloat(i.valor));
            listaProdutos.forEach(i => totalOS += (parseFloat(i.valor) * parseFloat(i.qtd)));

            const db = new Database();
            let connection;

            try {
                connection = await db.beginTransaction();

                let osModel = new OrdemServicoModel(totalOS, null, null, descServico, equipamentoId);

                await osModel.alterarOS(idOs, connection);

                for (let item of listaServicos) {
                    await osModel.cadastrarItemServico(idOs, item.id, item.valor, connection);
                }

                for (let item of listaProdutos) {
                    await osModel.cadastrarItemProduto(idOs, item.id, item.qtd, item.valor, connection);
                }

                await db.commit(connection);
                res.send({ ok: true, msg: "OS Alterada com sucesso!" });

            } catch (error) {
                if (connection) await db.rollback(connection);
                res.send({ ok: false, msg: error.message });
            }
        } catch (ex) {
            res.send({ ok: false, msg: "Erro interno." });
        }
    }
}


module.exports = OrdemServicoController;