const Database = require('../db/database');

const conexao = new Database();

class FuncionarioModel{
    #funcionarioId; 
    #matricula;
    #dataAdmissao;
    #dataDemissao;
    #ativo;
    #usuario;
    #senha;
    #nome;

    get funcionarioId() { return this.#funcionarioId; } set funcionarioId(id) { this.#funcionarioId = id; }
    get matricula() { return this.#matricula; } set matricula(matricula) { this.#matricula = matricula; }
    get dataAdmissao() { return this.#dataAdmissao; } set dataAdmissao(data) { this.#dataAdmissao = data; }
    get dataDemissao() { return this.#dataDemissao; } set dataDemissao(data) { this.#dataDemissao = data; }
    get ativo() { return this.#ativo; } set ativo(ativo) { this.#ativo = ativo; }
    get usuario() { return this.#usuario; } set usuario(usuario) { this.#usuario = usuario; }
    get senha() { return this.#senha; } set senha(senha) { this.#senha = senha; }
    get nome() { return this.#nome; } set nome(nome) { this.#nome = nome; }

    constructor(funcionarioId, matricula, dataAdmissao, dataDemissao, ativo, usuario, senha) {
        this.#funcionarioId = funcionarioId;
        this.#matricula = matricula;
        this.#dataAdmissao = dataAdmissao;
        this.#dataDemissao = dataDemissao;
        this.#ativo = ativo;
        this.#usuario = usuario;
        this.#senha = senha;
    }

   async listar() {
        let sql = `
            SELECT PF.ID_PESSOAFISICA, PF.NOME, F.MATRICULA, F.DT_ADMISSAO, F.DT_DEMISSAO, F.USUARIO, F.ATIVO
            FROM FUNCIONARIO F
            INNER JOIN PESSOA_FISICA PF ON F.PESSOA_FISICA_ID_PESSOAFISICA = PF.ID_PESSOAFISICA
            ORDER BY PF.NOME ASC
        `;

        let rows = await conexao.ExecutaComando(sql);
        let lista = [];

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                
                let funcionario = new FuncionarioModel(
                    row['ID_PESSOAFISICA'],      
                    row['MATRICULA'],            
                    row['DT_ADMISSAO'],         
                    row['DT_DEMISSAO'],          
                    row['ATIVO'],               
                    row['USUARIO'],              
                    null                         
                );
    
                funcionario.nome = row['NOME'];
                lista.push(funcionario);
            }
        }
        return lista;
    }

    async cadastrar(connection = null) {
        let demissaoFinal = (this.#dataDemissao && this.#dataDemissao !== "") ? this.#dataDemissao : null;
        let usuarioFinal = (this.#usuario && this.#usuario !== "") ? this.#usuario : null;
        let senhaFinal = (this.#senha && this.#senha !== "") ? this.#senha : null;

        let ativoFinal = (this.#ativo === true || this.#ativo === "true") ? 1 : 0;

        let sql = `INSERT INTO FUNCIONARIO (PESSOA_FISICA_ID_PESSOAFISICA, MATRICULA, DT_ADMISSAO, DT_DEMISSAO, ATIVO, USUARIO, SENHA) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        let valores = [this.#funcionarioId, this.#matricula, this.#dataAdmissao, demissaoFinal, ativoFinal, usuarioFinal, senhaFinal];

        return await conexao.ExecutaComandoNonQuery(sql, valores, connection);
    }

    async alterar(connection = null) {
        let demissaoFinal = (this.#dataDemissao && this.#dataDemissao !== "") ? this.#dataDemissao : null;
        let usuarioFinal = (this.#usuario && this.#usuario !== "") ? this.#usuario : null;
        let ativoFinal = (this.#ativo === true || this.#ativo === "true") ? 1 : 0;

        let sql = `UPDATE FUNCIONARIO SET DT_ADMISSAO = ?, DT_DEMISSAO = ?, ATIVO = ?, USUARIO = ?WHERE PESSOA_FISICA_ID_PESSOAFISICA = ?`;

        let valores = [this.#dataAdmissao, demissaoFinal, ativoFinal, usuarioFinal, this.#funcionarioId ];

        return await conexao.ExecutaComandoNonQuery(sql, valores, connection);
    }

    async alterarSenha() {
        let sql = `UPDATE FUNCIONARIO SET SENHA = ? WHERE PESSOA_FISICA_ID_PESSOAFISICA = ?`;
        let valores = [this.#senha, this.#funcionarioId];

        return await conexao.ExecutaComandoNonQuery(sql, valores);
    }
    
    async buscarPessoas(termo) {
        let sql = `SELECT ID_PESSOAFISICA, NOME, CPF FROM PESSOA_FISICA WHERE NOME LIKE ? LIMIT 10`;
        let valores = [`%${termo}%`];

        let rows = await conexao.ExecutaComando(sql, valores);
        return rows;
    }

   async validar(usuario, senha) {
        const sql = `SELECT * FROM FUNCIONARIO WHERE USUARIO = ? AND SENHA = ? AND ATIVO = 1`;
        const valores = [usuario, senha];
        const banco = new Database();

        const rows = await banco.ExecutaComando(sql, valores);

        if(rows.length > 0) {
            let row = rows[0];
            
            return new FuncionarioModel(
                row["PESSOA_FISICA_ID_PESSOAFISICA"], 
                row["MATRICULA"],                     
                row["DT_ADMISSAO"],                  
                null,                                
                row["ATIVO"],                         
                row["USUARIO"],                       
                row["SENHA"]                          
            );
        }
        return null;
    }

    async buscarPorId(id) {
        const sql = "SELECT * FROM FUNCIONARIO WHERE MATRICULA = ?";
        const valores = [id];

        const banco = new Database();
        const rows = await banco.ExecutaComando(sql, valores);

        if(rows.length > 0) {
            let row = rows[0];
    
            return new FuncionarioModel(
                row["PESSOA_FISICA_ID_PESSOAFISICA"], 
                row["MATRICULA"], 
                row["DT_ADMISSAO"], 
                null, 
                row["ATIVO"], 
                row["USUARIO"], 
                row["SENHA"]
            );
        }
        return null;
    }
}

module.exports = FuncionarioModel;