const Database = require('../db/database');
const fs=require("fs");//parte da imagem
const conexao = new Database();

class ProdutoModel {

    #produtoId;
    #produtoNome;
    #valorVenda;
    #valorCompra;
    #qtdEstoque;
    #marcaId;
    #marcaNome;
    #tipoProdutoId;
    #tipoProdutoNome;
    #produtoImagem;

    get produtoId() { return this.#produtoId; } set produtoId(produtoId) { this.#produtoId = produtoId; }
    get produtoNome() { return this.#produtoNome; } set produtoNome(produtoNome) { this.#produtoNome = produtoNome; }
    get valorVenda() { return this.#valorVenda; } set valorVenda(valorVenda) { this.#valorVenda = valorVenda; }
    get valorCompra() { return this.#valorCompra; } set valorCompra(valorCompra) { this.#valorCompra = valorCompra; }
    get qtdEstoque() { return this.#qtdEstoque; } set qtdEstoque(qtdEstoque) { this.#qtdEstoque = qtdEstoque; }
    get marcaId() { return this.#marcaId; } set marcaId(marcaId) { this.#marcaId = marcaId; }
    get marcaNome() { return this.#marcaNome; } set marcaNome(marcaNome) { this.#marcaNome = marcaNome; }
    get tipoProdutoId() { return this.#tipoProdutoId; } set tipoProdutoId(tipoProdutoId) { this.#tipoProdutoId = tipoProdutoId; }
    get tipoProdutoNome() { return this.#tipoProdutoNome; } set tipoProdutoNome(tipoProdutoNome) { this.#tipoProdutoNome = tipoProdutoNome; }
    get produtoImagem() { return this.#produtoImagem; } set produtoImagem(produtoImagem) { this.#produtoImagem = produtoImagem; }

    constructor(produtoId, produtoNome, valorVenda, valorCompra, qtdEstoque, marcaId, tipoProdutoId, marcaNome = "", tipoProdutoNome = "", produtoImagem) {
        this.#produtoId = produtoId;
        this.#produtoNome = produtoNome;
        this.#valorVenda = valorVenda;
        this.#valorCompra = valorCompra;
        this.#qtdEstoque = qtdEstoque;
        this.#marcaId = marcaId;
        this.#marcaNome = marcaNome;
        this.#tipoProdutoId = tipoProdutoId;
        this.#tipoProdutoNome = tipoProdutoNome;
        this.#produtoImagem = produtoImagem;

    }

    async listarProdutos() {
        let sql = `SELECT P.ID_PRODUTO, P.DESC_PRODUTO, P.VALOR_VENDA, P.VALOR_COMPRA, P.QTD_ESTOQUE, P.MARCA_ID_MARCA, P.TIPO_PRODUTO_ID_TIPO, M.DESC_MARCA, TP.TIPO_DESCRICAO
                    FROM PRODUTO P
                    INNER JOIN TIPO_PRODUTO TP ON P.TIPO_PRODUTO_ID_TIPO = TP.ID_TIPO
                    INNER JOIN MARCA M ON P.MARCA_ID_MARCA = M.ID_MARCA
                    ORDER BY P.ID_PRODUTO ASC`

        var rows = await conexao.ExecutaComando(sql);
        let listaRetorno = [];

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                var row = rows[i];
                listaRetorno.push(new ProdutoModel(
                    row['ID_PRODUTO'], row['DESC_PRODUTO'], row['VALOR_VENDA'], row['VALOR_COMPRA'], row['QTD_ESTOQUE'], row['MARCA_ID_MARCA'], row['TIPO_PRODUTO_ID_TIPO'], row['DESC_MARCA'], row['TIPO_DESCRICAO']
                ));
            }
        }
        return listaRetorno;
    }

    async cadastrarProduto() {
        if (this.#produtoId == 0) {
            let sql = "INSERT INTO PRODUTO (DESC_PRODUTO, VALOR_VENDA,VALOR_COMPRA, QTD_ESTOQUE, MARCA_ID_MARCA, TIPO_PRODUTO_ID_TIPO) VALUES (?,?,?,?,?,?)";
            let valores = [this.#produtoNome, this.#valorVenda, this.#valorCompra, this.#qtdEstoque, this.#marcaId, this.#tipoProdutoId];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        } else {
            let sql = "UPDATE PRODUTO SET DESC_PRODUTO = ?, VALOR_VENDA = ?, VALOR_COMPRA = ?, QTD_ESTOQUE = ?, MARCA_ID_MARCA = ?, TIPO_PRODUTO_ID_TIPO = ? WHERE ID_PRODUTO = ?";
            let valores = [this.#produtoNome, this.#valorVenda, this.#valorCompra, this.#qtdEstoque, this.#marcaId, this.#tipoProdutoId, this.#produtoId];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        }
    }

    async buscar(id) {
        let sql = "SELECT * FROM PRODUTO WHERE ID_PRODUTO = ?";
        let valores = [id];
        let rows = await conexao.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];
            return new ProdutoModel(row['ID_PRODUTO'], row['DESC_PRODUTO'], row['VALOR_VENDA'], row['VALOR_COMPRA'], row['QTD_ESTOQUE'], row['MARCA_ID_MARCA'], row['TIPO_PRODUTO_ID_TIPO']);
        }
        return null;
    }

    async buscarExistnte(nome, marca, tipo) {
        let sql = "SELECT * FROM PRODUTO WHERE DESC_PRODUTO = ? AND MARCA_ID_MARCA = ? AND TIPO_PRODUTO_ID_TIPO = ?";
        let valores = [nome, marca, tipo];
        let rows = await conexao.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];
            return new ProdutoModel(row['ID_PRODUTO'], row['DESC_PRODUTO'], row['QTD_ESTOQUE'], row['MARCA_ID_MARCA'], row['TIPO_PRODUTO_ID_TIPO']);
        }
        return null;
    }

    async buscarProduto(id) {//DPS POR PRODUTO_IMAGEM AQUI
        let sql = `SELECT ID_PRODUTO, DESC_PRODUTO, VALOR_VENDA, VALOR_COMPRA, QTD_ESTOQUE, MARCA_ID_MARCA, TIPO_PRODUTO_ID_TIPO FROM PRODUTO WHERE ID_PRODUTO = ?`;
        let valores = [id];
        var row = await conexao.ExecutaComando(sql, valores);
        if (row.length > 0) {
            let r = row[0];
            // let imagem = "";

            // if (row["PRODUTO_IMAGEM"] &&
            //     fs.existsSync(global.CAMINHO_IMG_ABS + row["PRODUTO_IMAGEM"])) {

            //     imagem = global.CAMINHO_IMG + row["PRODUTO_IMAGEM"];
            // }
            // else {
            //     imagem = global.CAMINHO_IMG + "produto-sem-imagem.webp";
            // }
            return new ProdutoModel(r['ID_PRODUTO'], r['DESC_PRODUTO'],r['VALOR_VENDA'],r['VALOR_COMPRA'], r['QTD_ESTOQUE'], r['MARCA_ID_MARCA'], r['TIPO_PRODUTO_ID_TIPO'], "", "",
            //imagem
            );
        }
        return null
    }


    toJSON() {
        return {
            id: this.#produtoId,
            nome: this.#produtoNome,
            preco: this.#valorVenda,
            //imagem: this.#produtoImagem
        }
    }
}
module.exports = ProdutoModel;