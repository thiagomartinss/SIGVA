const Database = require('../db/database');
const conexao = new Database();

class OrdemServicoModel {
    #valorTotal;
    #clienteId;
    #enderecoId;
    #descServico;
    #equipamentoId;

    get valorTotal() { return this.#valorTotal; } 
    set valorTotal(valorTotal) { this.#valorTotal = valorTotal; }

    get clienteId() { return this.#clienteId; } 
    set clienteId(clienteId) { this.#clienteId = clienteId; }

    get enderecoId() { return this.#enderecoId; } 
    set enderecoId(enderecoId) { this.#enderecoId = enderecoId; }

    get descServico() { return this.#descServico; } 
    set descServico(descServico) { this.#descServico = descServico; }

    get equipamentoId() { return this.#equipamentoId; } 
    set equipamentoId(equipamentoId) { this.#equipamentoId = equipamentoId; }

    constructor(valorTotal, clienteId, enderecoId, descServico, equipamentoId) {
        this.#valorTotal = valorTotal;
        this.#clienteId = clienteId;
        this.#enderecoId = enderecoId;
        this.#descServico = descServico;
        this.#equipamentoId = equipamentoId;
    }

    async listarTodasOs() {
        
        let sql = `
            SELECT 
                os.ID_OS, 
                os.DT_ABERTURA, 
                os.DT_FECHAMENTO, 
                os.VALOR, 
                os.STATUS, 
                COALESCE(pf.NOME, pj.NOME_FANTASIA) AS NOME_CLIENTE
            FROM ORDEM_SERVICO os
            INNER JOIN PESSOA p ON os.PESSOA_ID_PESSOA = p.ID_PESSOA
            LEFT JOIN PESSOA_FISICA pf ON p.ID_PESSOA = pf.ID_PESSOAFISICA
            LEFT JOIN PESSOA_JURIDICA pj ON p.ID_PESSOA = pj.ID_PESSOAJURIDICA
            ORDER BY os.ID_OS DESC
        `;
        
        let rows = await conexao.ExecutaComando(sql);
        return rows;
    }

    async cadastrarOS(connection) {
        let sql = `INSERT INTO ORDEM_SERVICO 
                   (DT_ABERTURA, STATUS, VALOR, DESC_SERVICO, PESSOA_ID_PESSOA, PESSOA_ENDERECO_ID_ENDERECO, EQUIPAMENTO_ID_EQUIPAMENTO) 
                   VALUES (NOW(), 'EM ABERTO', ?, ?, ?, ?, ?)`;
        
        let valores = [this.#valorTotal, this.#descServico, this.#clienteId, this.#enderecoId, this.#equipamentoId];

        let insertId = await conexao.ExecutaComandoLastInserted(sql, valores, connection);
        return insertId;
    }

    async cadastrarItemServico(idOs, idServico, valor, connection) {
        let sql = `INSERT INTO ITENS_OSSERVICO 
                   (ORDEM_SERVICO_ID_OS, SERVICO_ID_SERVICO, VALOR_SERVICO) 
                   VALUES (?, ?, ?)`;
        
        let valores = [idOs, idServico, valor];
        
        await conexao.ExecutaComandoNonQuery(sql, valores, connection);
    }

    async cadastrarItemProduto(idOs, idProduto, qtd, valorUnit, connection) {
        let sql = `INSERT INTO ITENS_OSPRODUTO 
                   (ORDEM_SERVICO_ID_OS, PRODUTO_ID_PRODUTO, QUANTIDADE, VALOR_UNITARIO) 
                   VALUES (?, ?, ?, ?)`;
        
        let valores = [idOs, idProduto, qtd, valorUnit];
        
        await conexao.ExecutaComandoNonQuery(sql, valores, connection);
    }

    async buscarPorIdCompleto(idOs) {
        let sqlCapa = `SELECT * FROM ORDEM_SERVICO WHERE ID_OS = ?`;
        let rowsCapa = await conexao.ExecutaComando(sqlCapa, [idOs]);
        let capa = rowsCapa[0]; 

        if (!capa) 
            return null;

        let sqlServ = `
            SELECT i.*, s.DESC_SERVICO as NOME_SERVICO 
            FROM ITENS_OSSERVICO i
            INNER JOIN SERVICO s ON i.SERVICO_ID_SERVICO = s.ID_SERVICO
            WHERE i.ORDEM_SERVICO_ID_OS = ?`;
        let servicos = await conexao.ExecutaComando(sqlServ, [idOs]);

        let sqlProd = `
            SELECT i.*, p.DESC_PRODUTO as NOME_PRODUTO 
            FROM ITENS_OSPRODUTO i
            INNER JOIN PRODUTO p ON i.PRODUTO_ID_PRODUTO = p.ID_PRODUTO
            WHERE i.ORDEM_SERVICO_ID_OS = ?`;
        let produtos = await conexao.ExecutaComando(sqlProd, [idOs]);

        let equipamento = null;
        
        if(capa.EQUIPAMENTO_ID_EQUIPAMENTO) { 
            let sqlEq = `SELECT * FROM EQUIPAMENTO WHERE ID_EQUIPAMENTO = ?`;
            let rowsEq = await conexao.ExecutaComando(sqlEq, [capa.EQUIPAMENTO_ID_EQUIPAMENTO]);
            equipamento = rowsEq[0]; 
        }

        return {
            os: capa, 
            servicos: servicos,
            produtos: produtos,
            equipamento: equipamento
        };
    }

    async alterarOS(idOs, connection) {
        let sql = `UPDATE ORDEM_SERVICO SET 
                   VALOR = ?, DESC_SERVICO = ?, EQUIPAMENTO_ID_EQUIPAMENTO = ? 
                   WHERE ID_OS = ?`;
        
        let valores = [this.#valorTotal, this.#descServico, this.#equipamentoId, idOs];
        await conexao.ExecutaComandoNonQuery(sql, valores, connection);

        await conexao.ExecutaComandoNonQuery(`DELETE FROM ITENS_OSSERVICO WHERE ORDEM_SERVICO_ID_OS = ?`, [idOs], connection);
        await conexao.ExecutaComandoNonQuery(`DELETE FROM ITENS_OSPRODUTO WHERE ORDEM_SERVICO_ID_OS = ?`, [idOs], connection);
    }
}

module.exports = OrdemServicoModel;