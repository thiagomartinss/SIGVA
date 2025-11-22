const Database = require('../db/database');

const conexao = new Database();

class EnderecoModel{
    #cep;
    #logradouro;
    #numero;
    #bairro;
    #cidadeId;
    #cidade;
    #ufId;
    #uf;

    get cep() { return this.#cep; } set cep(cep) { this.#cep = cep; }
    get logradouro() { return this.#logradouro; } set logradouro(logradouro) { this.#logradouro = logradouro; }
    get numero() { return this.#numero; } set numero(numero) { this.#numero = numero; }
    get bairro() { return this.#bairro; } set bairro(bairro) { this.#bairro = bairro; }
    get cidadeId(){ return this.#cidadeId} set cidadeId(cidadeId) {this.#cidadeId = cidadeId}
    get cidade() { return this.#cidade; } set cidade(cidade) { this.#cidade = cidade; }
    get ufId() { return this.#ufId; } set ufId(ufId) { this.#ufId = ufId; }
    get uf() { return this.#uf; } set uf(uf) { this.#uf = uf; }

    constructor(cep, logradouro, numero, bairro, cidadeId, cidade, uf, ufId){
        this.#cep = cep;
        this.#logradouro = logradouro;
        this.#numero = numero;
        this.#bairro = bairro;
        this.#cidadeId = cidadeId;
        this.#cidade = cidade;
        this.#uf = uf;
        this.#ufId = ufId;
    }

    async listarUf(){
        let sql = `SELECT * FROM UF ORDER BY ID_UF ASC`;
        let rows = await conexao.ExecutaComando(sql);
        let listaRetorno = [];

        if(rows.length > 0){
            for(let i = 0; i < rows.length; i++){
                var row = rows[i];
                listaRetorno.push(new EnderecoModel(null, null, null, null,null, null, row['SIGLA_UF'], row['ID_UF']));
            }
        }
        return listaRetorno;
    }

    async listarCidade(){
        let sql = `SELECT * FROM CIDADE ORDER BY NOME_CID ASC`;
        let rows = await conexao.ExecutaComando(sql);
        let listaRetorno = [];

        if(rows.length > 0){
            for(let i = 0; i < rows.length; i++){
                var row = rows[i];
                listaRetorno.push(new EnderecoModel(null, null, null, null, row['ID_CIDADE'], row['NOME_CID'], null, null));
            }
        }
        return listaRetorno;
    }

    async cadastrar(connection = null) {
        let sql = "INSERT INTO ENDERECO (CEP, LOGRADOURO, NUMERO, BAIRRO, ID_CIDADE) VALUES (?, ?, ?, ?, ?)";
        let valores = [this.#cep, this.#logradouro, this.#numero, this.#bairro, this.#cidadeId];

        let result = await conexao.ExecutaComandoNonQuery(sql, valores, connection);
        
        return result.insertId;
    }
}

module.exports = EnderecoModel;