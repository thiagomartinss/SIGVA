const FuncionarioModel = require("../models/funcionarioModel");

class AuthMiddleware {

    async verificaLogin(req, res, next) {
        let funcionarioMatricula = req.cookies.usuarioLogado;
        //let funcionarioMatricula = req.session.usuarioLogado;
        
        if(funcionarioMatricula) {
            let funcionario = new FuncionarioModel();
            funcionario = await funcionario.buscarPorId(funcionarioMatricula);
        
            if(funcionario != null && funcionario.ativo == 1) {
                res.locals.funcionarioLogado = funcionario; 
                next(); 
            }
            else {
                res.clearCookie("usuarioLogado");
                res.redirect("/login");
            }
        }
        else {
            res.redirect("/login");
        }
    }
}

module.exports = AuthMiddleware;