const Database = require('../db/database');
const fs = require("fs");//parte da imagem
const conexao = new Database();

class ProdutoModel {

    #produtoId;
    #produtoSku;
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
    get produtoSku() { return this.#produtoSku; } set produtoSku(produtoSku) { this.#produtoSku = produtoSku; }
    get produtoNome() { return this.#produtoNome; } set produtoNome(produtoNome) { this.#produtoNome = produtoNome; }
    get valorVenda() { return this.#valorVenda; } set valorVenda(valorVenda) { this.#valorVenda = valorVenda; }
    get valorCompra() { return this.#valorCompra; } set valorCompra(valorCompra) { this.#valorCompra = valorCompra; }
    get qtdEstoque() { return this.#qtdEstoque; } set qtdEstoque(qtdEstoque) { this.#qtdEstoque = qtdEstoque; }
    get marcaId() { return this.#marcaId; } set marcaId(marcaId) { this.#marcaId = marcaId; }
    get marcaNome() { return this.#marcaNome; } set marcaNome(marcaNome) { this.#marcaNome = marcaNome; }
    get tipoProdutoId() { return this.#tipoProdutoId; } set tipoProdutoId(tipoProdutoId) { this.#tipoProdutoId = tipoProdutoId; }
    get tipoProdutoNome() { return this.#tipoProdutoNome; } set tipoProdutoNome(tipoProdutoNome) { this.#tipoProdutoNome = tipoProdutoNome; }
    get produtoImagem() { return this.#produtoImagem; } set produtoImagem(produtoImagem) { this.#produtoImagem = produtoImagem; }

    constructor(produtoId, produtoSku, produtoNome, valorVenda, valorCompra, qtdEstoque, marcaId, tipoProdutoId, marcaNome = "", tipoProdutoNome = "", produtoImagem = "") {
        this.#produtoId = produtoId;
        this.#produtoSku = produtoSku;
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
        let sql = `SELECT P.ID_PRODUTO, P.SKU, P.DESC_PRODUTO, P.VALOR_VENDA, P.VALOR_COMPRA,P.QTD_ESTOQUE, P.MARCA_ID_MARCA, P.TIPO_PRODUTO_ID_TIPO,P.PRODUTO_IMAGEM, M.DESC_MARCA, TP.TIPO_DESCRICAO
               FROM PRODUTO P INNER JOIN TIPO_PRODUTO TP ON P.TIPO_PRODUTO_ID_TIPO = TP.ID_TIPO
               INNER JOIN MARCA M ON P.MARCA_ID_MARCA = M.ID_MARCA
               ORDER BY P.ID_PRODUTO ASC`;

        var rows = await conexao.ExecutaComando(sql);
        let listaRetorno = [];

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                var row = rows[i];
                let imagem = "";
                if (row["PRODUTO_IMAGEM"] != null &&
                    fs.existsSync(global.CAMINHO_IMG_ABS + row["PRODUTO_IMAGEM"])) {
                    imagem = row["PRODUTO_IMAGEM"];
                } else {
                    imagem = "produto-sem-imagem.webp";
                }
                listaRetorno.push(new ProdutoModel(
                    row['ID_PRODUTO'],
                    row['SKU'],
                    row['DESC_PRODUTO'],
                    row['VALOR_VENDA'],
                    row['VALOR_COMPRA'],
                    row['QTD_ESTOQUE'],
                    row['MARCA_ID_MARCA'],
                    row['TIPO_PRODUTO_ID_TIPO'],
                    row['DESC_MARCA'],
                    row['TIPO_DESCRICAO'],
                    imagem
                ));
            }
        }
        return listaRetorno;
    }

    async cadastrarProduto() {
        if (this.#produtoId == 0) {
            let sql = "INSERT INTO PRODUTO (SKU, DESC_PRODUTO, VALOR_VENDA, VALOR_COMPRA, QTD_ESTOQUE, MARCA_ID_MARCA, TIPO_PRODUTO_ID_TIPO, PRODUTO_IMAGEM) VALUES (?,?,?,?,?,?,?,?)";
            let valores = [this.#produtoSku, this.#produtoNome, this.#valorVenda, this.#valorCompra, this.#qtdEstoque, this.#marcaId, this.#tipoProdutoId, this.#produtoImagem];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        }
        else {
            let sql = "";
            let valores = [];

            if (this.#produtoImagem === "MANTER" || this.#produtoImagem === "") {
                sql = "UPDATE PRODUTO SET SKU = ?, DESC_PRODUTO = ?, VALOR_VENDA = ?, VALOR_COMPRA = ?, QTD_ESTOQUE = ?, MARCA_ID_MARCA = ?, TIPO_PRODUTO_ID_TIPO = ? WHERE ID_PRODUTO = ?";
                valores = [this.#produtoSku, this.#produtoNome, this.#valorVenda, this.#valorCompra, this.#qtdEstoque, this.#marcaId, this.#tipoProdutoId, this.#produtoId];
            } else {
                sql = "UPDATE PRODUTO SET SKU = ?, DESC_PRODUTO = ?, VALOR_VENDA = ?, VALOR_COMPRA = ?, QTD_ESTOQUE = ?, MARCA_ID_MARCA = ?, TIPO_PRODUTO_ID_TIPO = ?, PRODUTO_IMAGEM = ? WHERE ID_PRODUTO = ?";
                valores = [this.#produtoSku, this.#produtoNome, this.#valorVenda, this.#valorCompra, this.#qtdEstoque, this.#marcaId, this.#tipoProdutoId, this.#produtoImagem, this.#produtoId];
            }

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        }
    }

    async buscar(id) {
        let sql = "SELECT * FROM PRODUTO WHERE ID_PRODUTO = ?";
        let valores = [id];
        let rows = await conexao.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];
            let imagem = "";
            if (row["PRODUTO_IMAGEM"] &&
                fs.existsSync(global.CAMINHO_IMG_ABS + row["PRODUTO_IMAGEM"])) {

                imagem = global.CAMINHO_IMG + row["PRODUTO_IMAGEM"];
            }
            else {
                imagem = global.CAMINHO_IMG + "produto-sem-imagem.webp";
            }
            return new ProdutoModel(
                row['ID_PRODUTO'],
                row['SKU'],
                row['DESC_PRODUTO'],
                row['VALOR_VENDA'],
                row['VALOR_COMPRA'],
                row['QTD_ESTOQUE'],
                row['MARCA_ID_MARCA'],
                row['TIPO_PRODUTO_ID_TIPO'],
                "",
                "",
                imagem
                //row['PRODUTO_IMAGEM']
            );
        }
        return null;
    }

    async atualizarEstoque(id, novaQuantidade) {
        let sql = "update tb_produto set prd_quantidade = ? where prd_id = ?";
        let valores = [novaQuantidade, id];

        return await conexao.ExecutaComandoNonQuery(sql, valores) > 0;
    }

    async buscarExistnte(nome, marca, tipo) {
        let sql = "SELECT * FROM PRODUTO WHERE DESC_PRODUTO = ? AND MARCA_ID_MARCA = ? AND TIPO_PRODUTO_ID_TIPO = ?";
        let valores = [nome, marca, tipo];
        let rows = await conexao.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];
            return new ProdutoModel(
                row['ID_PRODUTO'],
                row['SKU'],
                row['DESC_PRODUTO'],
                row['VALOR_VENDA'],
                row['VALOR_COMPRA'],
                row['QTD_ESTOQUE'],
                row['MARCA_ID_MARCA'],
                row['TIPO_PRODUTO_ID_TIPO'],
                row['PRODUTO_IMAGEM']
            );
        }
        return null;
    }

    async buscarPorSkuEMarca(sku, marcaId) {
        let sql = "SELECT * FROM PRODUTO WHERE SKU = ? AND MARCA_ID_MARCA = ?";
        let valores = [sku, marcaId];
        let rows = await conexao.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];
            return new ProdutoModel(
                row['ID_PRODUTO'],
                row['SKU'],
                row['DESC_PRODUTO'],
                0, 0, 0,
                row['MARCA_ID_MARCA'],
                0
            );
        }
        return null;
    }

    async excluir(id) {
        let sql = "DELETE FROM PRODUTO WHERE ID_PRODUTO = ?";
        let valores = [id];

        let result = await conexao.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    toJSON() {
        return {
            id: this.#produtoId,
            nome: this.#produtoNome,
            preco: this.#valorVenda,
            imagem: this.#produtoImagem,
            estoque: this.#qtdEstoque,

            sku: this.#produtoSku,
            valorCompra: this.#valorCompra,
            marcaId: this.#marcaId,
            marcaNome: this.#marcaNome,
            tipoProdutoId: this.#tipoProdutoId,
            tipoProdutoNome: this.#tipoProdutoNome
        }
    }

    async listarPorNome(termo) {
        let sql = "SELECT * FROM PRODUTO WHERE DESC_PRODUTO LIKE ? ORDER BY DESC_PRODUTO ASC";
        let valores = [`%${termo}%`];
        
        let rows = await conexao.ExecutaComando(sql, valores);
        
        let listaRetorno = [];
        if(rows.length > 0){
            for(let i=0; i<rows.length; i++){
                var row = rows[i];
                
                listaRetorno.push({
                    id: row['ID_PRODUTO'],
                    nome: row['DESC_PRODUTO'],
                    valor: row['VALOR_VENDA']
                });
            }
        }
        return listaRetorno;
    }

    //relatorio de produtos
    async listarRelatorioProduto(filtro) {
        let sql = `
            SELECT
                P.ID_PRODUTO, P.SKU, P.DESC_PRODUTO, P.VALOR_VENDA,
                P.QTD_ESTOQUE, M.DESC_MARCA, TP.TIPO_DESCRICAO
            FROM PRODUTO P
            INNER JOIN TIPO_PRODUTO TP
                ON P.TIPO_PRODUTO_ID_TIPO=TP.ID_TIPO
            INNER JOIN MARCA M
                ON P.MARCA_ID_MARCA= M.ID_MARCA
        `;
        if (filtro == 0) {
            sql += ` WHERE P.QTD_ESTOQUE = 0`;
        }
        if (filtro == 1) {
            sql += ` ORDER BY P.QTD_ESTOQUE DESC`;
        }
        if (filtro == 2) {
            sql += ` ORDER BY TP.TIPO_DESCRICAO ASC`;
        }
        var rows = await conexao.ExecutaComando(sql);
        let listaRetorno = [];
        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                listaRetorno.push({
                    id: row["ID_PRODUTO"],
                    sku: row["SKU"],
                    nome: row["DESC_PRODUTO"],
                    marca: row["DESC_MARCA"],
                    tipo: row["TIPO_DESCRICAO"],
                    estoque: row["QTD_ESTOQUE"],
                    valor: row["VALOR_VENDA"]
                });
            }
        }
        return listaRetorno;

    }

}
module.exports = ProdutoModel;