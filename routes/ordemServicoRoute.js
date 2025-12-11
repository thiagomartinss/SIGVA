const express= require("express");
const  OrdemServicoController=require("../controllers//ordemservicoController");
const router = express.Router();
const ordemservicoController=new OrdemServicoController();

router.get("/criar",ordemservicoController.ordemView);
router.post("/cadastrar", ordemservicoController.cadastrar);
router.get("/listar", ordemservicoController.listarView);
router.get("/buscar/:id", ordemservicoController.buscarDados);
router.post("/alterar", ordemservicoController.alterar);

module.exports=router;