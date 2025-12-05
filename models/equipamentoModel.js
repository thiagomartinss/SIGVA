const Database = require('../db/database');

const conexao = new Database();

class EquipamentoModel {

    #equipamentoId;
    #equipamentoNome;
    #equipamentoModelo;
    #equipamentoEstoque;
    #marcaId; 
    #marcaNome;

    get equipamentoId() { return this.#equipamentoId; } set equipamentoId(equipamentoId) { this.#equipamentoId = equipamentoId; }
    get equipamentoNome() { return this.#equipamentoNome; } set equipamentoNome(equipamentoNome) { this.#equipamentoNome = equipamentoNome; }
    get equipamentoModelo(){return this.#equipamentoModelo;} set equipamentoModelo(equipamentoModelo){this.#equipamentoModelo = equipamentoModelo}
    get equipamentoEstoque(){return this.#equipamentoEstoque;} set equipamentoEstoque(equipamentoEstoque){this.#equipamentoEstoque = equipamentoEstoque}
    get marcaId() { return this.#marcaId; } set marcaId(marcaId) { this.#marcaId = marcaId; }
    get marcaNome() { return this.#marcaNome; } set marcaNome(marcaNome) { this.#marcaNome = marcaNome; }
    
    constructor(equipamentoId, equipamentoNome, equipamentoModelo, equipamentoEstoque,  marcaId, marcaNome = "") {
        this.#equipamentoId = equipamentoId;
        this.#equipamentoNome = equipamentoNome;
        this.#equipamentoModelo = equipamentoModelo;
        this.#equipamentoEstoque = equipamentoEstoque;
        this.#marcaId = marcaId;
        this.#marcaNome = marcaNome;
    }
    
    async listarEquipamentos() {
        let sql = `SELECT e.*, m.DESC_MARCA FROM EQUIPAMENTO e INNER JOIN MARCA m ON e.ID_MARCA = m.ID_MARCA ORDER BY e.ID_EQUIPAMENTO ASC`;
        
        var rows = await conexao.ExecutaComando(sql);
        let listaRetorno = [];

        if(rows.length > 0){
            for(let i=0; i<rows.length; i++){
                var row = rows[i];
                listaRetorno.push(new EquipamentoModel
                    (row['ID_EQUIPAMENTO'], row['DESC_EQUIPAMENTO'], row['MODEL_EQUIPAMENTO'], row['QTD_EQUIPAMENTO'], row['ID_MARCA'], row['DESC_MARCA']));
            }
        }
        return listaRetorno;
    }
    async listarEquipamentosParaOrdem() {
        let sql = `
            SELECT ID_EQUIPAMENTO, DESC_EQUIPAMENTO
            FROM EQUIPAMENTO
            ORDER BY DESC_EQUIPAMENTO ASC
        `;
        
        var rows = await conexao.ExecutaComando(sql);
        let listaRetorno = [];

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                var row = rows[i];
                listaRetorno.push(new EquipamentoModel(
                    row['ID_EQUIPAMENTO'],
                    row['DESC_EQUIPAMENTO']
                ));
            }
        }

        return listaRetorno;
    }

    async cadastrarEquipamento(){
        if(this.#equipamentoId == 0){
            let sql = "INSERT INTO EQUIPAMENTO (DESC_EQUIPAMENTO, MODEL_EQUIPAMENTO, QTD_EQUIPAMENTO, ID_MARCA) VALUES (?, ?, ?, ?)";
            let valores = [
                this.#equipamentoNome, 
                this.#equipamentoModelo, 
                this.#equipamentoEstoque, 
                this.#marcaId
            ];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        } else {// analisar depois se seria melhor criar uma function atualizarEquipamento
            let sql = "UPDATE EQUIPAMENTO SET DESC_EQUIPAMENTO = ?, MODEL_EQUIPAMENTO = ?, QTD_EQUIPAMENTO = ?, ID_MARCA = ? WHERE ID_EQUIPAMENTO = ?";
            let valores = [this.#equipamentoNome, this.#equipamentoModelo, this.#equipamentoEstoque, this.#marcaId, this.#equipamentoId];

            return await conexao.ExecutaComandoNonQuery(sql, valores);
        }
    }

    async buscar(id){
        let sql = "SELECT * FROM EQUIPAMENTO WHERE ID_EQUIPAMENTO = ?";
        let valores = [id];
        let rows = await conexao.ExecutaComando(sql, valores);

        if(rows.length > 0){
            let row = rows[0];
            return new EquipamentoModel(
                row["ID_EQUIPAMENTO"], 
                row["DESC_EQUIPAMENTO"], 
                row['MODEL_EQUIPAMENTO'], 
                row['QTD_EQUIPAMENTO'], 
                row["ID_MARCA"]);
        }
        return null;
    }

    async buscarExistente(nome, modelo, marcaId) {//estudar remoção dessa function
        let sql = "SELECT * FROM EQUIPAMENTO WHERE DESC_EQUIPAMENTO = ? AND MODEL_EQUIPAMENTO = ? AND ID_MARCA = ?";
        let valores = [nome, modelo, marcaId];
        let rows = await conexao.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];
            return new EquipamentoModel(row["ID_EQUIPAMENTO"], row["DESC_EQUIPAMENTO"], row['MODEL_EQUIPAMENTO'], row['QTD_EQUIPAMENTO'], row["ID_MARCA"]);
        }
        return null;
    }
    
    async excluir(id) {
        let sql = "DELETE FROM EQUIPAMENTO WHERE ID_EQUIPAMENTO = ?";
        let valores = [id];
        let result = await conexao.ExecutaComandoNonQuery(sql, valores);
        return result;
    }
}

module.exports = EquipamentoModel;