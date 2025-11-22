const Database = require('../db/database');

const conexao = new Database();

class PessoaModel{
    #pessoaId;
    #email;
    #telefone;
    #ehCliente;
    #ehFornecedor;
    #idEndereco;
    
    get pessoaId() { return this.#pessoaId; } set pessoaId(pessoaId) { this.#pessoaId = pessoaId; }
    get email() { return this.#email; } set email(email) { this.#email = email; }
    get telefone() { return this.#telefone; } set telefone(telefone) { this.#telefone = telefone; }
    get ehCliente() { return this.#ehCliente; } set ehCliente(ehCliente) { this.#ehCliente = ehCliente; }
    get ehFornecedor() { return this.#ehFornecedor; } set ehFornecedor(ehFornecedor) { this.#ehFornecedor = ehFornecedor; }
    get idEndereco() {return this.#idEndereco;} set idEndereco(idEndereco) {this.#idEndereco = idEndereco;}

    constructor(pessoaId, email, telefone, ehCliente, ehFornecedor, idEndereco) {
        this.#pessoaId = pessoaId;
        this.#email = email;
        this.#telefone = telefone;
        this.#ehCliente = ehCliente;
        this.#ehFornecedor = ehFornecedor;
        this.#idEndereco = idEndereco;
    }

    async cadastrar(connection = null) {
        let sql = "INSERT INTO PESSOA (EMAIL, TELEFONE, EH_CLIENTE, EH_FORNECEDOR, ENDERECO_ID_ENDERECO) VALUES (?, ?, ?, ?, ?)";
        
        let valores = [
            this.#email, 
            this.#telefone, 
            this.#ehCliente ? 1 : 0,     
            this.#ehFornecedor ? 1 : 0,
            this.#idEndereco
        ];

        let result = await conexao.ExecutaComandoNonQuery(sql, valores, connection);
        
        return result.insertId; 
    }
}

module.exports = PessoaModel;