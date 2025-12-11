const ServicoModel = require("../models/servicoModel");

class ServicoController{
    
    async servicoView(req, res){
        let servico = new ServicoModel();
        let lista = await servico.listarServico();
        res.render('servico/servicos', {lista: lista});
    }

    async cadastrar(req, resp){
        let { descricao, valor } = req.body;
        descricao = descricao.trim().toUpperCase();
        valor = valor.trim();

        if(descricao == "" || valor == ""){
            resp.send({
                ok: false,
                msg: "Preencha os campos em vermelho"
            });
            return;
        }
        if(parseFloat(valor) <= 0 && valor != ""){
            resp.send({
                ok: false,
                msg: "Valor deve ser maior que zero"
            });
            return;
        }
        try{
            let servicoModel = new ServicoModel();
            const servicoExistente = await servicoModel.buscarExistente(descricao);

            if(servicoExistente) {
                resp.send({
                    ok: false,
                    msg: `O serviço "${servicoExistente.servicoDesc}" já está cadastrado.`
                });
                return;
            }

            let servico = new ServicoModel(0, descricao, valor);
            let result = await servico.cadastrarServicos();

            if(result){
                resp.send({
                    ok: true,
                    msg: "Serviço cadastrado com sucesso!"
                });
            }else{
                res.send({
                    ok: false,
                    msg: "Erro ao cadastrar serviço"
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
            let servico = new ServicoModel();
            servico = await servico.buscar(req.params.id);
            
            if(servico != null){
                res.send({
                    ok: true,
                    servico: {
                        servicoId: servico.servicoId,
                        servicoDesc: servico.servicoDesc,
                        servicoValor: servico.servicoValor
                    }
                })
            }
            else{
                res.send({
                    ok: false,
                    msg: "Serviço não encontrado!"
                })
            }
        }
        else{
            res.send({
                ok: false,
                msg: "O ID do serviço é inválido!"
            })
        }
    }

    async alterar(req, resp) {
        let { id, descricao, valor } = req.body;
        descricao = descricao.trim().toUpperCase();
        valor = valor.trim();

        if (!id || !descricao || descricao === "" || !valor || valor === "") {
            resp.send({
                ok: false,
                msg: "Preencha todos os campos para alterar!"
            });
            return;
        }

        if(parseFloat(valor) <= 0){
            resp.send({
                ok: false,
                msg: "Valor deve ser maior que zero"
            });
            return;
        }
        try{
            let servicoModel = new ServicoModel();
            const servicoExistente = await servicoModel.buscarExistente(descricao);

            if(servicoExistente && servicoExistente.servicoId != id) {
                resp.send({
                    ok: false,
                    msg: `O serviço "${servicoExistente.servicoDesc}" já está cadastrado.`
                });
                return;
            }

            let servico = new ServicoModel(id, descricao, valor);
            let result = await servico.cadastrarServicos();

            if(result){
                resp.send({
                    ok: true,
                    msg: "Serviço alterado com sucesso!"
                });
            }else{
                resp.send({
                    ok: false,
                    msg: "Erro ao alterar o serviço!"
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
            let servico = new ServicoModel();
            
            let result = await servico.excluir(req.body.id);

            if(result){
                resp.send({
                    ok: true,
                    msg: "Serviço excluído com sucesso!"
                });
            } else {
                resp.send({
                    ok: false,
                    msg: "Erro ao excluir o serviço!"
                });
            }
        } else {
            resp.send({
                ok: false,
                msg: "O ID do serviço não foi informado!"
            });
        }
    }

    async buscarPorNome(req, res) {
        let termo = req.params.nome;
        
        try {
            let servicoModel = new ServicoModel();
            let lista = await servicoModel.listarPorNome(termo);
            res.json({ servicos: lista });
        } catch (error) {
            console.error("Erro ao buscar serviço:", error);
            res.status(500).json({ ok: false, msg: "Erro no servidor" });
        }
    }
}
module.exports = ServicoController;