const Database = require('../db/database');

const conexao = new Database();

class PessoaFisicaModel{
    #idPessoa;
    #nome;
    #cpf;
    #dataNascimento;

    get idPessoa() {return this.#idPessoa;} set idPessoa(idPessoa) {this.#idPessoa = idPessoa}
    get nome() { return this.#nome; } set nome(nome) { this.#nome = nome; }
    get cpf() { return this.#cpf; } set cpf(cpf) { this.#cpf = cpf; }
    get dataNascimento() { return this.#dataNascimento; } set dataNascimento(dataNascimento) { this.#dataNascimento = dataNascimento; }

    constructor(idPessoa, nome = "", cpf = "", dataNascimento = ""){
        this.#idPessoa = idPessoa;
        this.#nome = nome;
        this.#cpf = cpf;
        this.#dataNascimento = dataNascimento;
    }

    async cadastrar(connection = null) {
        
        let sql = "INSERT INTO PESSOA_FISICA (ID_PESSOAFISICA, NOME, CPF, DT_NASCIMENTO) VALUES (?, ?, ?, ?)";
        let valores = [this.#idPessoa, this.#nome, this.#cpf, this.#dataNascimento];

        return await conexao.ExecutaComandoNonQuery(sql, valores, connection);
    }

    async atualizar(connection) {
        let sql = "UPDATE PESSOA_FISICA SET NOME = ?, CPF = ?, DT_NASCIMENTO = ? WHERE ID_PESSOAFISICA = ?";
        let valores = [this.#nome, this.#cpf, this.#dataNascimento, this.#idPessoa];
        
        return await conexao.ExecutaComandoNonQuery(sql, valores, connection);
    }

    async excluir(id, connection) {
        let sql = "DELETE FROM PESSOA_FISICA WHERE ID_PESSOAFISICA = ?";
        
        return await conexao.ExecutaComandoNonQuery(sql, [id], connection);
    }
}

module.exports = PessoaFisicaModel;