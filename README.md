# 🌱 SIGVA - Sistema de Gerenciamento de Vendas de Agronegócio (Projeto Semear)

Este repositório contém o projeto **SIGVA (Sistema de Gerenciamento de Vendas de Agronegócio)**, desenvolvido para a empresa fictícia "Semear".

Este é um projeto acadêmico 🎓 do **Projeto Integrado III**, referente ao 3º Termo do curso de **Análise e Desenvolvimento de Sistemas** da FIPP (Faculdade de Informática de Presidente Prudente).

🎯 **Objetivo:** Construir uma solução de software para o setor do agronegócio, simulando um sistema ecommerce com backoffice
---

## ✨ Funcionalidades Criadas

O sistema completo (SIGVA) foi projetado para gerenciar todas as operações da empresa, incluindo:

* 📝 **Gestão de Cadastros (CRUD):** Clientes, Fornecedores, Produtos, Insumos, Marcas, Serviços e Equipamentos Agrícolas.
* 🔧 **Ordens de Serviço:** Abertura, Fechamento de OS.
* 📊 **Relatórios:** Geração de relatórios gerenciais de produtos e ordens de serviço.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido com as seguintes tecnologias e padrões:

* **🖥️ Backend:** Node.js com Express
* **🎨 Frontend (View Engine):** EJS (Embedded JavaScript) e bootstrap 5
* **🗃️ Banco de Dados:** MySQL
* **🏛️ Arquitetura:** MVC (Model-View-Controller)
* **🧰 Ferramentas:** Git, GitHub e MySQL Workbench

---

## 🚀 Como Executar o Projeto

Link Vercel: https://sigva.vercel.app/

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local:

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/thiagomartinss/SIGVA.git
    ```

2.  **Navegue até a pasta do projeto**
    ```bash
    cd SIGVA
    ```

3.  **Instale as dependências**
    *(Verifique se você tem o Node.js instalado na sua máquina)*
    ```bash
    npm install
    ```

4.  **Banco de Dados (MySQL)**
    * ⚙️ Deve ter o banco de dados previamente configurado.
    * 🔑 Configure as credenciais de acesso ao banco (host, usuário, senha, banco de dados) no arquivo de configuração do projeto (ex: `/config/database.js` ou um arquivo `.env`).

5.  **Inicie o servidor**
    ```bash
    npm start
    ```

6.  **Acesse a aplicação**
    * 🖥️ Abra seu navegador e acesse `http://localhost:5000`.
