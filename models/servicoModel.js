const Database = require('../db/database');

const conexao = new Database();

class ServicoModel {

    #servicoId;
    #servicoDesc;
    #servicoValor;

    get servicoId() { return this.#servicoId; } set servicoId(servicoId) {this.#servicoId = servicoId;}
    get servicoDesc() { return this.#servicoDesc; } set servicoDesc(servicoDesc) {this.#servicoDesc = servicoDesc;}
    get servicoValor(){ return this.#servicoValor;} set servicoValor(servicoValor){this.#servicoValor = servicoValor}

    constructor(servicoId, servicoDesc, servicoValor) {
        this.#servicoId = servicoId
        this.#servicoDesc = servicoDesc
        this.#servicoValor = servicoValor
    }

    async listarServico() {

        let sql = 'SELECT * FROM SERVICO ORDER BY ID_SERVICO ASC';
        
        var rows = await conexao.ExecutaComando(sql);

        let listaRetorno = [];

        if(rows.length > 0){
            for(let i=0; i<rows.length; i++){
                var row = rows[i];
                listaRetorno.push(new ServicoModel
                    (row['ID_SERVICO'], row['DESC_SERVICO'], row['VALOR_SERVICO']));
            }
        }
        return listaRetorno;
    }

    async cadastrarServicos(){
        if(this.#servicoId == 0){
            let sql = "INSERT INTO SERVICO (`DESC_SERVICO`, `VALOR_SERVICO`) VALUES (?,?)";
            let valores = [this.#servicoDesc, this.#servicoValor];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        }else{
            let sql = "UPDATE SERVICO SET `DESC_SERVICO` = ?, `VALOR_SERVICO` = ? WHERE `ID_SERVICO` = ?";
            let valores = [this.#servicoDesc, this.#servicoValor, this.#servicoId];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        }
    }

    async buscar(id){
        let sql = "SELECT * FROM SERVICO WHERE ID_SERVICO = ?";
        let valores = [id];
        let rows = await conexao.ExecutaComando(sql,valores);

        if(rows.length > 0){
            let row = rows[0];
            return new ServicoModel(row["ID_SERVICO"], row["DESC_SERVICO"], row["VALOR_SERVICO"]);
        }
        return null;
    }

    async buscarExistente(desc){
        let sql = "SELECT * FROM SERVICO WHERE DESC_SERVICO = ?";
        let valores = [desc];
        let rows = await conexao.ExecutaComando(sql,valores);

        if(rows.length > 0){
            let row = rows[0];
            return new ServicoModel(row["ID_SERVICO"], row["DESC_SERVICO"], row["VALOR_SERVICO"]);
        }
        return null;
    }

    async excluir(id) {
        let sql = "DELETE FROM SERVICO WHERE ID_SERVICO = ?";
        let valores = [id];

        let result = await conexao.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async listarPorNome(termo) {
        let sql = "SELECT * FROM SERVICO WHERE DESC_SERVICO LIKE ? ORDER BY DESC_SERVICO ASC";
        let valores = [`%${termo}%`];
        
        let rows = await conexao.ExecutaComando(sql, valores);
        
        let listaRetorno = [];
        if(rows.length > 0){
            for(let i=0; i<rows.length; i++){
                var row = rows[i];
                
                // --- CORREÇÃO AQUI ---
                // Em vez de "new ServicoModel(...)", criamos um objeto simples
                // para garantir que o JSON consiga ler os dados no Front-End
                listaRetorno.push({
                    servicoId: row['ID_SERVICO'], 
                    servicoDesc: row['DESC_SERVICO'], 
                    servicoValor: row['VALOR_SERVICO']
                });
            }
        }
        return listaRetorno;
    }
}

module.exports = ServicoModel;