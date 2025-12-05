class FuncionarioController {
    async funcionarioView(req, res) {
        res.render('funcionario/funcionarios');
    }
}
module.exports = FuncionarioController;