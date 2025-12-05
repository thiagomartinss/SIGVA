const MarcaModel = require("../models/marcaModel");

class MarcaController{
    
    async marcaView(req, res){
        let marca = new MarcaModel();
        let lista = await marca.listarMarcas();
        res.render('marca/marcas', {lista: lista});
    }

    async cadastrar(req, resp) {
        if (req.body.descricao == "") {
            resp.send({
                ok: false,
                msg: "Preencha o campo de descrição!"
            });
            return;
        }
        try {
            let marca = new MarcaModel(0, req.body.descricao);
            let result = await marca.cadastrarMarcas(); 

            if (result) {
                resp.send({
                    ok: true,
                    msg: "Marca cadastrada com sucesso!"
                });
            } else {
                resp.send({
                    ok: false,
                    msg: "Erro ao cadastrar a marca."
                });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                resp.send({
                    ok: false,
                    msg: `A marca "${req.body.descricao}" já está cadastrada.`
                });
            } else {
                console.error("Erro inesperado no banco de dados:", error);
                resp.send({
                    ok: false,
                    msg: "Ocorreu um erro inesperado ao salvar. Tente novamente."
                });
            }
        }
    }

    async buscar(req, res){
        if(req.params.id != undefined){
            let marca = new MarcaModel();
            marca = await marca.buscar(req.params.id);
            
            if(marca != null){
                res.send({
                    ok: true,
                    marca: {
                        marcaId: marca.marcaId,
                        marcaNome: marca.marcaNome
                    }
                })
            }
            else{
                res.send({
                    ok: false,
                    msg: "Marca não encontrada!"
                })
            }
        }
        else{
            res.send({
                ok: false,
                msg: "O ID da marca é inválido!"
            })
        }
    }

    async alterar(req, resp) {
        if (req.body.id == "" || req.body.descricao.trim() == "") {
            resp.send({
                ok: false,
                msg: "Preencha a descrição!"
            });
            return;
        }
        try {
            let marca = new MarcaModel(req.body.id, req.body.descricao.trim());
            let result = await marca.cadastrarMarcas(); 

            if (result) {
                resp.send({
                    ok: true,
                    msg: "Marca alterada com sucesso!"
                });
            } else {
                resp.send({
                    ok: false,
                    msg: "Erro ao alterar a marca."
                });
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                resp.send({
                    ok: false,
                    msg: `A marca "${req.body.descricao}" já está cadastrada.`
                });
            } else {
                console.error("Erro inesperado no banco de dados:", error);
                resp.send({
                    ok: false,
                    msg: "Ocorreu um erro inesperado ao salvar. Tente novamente."
                });
            }
        }
    }

    async excluir(req, resp) {
        if(req.body.id != null){
            try {
                let marca = new MarcaModel();
                let result = await marca.excluir(req.body.id);

                if(result){
                    resp.send({
                        ok: true,
                        msg: "Marca excluída com sucesso!"
                    });
                } else {
                    resp.send({
                        ok: false,
                        msg: "Erro ao excluir a marca (Marca não encontrada)!"
                    });
                }
            } catch (error) {
                if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
                    resp.send({
                        ok: false,
                        msg: "Não é possível excluir esta marca pois ela está vinculada a produtos ou equipamentos!"
                    });
                } else {
                    console.error("Erro ao excluir marca:", error);
                    resp.send({
                        ok: false,
                        msg: "Erro inesperado ao excluir a marca."
                    });
                }
            }
        } else {
            resp.send({
                ok: false,
                msg: "O ID da marca não foi informado!"
            });
        }
    }
}
module.exports = MarcaController;