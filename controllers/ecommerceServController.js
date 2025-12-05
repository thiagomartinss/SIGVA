const ServicoModel=require("../models/servicoModel");

class EcommerceServiceController{

    async ecommerceServView(req,res){
        let servico=new ServicoModel();
        let lista=await servico.listarServico();
        res.render("ecommerceService/ecommerceService",{lista:lista});
    }
}
module.exports=EcommerceServiceController;
