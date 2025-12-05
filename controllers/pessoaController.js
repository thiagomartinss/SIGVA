const Database = require("../db/database");
const EnderecoModel = require("../models/enderecoModel");
const PessoaModel = require("../models/pessoaModel");
const PessoaFisicaModel = require("../models/pessoaFisicaModel");
const PessoaJuridicaModel = require("../models/pessoaJuridicaModel");

class PessoaController {
    async pessoaView(req, res) {
        let uf = new EnderecoModel();
        const listaUf = await uf.listarUf();

        let cidade = new EnderecoModel();
        const listaCidade = await cidade.listarCidade();

        let pessoa = new PessoaModel();
        const listaPessoa = await pessoa.listarPessoa();

        res.render('pessoa/pessoas', {
            listaUf: listaUf,
            listaCidade: listaCidade,
            listaPessoa: listaPessoa
        });
    }

    async buscar(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                res.send({ ok: false, msg: "ID inválido!" });
                return;
            }

            const pessoaModel = new PessoaModel();
            const pessoa = await pessoaModel.buscarPorId(id);

            if (pessoa) {
                res.send({ ok: true, pessoa: pessoa });
            } else {
                res.send({ ok: false, msg: "Pessoa não encontrada!" });
            }
        } catch (error) {
            console.error(error);
            res.send({ ok: false, msg: "Erro ao buscar pessoa." });
        }
    }

    async cadastrar(req, res) {
        let {
            tipoPessoa, email, telefone, cep, logradouro, numero, bairro, cidadeId, ufId,
            ehCliente, ehFornecedor,
            nome, cpf, dataNascimento,
            cnpj, razaoSocial, nomeFantasia
        } = req.body;

        if (!email || email.trim() === "" || !telefone || telefone.trim() === "" || !cep || cep.trim() === "" || !logradouro || logradouro.trim() === "" || !numero || numero.trim() === "" || !bairro || bairro.trim() === "" || !cidadeId || cidadeId === "" || !ufId || ufId === "") {
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

    async alterar(req, res) {
        let {
            id, tipoPessoa, email, telefone, cep, logradouro, numero, bairro, cidadeId, ufId,
            ehCliente, ehFornecedor,
            nome, cpf, dataNascimento,
            cnpj, razaoSocial, nomeFantasia
        } = req.body;

        if (!id || !email || !telefone || !cep || !logradouro || !numero || !bairro || !cidadeId || !ufId) {
            res.send({ ok: false, msg: "Preencha todos os campos obrigatórios!" });
            return;
        }
        if (req.body.ehFornecedor) {
            return res.send({ ok: false, msg: "Pessoa Física não pode ser Fornecedor!" });
        }

        const db = new Database();
        let connection;

        try {
            connection = await db.beginTransaction();

            let pessoaModel = new PessoaModel();
            let pessoaAtual = await pessoaModel.buscarPorId(id);

            if (!pessoaAtual)
                throw new Error("Pessoa não encontrada para alteração.");

            let idEndereco = pessoaAtual.idEndereco;

            let endereco = new EnderecoModel(cep, logradouro, numero, bairro, cidadeId, null, null, ufId);
            await endereco.atualizar(idEndereco, connection);

            let pessoa = new PessoaModel(id, email, telefone, ehCliente, ehFornecedor, idEndereco);
            await pessoa.atualizar(connection);

            if (tipoPessoa === 'PF') {
                let pf = new PessoaFisicaModel(id, nome, cpf, dataNascimento);
                await pf.atualizar(connection);
            } else {
                let pj = new PessoaJuridicaModel(id, cnpj, razaoSocial, nomeFantasia);
                await pj.atualizar(connection);
            }

            await db.commit(connection);
            res.send({ ok: true, msg: "Alteração realizada com sucesso!" });

        } catch (error) {
            if (connection) await db.rollback(connection);
            console.error(error);
            res.send({ ok: false, msg: "Erro ao alterar: " + error.message });
        }
    }

    async excluir(req, res) {
        let { id } = req.body;

        if (!id) {
            res.send({ ok: false, msg: "ID não informado!" });
            return;
        }

        const db = new Database();
        let connection;

        try {
            connection = await db.beginTransaction();

            let pessoaModel = new PessoaModel();
            let pessoaAtual = await pessoaModel.buscarPorId(id);

            if (!pessoaAtual) {
                throw new Error("Pessoa não encontrada.");
            }

            let pf = new PessoaFisicaModel();
            await pf.excluir(id, connection);

            let pj = new PessoaJuridicaModel();
            await pj.excluir(id, connection);

            await pessoaModel.excluir(id, connection);

            let endereco = new EnderecoModel();
            await endereco.excluir(pessoaAtual.idEndereco, connection);

            await db.commit(connection);
            res.send({ ok: true, msg: "Pessoa excluída com sucesso!" });

        } catch (error) {
            if (connection) await db.rollback(connection);
            console.error(error);
            res.send({ ok: false, msg: "Erro ao excluir: " + error.message });
        }
    }
    async buscarPorNome(req, res) {
        let nome = req.params.nome;

        let pessoa = new PessoaModel();
        let lista = await pessoa.listarClientesPorNome(nome);

        res.json({ pessoas: lista });
    }

}

module.exports = PessoaController;