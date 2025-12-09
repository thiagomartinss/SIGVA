
const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const server = express();

const routerHome = require("./routes/homeRoute");
const routeLogin = require('./routes/routeLogin');
const routeContact = require("./routes/contactRoute");
const routeAbout = require("./routes/aboutRoute");
const routeRegister = require("./routes/registerRoute");
const routeAdmin = require("./routes/adminRoute");
const routeMarca = require("./routes/marcaRoute");
const routeServico = require("./routes/servicoRoute");
const routeProduto = require("./routes/produtoRoute");
const routeEquipamento = require("./routes/equipamentoRoute");
const routeOrdemServico = require("./routes/ordemServicoRoute");
const routerPessoa = require("./routes/pessoaRoute");
const routerFuncionario = require("./routes/funcionarioRoute");
const routerEcommerce = require("./routes/ecommerceRoute");
const routerEcommerceServ=require("./routes/ecommerceServiceRoute");
const routerRelatorio=require("./routes/relatorioRoute");
const path = require("path");
const AuthMiddleware = require("./middlewares/authMiddleware"); 

/*
Os trechos abaixo informa qual é o caminho das views e da public para que seja realizado o deploy
const path = require("path");
path.join(process.cwd()
*/

server.set("view engine", 'ejs')
server.set('views', path.join(process.cwd(), './views'));
server.use(express.static(path.join(process.cwd(), './public'))); //Expor a pasta de estilização/script para o navegador

//Configuração arquivo de Layout
server.set('layout', './layout.ejs');
server.use(expressEjsLayouts);

server.use(express.urlencoded({ extended: true })); 
server.use(express.json());

server.use(express.urlencoded({ extended: true })); //Configuração para as requisições POST (Submissão)
server.use(express.json()); //Configurar a possibilidade de fazer parse em uma string JSON

server.use(cookieParser());

server.use("/", routerHome);
server.use("/login", routeLogin);
server.use("/ecommerce", routerEcommerce);
server.use("/ecommerceService",routerEcommerceServ);
server.use("/contact", routeContact);
server.use("/about", routeAbout);
server.use("/register", routeRegister);
server.use("/produto", routeProduto);
let auth = new AuthMiddleware();

server.use("/admin",auth.verificaLogin, routeAdmin);
server.use("/marca",auth.verificaLogin, routeMarca);
server.use("/servico",auth.verificaLogin, routeServico);
server.use("/equipamento",auth.verificaLogin, routeEquipamento);
server.use("/ordemServico",auth.verificaLogin, routeOrdemServico);
server.use("/pessoa",auth.verificaLogin, routerPessoa);
server.use("/funcionario",auth.verificaLogin, routerFuncionario);
server.use("/relatorio",auth.verificaLogin, routerRelatorio);


global.CAMINHO_IMG = "/img/produtos/";
global.CAMINHO_IMG_ABS = __dirname + "/public/img/produtos/";

server.listen(5000, function () {
    console.log("Aplicação iniciada!");
})