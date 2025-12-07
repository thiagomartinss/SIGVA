const FuncionarioModel = require("../models/funcionarioModel");

class FuncionarioController {
    async funcionarioView(req, res) {
       let funcionario = new FuncionarioModel();
        const lista = await funcionario.listar();

        res.render('funcionario/funcionarios', { lista: lista });
    }

    async cadastrar(req, res) {
        let { pessoaId, matricula, dtAdmissao, dtDemissao, usuario, senha, ativo } = req.body;

        matricula = matricula ? matricula.trim() : "";
        usuario = usuario ? usuario.trim().toUpperCase() : "";
        senha = senha ? senha.trim() : "";

        if (!pessoaId || !matricula || !dtAdmissao) 
            return res.json({ ok: false, msg: "Preencha os campos obrigatórios (Pessoa, Matrícula e Admissão)." });
        

        let dataAdm = new Date(dtAdmissao);
        let hoje = new Date();
        hoje.setHours(0,0,0,0);
        
        let dataAdmAj = new Date(dataAdm.getTime() + dataAdm.getTimezoneOffset() * 60000);

        if (dataAdmAj > hoje) 
            return res.json({ ok: false, msg: "A data de admissão não pode ser futura." });
        
        if (dtDemissao && dtDemissao !== "") {
            let dataDem = new Date(dtDemissao);
            if (dataDem < dataAdm) 
                return res.json({ ok: false, msg: "A data de demissão não pode ser anterior à admissão." });
            
        }


        if ((usuario !== "" && senha === "") || (usuario === "" && senha !== "")) 
            return res.json({ ok: false, msg: "Para criar um login, Usuário e Senha devem estar preenchidos." });
        
        try {
            let funcionario = new FuncionarioModel(
                pessoaId, 
                matricula, 
                dtAdmissao, 
                dtDemissao, 
                ativo, 
                usuario.toUpperCase(), 
                senha
            );

            await funcionario.cadastrar();

            res.json({ ok: true, msg: "Funcionário cadastrado com sucesso!" });

        } catch (error) {
            console.error(error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.json({ ok: false, msg: "Já existe um funcionário com essa Matrícula ou Usuário." });
            }
            res.json({ ok: false, msg: "Erro no banco de dados: " + error.message });
        }
    }

    async alterar(req, res) {
        let { pessoaId, dtAdmissao, dtDemissao, usuario, senha, ativo } = req.body;
        usuario = usuario ? usuario.trim().toUpperCase() : "";

        if (!pessoaId || !dtAdmissao) 
            return res.json({ ok: false, msg: "Preencha os dados obrigatórios." });
        
        let dataAdm = new Date(dtAdmissao);
        let hoje = new Date();
        hoje.setHours(0,0,0,0);
        
        let dataAdmAj = new Date(dataAdm.getTime() + dataAdm.getTimezoneOffset() * 60000);

        if (dataAdmAj > hoje) 
            return res.json({ ok: false, msg: "A data de admissão não pode ser futura." });
        
        if (dtDemissao && dtDemissao !== "") {
            let dataDem = new Date(dtDemissao);
            if (dataDem < dataAdm) 
                return res.json({ ok: false, msg: "A data de demissão não pode ser anterior à admissão." });
        }

        if ((usuario !== "" && senha === "") || (usuario === "" && senha !== "")) 
            return res.json({ ok: false, msg: "Para criar um login, Usuário e Senha devem estar preenchidos." });
        
        try {
            let funcionario = new FuncionarioModel(pessoaId, "", dtAdmissao, dtDemissao, ativo, usuario, senha);
            
            await funcionario.alterar();

            res.json({ ok: true, msg: "Funcionário alterado com sucesso!" });
        } catch (error) {
            console.error(error);
            res.json({ ok: false, msg: "Erro ao alterar: " + error.message });
        }
    }

    async alterarSenha(req, res) {
        let { pessoaId, senha } = req.body;

        if (!pessoaId || !senha) 
            return res.json({ ok: false, msg: "Dados inválidos." });
        
        try {
            let funcionario = new FuncionarioModel();
            funcionario.funcionarioId = pessoaId;
            funcionario.senha = senha.trim();

            await funcionario.alterarSenha();

            res.json({ ok: true, msg: "Senha alterada!" });
        } catch (error) {
            console.error(error);
            res.json({ ok: false, msg: "Erro ao alterar senha: " + error.message });
        }
    }

    async buscarPessoas(req, res) {
        try {
            let termo = req.body.termo;
            let model = new FuncionarioModel();
            let resultados = await model.buscarPessoas(termo);
            
            res.status(200).json({ ok: true, lista: resultados });
        } catch (error) {
            console.error(error);
            res.status(500).json({ ok: false, msg: "Erro ao buscar pessoas" });
        }
    }
}
module.exports = FuncionarioController;