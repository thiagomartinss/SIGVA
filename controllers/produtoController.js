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
        let {
            sku,
            nome,
            vlVenda,
            vlCompra,
            qtdEstoque,
            marcaId,
            tipoId
        } = req.body;

        sku = sku.trim().toUpperCase();
        nome = nome.trim().toUpperCase();

        if (!sku || sku.trim() === "" || !nome || nome.trim() === "" || !vlVenda || vlVenda.trim() === "" || !vlCompra || vlCompra.trim() === "" || !qtdEstoque || qtdEstoque.trim() === "" || !marcaId || marcaId.trim() === "" || !tipoId || tipoId.trim() === ""){
            res.send({
                ok:false,
                msg: "Preencha todos os campos em vermelho!"
            });
            return;
        }
        if(parseFloat(vlCompra.trim()) <= 0 && vlCompra.trim() != ""){
            res.send({
                ok: false,
                msg: "Valor de compra deve ser maior que zero"
            });
            return;
        }
        if(parseFloat(vlVenda.trim()) <= 0 && vlVenda.trim() != ""){
            res.send({
                ok: false,
                msg: "Valor de venda deve ser maior que zero"
            });
            return;
        }

        if(parseFloat(vlVenda.trim()) < vlCompra.trim()){
            res.send({
                ok: false,
                msg: "Valor de venda não pode ser menor que o valor de compra"
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

        let nomeImagem = "";
        if (req.file)
            nomeImagem = req.file.filename;
        else
            nomeImagem = null; 

        try{
            let produto = new ProdutoModel();

            const skuMarcaExistente = await produto.buscarPorSkuEMarca(sku.trim(), marcaId.trim());
            if(skuMarcaExistente){
                res.send({
                    ok: false,
                    msg: `O SKU '${sku.trim()}' já existe para esta Marca!`
                });
                return;
            }

            const produtoExistente = await produto.buscarExistnte(nome.trim(), marcaId.trim(), tipoId.trim());
            if(produtoExistente){
                res.send({
                    ok: false,
                    msg: `Já existe um produto '${nome.trim()}' com essa Marca e Tipo!`
                })
                return;
            }

            produto = new ProdutoModel(
                0,
                sku.trim(), 
                nome.trim(), 
                vlVenda.trim(),
                vlCompra.trim(), 
                qtdEstoque.trim(), 
                marcaId.trim(), 
                tipoId.trim(),
                "",
                "", 
                nomeImagem);
            
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

    async alterar(req, res) {
        let {
            id,
            skuAlt,
            nomeAlt,
            vlVendaAlt,
            vlCompraAlt,
            qtdEstoqueAlt,
            marcaIdAlt,
            tipoIdAlt
        } = req.body;

        skuAlt = skuAlt.trim().toUpperCase();
        nomeAlt = nomeAlt.trim().toUpperCase();
        
        if (!skuAlt || skuAlt.trim() === "" || !nomeAlt || nomeAlt.trim() === "" || !vlVendaAlt || vlVendaAlt.trim() === "" || !vlCompraAlt || vlCompraAlt.trim() === "" || !qtdEstoqueAlt || qtdEstoqueAlt.trim() === "" || !marcaIdAlt || marcaIdAlt.trim() === "" || !tipoIdAlt || tipoIdAlt.trim() === "") {
            res.send({
                ok: false,
                msg: "Preencha todos os campos em vermelho!"
            });
            return;
        }

        if(parseFloat(vlCompraAlt.trim()) <= 0 && vlCompraAlt.trim() != ""){
            res.send({
                ok: false,
                msg: "Valor de compra deve ser maior que zero"
            });
            return;
        }
        if(parseFloat(vlVendaAlt.trim()) <= 0 && vlVendaAlt.trim() != ""){
            res.send({
                ok: false,
                msg: "Valor de venda deve ser maior que zero"
            });
            return;
        }

        if(parseFloat(vlVendaAlt.trim()) < vlCompraAlt.trim()){
            res.send({
                ok: false,
                msg: "Valor de venda não pode ser menor que o valor de compra"
            });
            return;
        }

        if(qtdEstoqueAlt < 0){
            res.send({
                ok: false,
                msg: "Não é permitido cadastrar com estoque negativo"
            });
            return;
        }

        let nomeImagem = req.file ? req.file.filename : "MANTER";

        try {
            let produto = new ProdutoModel(
                id,                     
                skuAlt.trim(),          
                nomeAlt.trim(),         
                vlVendaAlt.trim(),      
                vlCompraAlt.trim(),     
                qtdEstoqueAlt.trim(),   
                marcaIdAlt.trim(),      
                tipoIdAlt.trim(),       
                "",                     
                "",                    
                nomeImagem           
            );

            const skuMarcaExistente = await produto.buscarPorSkuEMarca(skuAlt.trim(), marcaIdAlt.trim());
            if(skuMarcaExistente && skuMarcaExistente.produtoId != id){
                res.send({
                    ok: false,
                    msg: `O SKU '${skuAlt.trim()}' já existe para a marca selecionada!`
                });
                return;
            }

            const produtoExistente = await produto.buscarExistnte(nomeAlt.trim(), marcaIdAlt.trim(), tipoIdAlt.trim());
            if(produtoExistente && produtoExistente.produtoId != id){
                res.send({
                    ok: false,
                    msg: `Já existe outro produto com mesmo Nome, Marca e Tipo!`
                })
                return;
            }

            let result = await produto.cadastrarProduto();

            if (result) {
                res.send({
                    ok: true,
                    msg: "Produto alterado com sucesso!"
                });
            } else {
                res.send({
                    ok: false,
                    msg: "Erro ao alterar o produto (ID não encontrado ou sem alterações)"
                });
            }
        } catch (error) {
            console.error("Erro no alterar:", error);
            res.send({
                ok: false,
                msg: "Ocorreu um erro inesperado ao salvar."
            });
        }
    }
    
    async obterProduto(req, res) {
        let produtoId = req.params.id;

        let produtoModel = new ProdutoModel();
        let produto = await produtoModel.buscar(produtoId);

        if(produto){
            res.send({ 
                ok: true, 
                produto: produto 
            });
        } else {
            res.send({ 
                ok: false, 
                msg: "Produto não encontrado" 
            });
        }
    }

     async excluir(req, res) {
        let id = req.body.id;

        try {
            let produto = new ProdutoModel();
            let result = await produto.excluir(id);

            if (result) {
                res.send({ ok: true, msg: "Produto excluído com sucesso!" });
            } else {
                res.send({ ok: false, msg: "Erro ao excluir produto." });
            }
        } catch (error) {
            console.error("Erro ao excluir:", error);
            res.send({ ok: false, msg: "Erro inesperado ao excluir o produto." });
        }
    }
    
    async buscarPorNome(req, res) {
        let termo = req.params.nome;
        
        try {
            let produto = new ProdutoModel();
            let lista = await produto.listarPorNome(termo);
            res.json({ produtos: lista });
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            res.status(500).json({ ok: false, msg: "Erro no servidor" });
        }
    }
}

module.exports = ProdutoController;