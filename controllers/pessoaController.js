const Database = require("../db/database");
const EnderecoModel = require("../models/enderecoModel");
const PessoaModel = require("../models/pessoaModel");
const PessoaFisicaModel = require("../models/pessoaFisicaModel");
const PessoaJuridicaModel = require("../models/pessoaJuridicaModel");

class PessoaController{
    async pessoaView(req,res){
        let uf = new EnderecoModel();
        const listaUf = await uf.listarUf();

        let cidade = new EnderecoModel();
        const listaCidade = await cidade.listarCidade();

        res.render('pessoa/pessoas', {
            listaUf: listaUf,
            listaCidade: listaCidade
        });
    }

    async cadastrar(req, res){
        let {
            tipoPessoa, email, telefone, cep, logradouro, numero, bairro, cidadeId, ufId,
            ehCliente, ehFornecedor,
            nome, cpf, dataNascimento,
            cnpj, razaoSocial, nomeFantasia
        } = req.body;

        if (!email || email.trim() === "" || !telefone || telefone.trim() === "" || !cep || cep.trim() === "" || !logradouro || logradouro.trim() === "" || !numero || numero.trim() === "" || !bairro || bairro.trim() === "" || !cidadeId || cidadeId === "" || !ufId || ufId === "") 
        {
            res.send({ ok: false, msg: "Preencha todos os campos obrigatórios (Endereço e Contato)!" });
            return;
        }

        if (!ehCliente && !ehFornecedor) {
            res.send({ ok: false, msg: "Selecione pelo menos um tipo de perfil (Cliente ou Fornecedor)!" });
            return;
        }

        if (tipoPessoa === 'PF') {
            if (!nome || nome.trim() === "" || !cpf || cpf.trim() === "" || !dataNascimento || dataNascimento.trim() === "") {
                res.send({ ok: false, msg: "Preencha todos os dados da Pessoa Física!" });
                return;
            }
        } else if (tipoPessoa === 'PJ') {
            if (!cnpj || cnpj.trim() === "" || !razaoSocial || razaoSocial.trim() === "" || !nomeFantasia || nomeFantasia.trim() === "") {
                res.send({ ok: false, msg: "Preencha todos os dados da Pessoa Jurídica!" });
                return;
            }
        } 
        else {
            res.send({ ok: false, msg: "Tipo de pessoa inválido!" });
            return;
        }

        const db = new Database();
        let connection;

        try {
            
            connection = await db.beginTransaction();

            
            let endereco = new EnderecoModel(cep, logradouro, numero, bairro, cidadeId, null, null, ufId);
            let idEndereco = await endereco.cadastrar(connection); 

           
            let pessoa = new PessoaModel(0, email, telefone, ehCliente, ehFornecedor, idEndereco);
            let idPessoa = await pessoa.cadastrar(connection);

            
            let result = false;
            if (tipoPessoa === 'PF') {
                let pf = new PessoaFisicaModel(idPessoa, nome, cpf, dataNascimento);
                result = await pf.cadastrar(connection);
            } else {
                let pj = new PessoaJuridicaModel(idPessoa, cnpj, razaoSocial, nomeFantasia);
                result = await pj.cadastrar(connection);
            }

            await db.commit(connection);

            res.send({ ok: true, msg: "Cadastro realizado com sucesso!" });

        } catch (error) {
            if (connection) await db.rollback(connection);

            console.error(error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                res.send({ ok: false, msg: "Já existe um cadastro com este CPF, CNPJ ou E-mail." });
            } else {
                res.send({ ok: false, msg: "Erro ao realizar o cadastro: " + error.message });
            }
        }
    }
}

module.exports = PessoaController;