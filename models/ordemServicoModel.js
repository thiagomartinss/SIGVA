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
}

module.exports = OrdemServicoModel;