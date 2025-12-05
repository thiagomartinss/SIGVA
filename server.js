
const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
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
const path = require("path");

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

server.use(express.urlencoded({ extended: true })); //Configuração para as requisições POST (Submissão)
server.use(express.json()); //Configurar a possibilidade de fazer parse em uma string JSON

server.use("/", routerHome);
server.use("/login", routeLogin);
server.use("/contact", routeContact);
server.use("/about", routeAbout);
server.use("/register", routeRegister);
server.use("/admin", routeAdmin);
server.use("/marca", routeMarca);
server.use("/servico", routeServico);
server.use("/equipamento", routeEquipamento);
server.use("/produto", routeProduto);
server.use("/ordemServico", routeOrdemServico);
server.use("/pessoa", routerPessoa);
server.use("/funcionario", routerFuncionario);
server.use("/ecommerce", routerEcommerce);
server.use("/ecommerceService",routerEcommerceServ);

global.CAMINHO_IMG = "/img/produtos/";
global.CAMINHO_IMG_ABS = __dirname + "/public/img/produtos/";

server.listen(5000, function () {
    console.log("Aplicação iniciada!");
})