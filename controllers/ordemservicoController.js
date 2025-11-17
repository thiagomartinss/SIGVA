const EquipamentoModel=require("../models/equipamentoModel");
const ProdutoModel=require("../models/produtoModel");

class OrdemServicoController{
    async ordemView(req,res){
        let equipamento=new EquipamentoModel();
        let produto=new ProdutoModel();
        const listaEquipamentos= await equipamento.listarEquipamentosParaOrdem();
        const listaProdutos=await produto.listarProdutos();

        res.render('ordemServico/ordemServico',{listaEquipamentos:listaEquipamentos,listaProdutos:listaProdutos});
    }
}
module.exports=OrdemServicoController;