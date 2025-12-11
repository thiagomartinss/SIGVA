const express= require("express");
const  OrdemServicoController=require("../controllers//ordemservicoController");
const router = express.Router();
const ordemservicoController=new OrdemServicoController();

router.get("/criar",ordemservicoController.ordemView);
router.post("/cadastrar", ordemservicoController.cadastrar);
router.get("/listar", ordemservicoController.listarView);
router.get("/buscar/:id", ordemservicoController.buscarDados);
router.post("/alterar", ordemservicoController.alterar);
router.post("/concluir", ordemservicoController.concluir);
router.post("/cancelar", ordemservicoController.cancelar);
router.get("/editar/:id", ordemservicoController.editarView);
module.exports=router;