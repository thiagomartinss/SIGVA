const FuncionarioModel = require("../models/funcionarioModel");

class LoginController {

    loginView(req, res) {
        res.render('login');
    }

    async autenticar(req, res) {
        let usuario = req.body.usuario ? req.body.usuario.toUpperCase() : null;

        console.log("--- TENTATIVA DE LOGIN ---");
        console.log("Usuário Digitado (Upper):", usuario);
        console.log("Senha Digitada:", req.body.senha);

        if(usuario && req.body.senha) {
            let funcionario = new FuncionarioModel();
            funcionario = await funcionario.validar(usuario, req.body.senha);

            console.log("Resultado do Banco:", funcionario);

            if(funcionario != null) {
                console.log("LOGIN SUCESSO! Redirecionando para /admin");
                res.cookie("usuarioLogado", funcionario.matricula, { maxAge: 900000, httpOnly: true });
                res.redirect("/admin");
            }
            else {
                console.log("LOGIN FALHOU! Usuário não encontrado ou Inativo.");
                res.render('login', { msg: "Usuário, senha incorretos ou funcionário inativo!" });
            }
        }
        else {
            console.log("LOGIN FALHOU aqui! ");
            res.render('login', { msg: "Preencha todos os campos!" });
        }
    }
    
    logout(req, res) {
        res.clearCookie("usuarioLogado");
        res.redirect("/login");
    }
}

module.exports = LoginController;