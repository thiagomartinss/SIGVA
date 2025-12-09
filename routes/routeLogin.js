const express = require("express");
const LoginController = require("../controllers/loginController");
const routeLogin = express.Router();
const loginCtrl = new LoginController();

routeLogin.get("/", loginCtrl.loginView);
routeLogin.post('/', loginCtrl.autenticar);
routeLogin.get('/logout', loginCtrl.logout);

module.exports = routeLogin;