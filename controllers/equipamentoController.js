const EquipamentoModel = require("../models/equipamentoModel");
const MarcaModel = require("../models/marcaModel");

class EquipamentoController{
    
    async equipamentoView(req, res){
        let equipamento = new EquipamentoModel();
        const listaEquipamentos = await equipamento.listarEquipamentos();
        
        let marca = new MarcaModel();
        const listaMarcas = await marca.listarMarcas();

        res.render('equipamento/equipamentos', { listaEquipamentos: listaEquipamentos, listaMarcas: listaMarcas });
    }

    async cadastrar(req, resp){

        const { descricao, modelo, estoque, marcaId } = req.body;

        if (!descricao || descricao.trim() === "" || !modelo || modelo.trim() === "" || !estoque || estoque.trim() === "" || !marcaId || marcaId === "") {
            resp.send({
                ok: false,
                msg: "Preencha todos os campos em vermelho!"
            });
            return;
        }

        if (parseInt(estoque) < 0) {
            resp.send({
                ok: false,
                msg: "A quantidade em estoque deve ser maior que zero!"
            });
            return;
        }

        try {
            let equipamento = new EquipamentoModel();
            const equipamentoExistente = await equipamento.buscarExistente(descricao.trim(), modelo.trim(), marcaId);

            if (equipamentoExistente) {
                resp.send({
                    ok: false,
                    msg: `Já existe outro equipamento com este nome, modelo e marca cadastrado.`
                });
                return;
            }

            equipamento = new EquipamentoModel(0, descricao.trim(), modelo.trim(), estoque.trim(), marcaId);
            let result = await equipamento.cadastrarEquipamento();

            if(result){
                resp.send({
                    ok: true,
                    msg: "Equipamento cadastrado com sucesso!"
                });
            }else{
                resp.send({
                    ok: false,
                    msg: "Erro ao cadastrar o equipamento!"
                });
            }

        } catch(error){
            console.error("Erro inesperado no banco de dados:", error);
            resp.send({
                ok: false,
                msg: "Ocorreu um erro inesperado ao salvar. Tente novamente."
            });
        }
    }

    async buscar(req, res){
        if(req.params.id != undefined){
            let equipamento = new EquipamentoModel();
            equipamento = await equipamento.buscar(req.params.id);
            
            if(equipamento != null){
                res.send({
                    ok: true,
                    equipamento: {
                        equipamentoId: equipamento.equipamentoId,
                        equipamentoNome: equipamento.equipamentoNome,
                        equipamentoModelo: equipamento.equipamentoModelo,
                        equipamentoEstoque: equipamento.equipamentoEstoque,
                        marcaId: equipamento.marcaId
                    }
                })
            }
            else{
                res.send({
                    ok: false,
                    msg: "Equipamento não encontrado!"
                })
            }
        }
        else{
            res.send({
                ok: false,
                msg: "O ID do equipamento é inválido!"
            })
        }
    }

    async alterar(req, resp) {
    
        const { id, descricao, modelo, estoque, marcaId } = req.body;

        if (!id || !descricao || descricao.trim() === "" || !modelo || modelo.trim() === "" || !estoque || estoque.trim() === "" || !marcaId || marcaId === "") {
            resp.send({
                ok: false,
                msg: "Preencha todos os campos!"
            });
            return;
        }

        if (parseInt(estoque) < 0) {
            resp.send({
                ok: false,
                msg: "A quantidade em estoque deve ser maior que zero!"
            });
            return;
        }

        try {
            let equipamento = new EquipamentoModel();
            const equipamentoExistente = await equipamento.buscarExistente(descricao.trim(), modelo.trim(), marcaId);

            if (equipamentoExistente && equipamentoExistente.equipamentoId != id) {
                resp.send({
                    ok: false,
                    msg: `Já existe outro equipamento com este nome, modelo e marca cadastrado.`
                });
                return;
            }
            
            equipamento = new EquipamentoModel(id, descricao.trim(), modelo.trim(), estoque.trim(), marcaId);
            let result = await equipamento.cadastrarEquipamento();

            if(result){
                resp.send({
                    ok: true,
                    msg: "Equipamento alterado com sucesso!"
                });
            }else{
                resp.send({
                    ok: false,
                    msg: "Erro ao alterar o equipamento!"
                });
            }

        } catch(error){
            console.error("Erro inesperado no banco de dados:", error);
            resp.send({
                ok: false,
                msg: "Ocorreu um erro inesperado ao salvar. Tente novamente."
            });
        }
    }

    async excluir(req, resp) {
        if(req.body.id != null){
            let equipamento = new EquipamentoModel();
            let result = await equipamento.excluir(req.body.id);

            if(result){
                resp.send({
                    ok: true,
                    msg: "Equipamento excluído com sucesso!"
                });
            } else {
                resp.send({
                    ok: false,
                    msg: "Erro ao excluir o equipamento!"
                });
            }
        } else {
            resp.send({
                ok: false,
                msg: "O ID do equipamento não foi informado!"
            });
        }
    }
}
module.exports = EquipamentoController;