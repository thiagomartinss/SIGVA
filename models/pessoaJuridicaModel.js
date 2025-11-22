const Database = require('../db/database');

const conexao = new Database();

class PessoaJuridicaModel{
    #idPessoa;
    #cnpj;
    #razaoSocial;
    #nomeFantasia;

    get idPessoa() {return this.#idPessoa;} set idPessoa(idPessoa) {this.#idPessoa = idPessoa}
    get cnpj() { return this.#cnpj; } set cnpj(cnpj) { this.#cnpj = cnpj; }
    get razaoSocial() { return this.#razaoSocial; } set razaoSocial(razaoSocial) { this.#razaoSocial = razaoSocial; }
    get nomeFantasia() { return this.#nomeFantasia; } set nomeFantasia(nomeFantasia) { this.#nomeFantasia = nomeFantasia; }

    constructor(idPessoa, cnpj = "", razaoSocial = "", nomeFantasia = ""){
        this.#idPessoa = idPessoa;
        this.#cnpj = cnpj;
        this.#razaoSocial = razaoSocial;
        this.#nomeFantasia = nomeFantasia;
    }

    async cadastrar(connection = null) {
        let sql = "INSERT INTO PESSOA_JURIDICA (ID_PESSOAJURIDICA, CNPJ, RAZAO_SOCIAL, NOME_FANTASIA) VALUES (?, ?, ?, ?)";
        let valores = [this.#idPessoa, this.#cnpj, this.#razaoSocial, this.#nomeFantasia];

        return await conexao.ExecutaComandoNonQuery(sql, valores, connection);
    }
}

module.exports = PessoaJuridicaModel;