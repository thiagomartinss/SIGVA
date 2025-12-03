const ProdutoModel = require("../models/produtoModel");
const MarcaModel = require("../models/marcaModel");
const TipoProdutoModel = require("../models/tipoProdutoModel");
const fs=require("fs");

class ProdutoController{

    async produtoView(req, res){
        let produto = new ProdutoModel();
        const listaProdutos = await produto.listarProdutos();

        let marca = new MarcaModel();
        const listaMarcas = await marca.listarMarcas();

        let tipo = new TipoProdutoModel();
        const listaTipo = await tipo.listarTipos();

        res.render('produto/produtos', {
            listaProdutos: listaProdutos, 
            listaMarcas: listaMarcas,
            listaTipo: listaTipo
        });
    }

    async cadastrar(req, res){
        const {
            nome,
            vlVenda,
            vlCompra,
            qtdEstoque,
            marcaId,
            tipoId
        } = req.body;

        if (!nome || nome.trim() === "" || !vlVenda || vlVenda.trim() === "" || !vlCompra || vlCompra.trim() === "" || !qtdEstoque || qtdEstoque.trim() === "" || !marcaId || marcaId.trim() === "" || !tipoId || tipoId.trim() === ""){
            res.send({
                ok:false,
                msg: "Preencha todos os campos em vermelho!"
            });
            return;
        }
        if(parseFloat(vlCompra.trim()) <= 0 && vlCompra.trim() != ""){
            res.send({
                ok: false,
                msg: "Valor deve ser maior que zero"
            });
            return;
        }
        if(parseFloat(vlVenda.trim()) <= 0 && vlVenda.trim() != ""){
            res.send({
                ok: false,
                msg: "Valor deve ser maior que zero"
            });
            return;
        }
        if(qtdEstoque < 0){
            res.send({
                ok: false,
                msg: "Não é permitido cadastrar com estoque negativo"
            });
            return;
        }
        if(!req.file || !req.file.filename){
            res.send({
                ok:false,
                msg:"É obrigatorio enviar uma Imagem"
            });
            return;
        }
        try{
            let produto = new ProdutoModel();
            const produtoExistente = await produto.buscarExistnte(nome.trim(), marcaId.trim(), tipoId.trim());

            if(produtoExistente){
                res.send({
                    ok: false,
                    msg: `Esse produto já está cadastrado! `
                })
                return;
            }

            produto = new ProdutoModel(0,nome.trim(), vlVenda.trim(),vlCompra.trim(), qtdEstoque.trim(), marcaId.trim(), tipoId.trim(),"","", req.file.filename);
            let result = await produto.cadastrarProduto();

            if(result){
                res.send({
                    ok: true,
                    msg: "Produto cadastrado com sucesso!"
                });
            }else{
                res.send({
                    ok: false,
                    msg: "Erro ao cadastrar o produto"
                });
            }
        } catch(error){
            console.error("Erro inesperado no banco de dados:", error);
            res.send({
                ok: false,
                msg: "Ocorreu um erro inesperado ao salvar. Tente novamente."
            });
        }
    }
        async obterProduto(req, res) {
        let produtoId = req.params.id;

        let produtoModel = new ProdutoModel();
        let produto = await produtoModel.buscarProduto(produtoId);

        res.send({produto: produto})
    }
    
}

module.exports = ProdutoController;