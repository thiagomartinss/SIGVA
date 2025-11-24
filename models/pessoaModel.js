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

    async listarPessoa(){
        let sql = `
            SELECT 
                p.ID_PESSOA,
                p.EMAIL,
                p.TELEFONE,
                p.EH_CLIENTE,
                p.EH_FORNECEDOR,
                COALESCE(pf.NOME, pj.NOME_FANTASIA) AS NOME_COMPLETO,
                COALESCE(pf.CPF, pj.CNPJ) AS DOCUMENTO,
                CASE 
                    WHEN pf.ID_PESSOAFISICA IS NOT NULL THEN 'PF' 
                    ELSE 'PJ' 
                END AS TIPO
            FROM PESSOA p
            LEFT JOIN PESSOA_FISICA pf ON p.ID_PESSOA = pf.ID_PESSOAFISICA
            LEFT JOIN PESSOA_JURIDICA pj ON p.ID_PESSOA = pj.ID_PESSOAJURIDICA
            ORDER BY p.ID_PESSOA ASC
        `;
        
        let rows = await conexao.ExecutaComando(sql);
        
        let listaRetorno = [];

        if(rows.length > 0){
            for(let i=0; i < rows.length; i++){
                let row = rows[i];
                listaRetorno.push({
                    pessoaId: row['ID_PESSOA'],
                    email: row['EMAIL'],
                    telefone: this.telefoneMask(row['TELEFONE']),
                    ehCliente: row['EH_CLIENTE'],
                    ehFornecedor: row['EH_FORNECEDOR'],
                    nome: row['NOME_COMPLETO'], 
                    documento: this.docmask(row['DOCUMENTO']),
                    tipo: row['TIPO']
                });
            }
        }
        return listaRetorno;
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

    async buscarPorId(id) {
        let sql = `
            SELECT p.*, 
                   e.CEP, e.LOGRADOURO, e.NUMERO, e.BAIRRO, e.ID_CIDADE,
                   c.ID_UF,
                   pf.NOME, pf.CPF, pf.DT_NASCIMENTO,
                   pj.CNPJ, pj.RAZAO_SOCIAL, pj.NOME_FANTASIA,
                   CASE WHEN pf.ID_PESSOAFISICA IS NOT NULL THEN 'PF' ELSE 'PJ' END AS TIPO
            FROM PESSOA p
            INNER JOIN ENDERECO e ON p.ENDERECO_ID_ENDERECO = e.ID_ENDERECO
            INNER JOIN CIDADE c ON e.ID_CIDADE = c.ID_CIDADE
            LEFT JOIN PESSOA_FISICA pf ON p.ID_PESSOA = pf.ID_PESSOAFISICA
            LEFT JOIN PESSOA_JURIDICA pj ON p.ID_PESSOA = pj.ID_PESSOAJURIDICA
            WHERE p.ID_PESSOA = ?
        `;
        let rows = await conexao.ExecutaComando(sql, [id]);
        
        if(rows.length > 0) {
            let row = rows[0];
            
            return {
                pessoaId: row['ID_PESSOA'],
                idEndereco: row['ENDERECO_ID_ENDERECO'], 
                email: row['EMAIL'],
                telefone: row['TELEFONE'],
                ehCliente: row['EH_CLIENTE'],
                ehFornecedor: row['EH_FORNECEDOR'],
                tipo: row['TIPO'],
                cep: row['CEP'],
                logradouro: row['LOGRADOURO'],
                numero: row['NUMERO'],
                bairro: row['BAIRRO'],
                cidadeId: row['ID_CIDADE'],
                ufId: row['ID_UF'],
                nome: row['NOME'],
                cpf: row['CPF'],
                dataNascimento: row['DT_NASCIMENTO'],
                cnpj: row['CNPJ'],
                razaoSocial: row['RAZAO_SOCIAL'],
                nomeFantasia: row['NOME_FANTASIA']
            };
        }
        return null;
    }

    async atualizar(connection) {
        let sql = "UPDATE PESSOA SET EMAIL = ?, TELEFONE = ?, EH_CLIENTE = ?, EH_FORNECEDOR = ? WHERE ID_PESSOA = ?";
        let valores = [this.#email, this.#telefone, this.#ehCliente ? 1 : 0, this.#ehFornecedor ? 1 : 0, this.#pessoaId];
        return await conexao.ExecutaComandoNonQuery(sql, valores, connection);
    }

    async excluir(id, connection) {
        let sql = "DELETE FROM PESSOA WHERE ID_PESSOA = ?";
        return await conexao.ExecutaComandoNonQuery(sql, [id], connection);
    }

    //formatando cnpj, cpf e telefone direto no backend
     docmask(valor) {
        if (!valor) 
            return "";
        valor = valor.replace(/\D/g, "");

        if (valor.length === 11) 
            return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        else if (valor.length === 14) 
            return valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
        
        return valor;
    }

    telefoneMask(valor) {
        if (!valor) 
            return "";
        valor = valor.replace(/\D/g, "");

        if (valor.length === 11) 
            return valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    
        else if (valor.length === 10) 
            return valor.replace(/^(\d{2})(\d{4})(\d{4}).*/, "($1) $2-$3");
        return valor;
    }
}

module.exports = PessoaModel;