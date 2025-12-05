const Database = require('../db/database');

const conexao = new Database();

class MarcaModel {

    #marcaId;
    #marcaNome;

    get marcaId() { return this.#marcaId; } set marcaId(marcaId) {this.#marcaId = marcaId;}
    get marcaNome() { return this.#marcaNome; } set marcaNome(marcaNome) {this.#marcaNome = marcaNome;}

    constructor(marcaId, marcaNome) {
        this.#marcaId = marcaId
        this.#marcaNome = marcaNome
    }

    async listarMarcas() {

        let sql = 'SELECT * FROM MARCA ORDER BY ID_MARCA ASC';
        
        var rows = await conexao.ExecutaComando(sql);

        let listaRetorno = [];

        if(rows.length > 0){
            for(let i=0; i<rows.length; i++){
                var row = rows[i];
                listaRetorno.push(new MarcaModel
                    (row['ID_MARCA'], row['DESC_MARCA']));
            }
        }
        return listaRetorno;
    }

    async cadastrarMarcas(){
        if(this.#marcaId == 0){
            let sql = "INSERT INTO MARCA (`DESC_MARCA`) VALUES (?)";
            let valores = [this.#marcaNome];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        }else{
            let sql = "UPDATE MARCA SET `DESC_MARCA` = ? WHERE `ID_MARCA` = ?";
            let valores = [this.#marcaNome, this.#marcaId];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        }
    }

    async buscar(id){
        let sql = "SELECT * FROM MARCA WHERE ID_MARCA = ?";
        let valores = [id];
        let rows = await conexao.ExecutaComando(sql,valores);

        if(rows.length > 0){
            let row = rows[0];
            return new MarcaModel(row["ID_MARCA"], row["DESC_MARCA"]);
        }
        return null;
    }

    async excluir(id) {
        let sql = "DELETE FROM MARCA WHERE ID_MARCA = ?";
        let valores = [id];

        let result = await conexao.ExecutaComandoNonQuery(sql, valores);

        return result;
    }
}

module.exports = MarcaModel;