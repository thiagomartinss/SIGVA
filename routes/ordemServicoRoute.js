const express= require("express");
const  OrdemServicoController=require("../controllers//ordemservicoController");
const router = express.Router();
const ordemservicoController=new OrdemServicoController();

router.get("/criar",ordemservicoController.ordemView);
router.post("/cadastrar", ordemservicoController.cadastrar);

module.exports=router;