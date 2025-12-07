document.addEventListener("DOMContentLoaded", function(){
    const inputNome = document.getElementById("nome");
    const listaSugestoes = document.getElementById("listaSugestoes");
    const inputIdPessoa = document.getElementById("idPessoa");
    const modal = document.getElementById('modalFuncionario');

    const validarRegraCadastro = gerenciarStatusAtivo("dtDemissao", "ativo");
    const validarRegraAlteracao = gerenciarStatusAtivo("dtDemissaoAlt", "ativoAlt");

    modal.addEventListener('show.bs.modal', event => {
        limparFormulario();
        limparValidacao();
    });

    document.getElementById("btnCadastrar").addEventListener("click", cadastrar);
    document.getElementById("btnAlterar").addEventListener("click", alterar);

    document.getElementById("matricula").addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        this.style["border-color"] = "#ced4da";
    });

    document.getElementById("nome").addEventListener('input', function() {
        this.style["border-color"] = "#ced4da"; 
    });

    document.getElementById("dtAdmissao").addEventListener('input', function() {
        this.style["border-color"] = "#ced4da"; 
        document.getElementById("msg-dtAdm").innerText = "";
    });

    document.getElementById("dtDemissao").addEventListener('input', function() {
        this.style["border-color"] = "#ced4da"; 
        document.getElementById("msg-dtDem").innerText = "";
    });

    document.getElementById("usuario").addEventListener('input', function() {
        this.style["border-color"] = "#ced4da"; 
        document.getElementById("msg-usuario").innerText = "";
    });

    document.getElementById("senha").addEventListener('input', function() {
        this.style["border-color"] = "#ced4da"; 
        document.getElementById("msg-senha").innerText = "";
    });

    document.getElementById("novaSenha").addEventListener('input', function() {
        this.style["border-color"] = "#ced4da"; 
        document.getElementById("msg-senhaAlt").innerText = "";
    });

    inputNome.addEventListener("input", function() {
        const termo = this.value;

        if (termo.length < 3) {
            listaSugestoes.style.display = "none";
            return;
        }

        fetch('/funcionario/buscar-pessoa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ termo: termo })
        })
        .then(r => r.json())
        .then(data => {
            if(data.ok && data.lista.length > 0)
                mostrarSugestoes(data.lista);
            else 
                listaSugestoes.style.display = "none";
        })
        .catch(error => console.error("Erro na busca:", error));
    });

    
    function mostrarSugestoes(lista) {
        if(!listaSugestoes) return;
        
        listaSugestoes.innerHTML = "";
        
        lista.forEach(pessoa => {
            let item = document.createElement("li");
            item.className = "list-group-item list-group-item-action cursor-pointer";
            item.innerText = `${pessoa.NOME} (CPF: ${pessoa.CPF || 'N/I'})`;
            
            item.addEventListener("click", function() {
                inputNome.value = pessoa.NOME;           
                inputIdPessoa.value = pessoa.ID_PESSOAFISICA; 
                listaSugestoes.style.display = "none";   
                inputNome.style.borderColor = "#ced4da";
            });
            listaSugestoes.appendChild(item);
        });

        listaSugestoes.style.display = "block";
    }

    document.addEventListener("click", function(e) {
        if (e.target !== inputNome && e.target !== listaSugestoes) {
            listaSugestoes.style.display = "none";
        }
    });

    const modalAlt = document.getElementById('modalFuncionarioAlt');
    modalAlt.addEventListener('show.bs.modal', function (event) {
       
        let button = event.relatedTarget; 

        let id = button.getAttribute('data-id');
        let nome = button.getAttribute('data-nome');
        let matricula = button.getAttribute('data-matricula');
        let admissao = button.getAttribute('data-admissao');
        let demissao = button.getAttribute('data-demissao');
        let usuario = button.getAttribute('data-usuario');
        let ativo = button.getAttribute('data-ativo') == "1"; 

        document.getElementById("idPessoaAlt").value = id;
        document.getElementById("nomeAlt").value = nome;
        document.getElementById("matriculaAlt").value = matricula;
        document.getElementById("dtAdmissaoAlt").value = admissao;
        document.getElementById("dtDemissaoAlt").value = demissao; 
        document.getElementById("usuarioAlt").value = (usuario && usuario !== "null") ? usuario : ""; 
        document.getElementById("ativoAlt").checked = ativo;

        document.getElementById("nomeAlt").disabled = true;
        document.getElementById("matriculaAlt").disabled = true;

        if (usuario && usuario !== "null" && usuario !== "") 
            document.getElementById("usuarioAlt").disabled = true;
        else 
            document.getElementById("usuarioAlt").disabled = false; 
        
        document.getElementById("msg-funcionarioAlt").innerText = "";
        validarRegraAlteracao();
    });
    
    const modalSenha = document.getElementById('modalAltSenha');

    modalSenha.addEventListener('show.bs.modal', function (event) {
        let button = event.relatedTarget;
        let id = button.getAttribute('data-id');
        let usuario = button.getAttribute('data-usuario');

        document.getElementById("idFuncionarioSenha").value = id;
        document.getElementById("usuarioSenha").value = usuario ? usuario : "SEM USUÁRIO";
        document.getElementById("novaSenha").value = "";
        document.getElementById("msg-senhaAlt").innerText = "";
        limparValidacaoSenha();
    });

    document.getElementById("btnSalvarSenha").addEventListener("click", function() {
        let id = document.getElementById("idFuncionarioSenha").value;
        let novaSenha = document.getElementById("novaSenha").value;

        if(novaSenha.trim() === "") {
            document.getElementById("msg-senhaAlt").innerText = "A nova senha não pode ser vazia.";
            document.getElementById("novaSenha").style["border-color"] = "red";
            return;
        }

        let dados = {
            pessoaId: id,
            senha: novaSenha.trim()
        };

        fetch("/funcionario/alterarSenha", {
            method: 'POST',
            body: JSON.stringify(dados),
            headers: { "Content-Type": "application/json" }
        })
        .then(r => r.json())
        .then(r => {
            if(r.ok) {
                alert("Senha alterada com sucesso!");
                window.location.reload();
            } else {
                document.getElementById("msg-senhaAlt").innerText = r.msg;
            }
        });
    });

    function cadastrar(){
        limparValidacao();
        let idPessoa = document.querySelector("#idPessoa").value;
        let nome = document.querySelector("#nome").value;
        let matricula = document.querySelector("#matricula").value;
        let dtAdmissao = document.querySelector("#dtAdmissao").value;
        let dtDemissao = document.querySelector("#dtDemissao").value;
        let usuario = document.querySelector("#usuario").value;
        let senha = document.querySelector("#senha").value;
        let ativo = document.querySelector("#ativo").checked;
        let msgFuncionario = document.querySelector("#msg-funcionario");
        let msgUsuario = document.querySelector("#msg-usuario");
        let msgSenha = document.querySelector("#msg-senha");

        let listaErros = [];
        if(nome.trim() === "" || idPessoa === "")
            listaErros.push("nome");
        if(matricula.trim() === "")
            listaErros.push("matricula");
        if(dtAdmissao === "")
            listaErros.push("dtAdmissao");
        else if (!validarDtFutura(dtAdmissao)) 
            listaErros.push("dtAdmissao-futura");
        if (dtDemissao !== "" && !validarDemissao(dtAdmissao, dtDemissao))
            listaErros.push("dtDemissao-menor");
        if (usuario !== "" && senha === "")
            listaErros.push("inserirSenha");
        if (usuario === "" && senha !== "") 
            listaErros.push("inserirUsuario");
        
        if(listaErros.length == 0){
            let dados = {
                pessoaId: idPessoa,
                nome: nome.trim().toUpperCase(),
                matricula: matricula.trim(),
                dtAdmissao: dtAdmissao,
                dtDemissao: dtDemissao,
                usuario: usuario.toUpperCase(),
                senha: senha,
                ativo: ativo
            }
            console.log(dados);
            fetch("/funcionario/cadastrar", {
                method: 'POST',
                body: JSON.stringify(dados),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(r=> {
                return r.json();
            })
            .then(r => {
                if(r.ok) {
                    window.location.href="/funcionario";
                } else {
                    msgFuncionario.innerHTML = r.msg;
                }
            })
        }else{
            if(listaErros.includes("nome"))
                document.getElementById("nome").style["border-color"] = "red";
            if(listaErros.includes("matricula"))
                document.getElementById("matricula").style["border-color"] = "red";
            if(listaErros.includes("dtAdmissao"))
                document.getElementById("dtAdmissao").style["border-color"] = "red";
            
            let campoVazio = listaErros.includes("nome") || listaErros.includes("matricula") || listaErros.includes("dtAdmissao");

            if (campoVazio) 
                msgFuncionario.textContent = "Preencha os campos em vermelho!";

            if(listaErros.includes("dtAdmissao-futura")){
                document.getElementById("dtAdmissao").style["border-color"] = "red";
                document.getElementById("msg-dtAdm").innerText = "A data de admissão não pode ser futura.";
            }
            if(listaErros.includes("dtDemissao-menor")){
                document.getElementById("dtDemissao").style["border-color"] = "red";
                document.getElementById("msg-dtDem").innerText = "Data de demissão não pode ser menor que admissão.";
            }
            if(listaErros.includes("inserirSenha")){
                msgSenha.textContent = "Ao definir um usuário, a senha é obrigatória.";
                document.getElementById("senha").style["border-color"] = "red";
            }
            if(listaErros.includes("inserirUsuario")){
                msgUsuario.textContent = "Ao definir uma senha, o usuário é obrigatório.";
                document.getElementById("usuario").style["border-color"] = "red";
            }
        }
    }

    function alterar() {
        let id = document.getElementById("idPessoaAlt").value;
        let dtAdmissao = document.getElementById("dtAdmissaoAlt").value;
        let dtDemissao = document.getElementById("dtDemissaoAlt").value;
        let usuario = document.getElementById("usuarioAlt").value;
        let ativo = document.getElementById("ativoAlt").checked;

        let listaErros = [];
        
        if(dtAdmissao === "") listaErros.push("dtAdmissaoAlt");
        else if (!validarDtFutura(dtAdmissao)) listaErros.push("dtAdmissaoAlt-futura");

        if (dtDemissao !== "" && !validarDemissao(dtAdmissao, dtDemissao))
            listaErros.push("dtDemissaoAlt-menor");

        if ((usuario !== "" && senha === "") || (usuario === "" && senha !== "")) {
             listaErros.push("loginIncompleto");
        }

        if(listaErros.length === 0) {
            let dados = {
                pessoaId: id,
                dtAdmissao: dtAdmissao,
                dtDemissao: dtDemissao,
                usuario: usuario.toUpperCase(),
                ativo: ativo
            };

            fetch("/funcionario/alterar", {
                method: 'POST', 
                body: JSON.stringify(dados),
                headers: { "Content-Type": "application/json" }
            })
            .then(r => r.json())
            .then(r => {
                if(r.ok) {
                    window.location.reload(); 
                } else {
                    document.getElementById("msg-funcionarioAlt").innerText = r.msg;
                }
            });
        } else {
            document.getElementById("msg-funcionarioAlt").innerText = "Verifique os campos em vermelho.";
            if(listaErros.includes("dtAdmissaoAlt")) 
                document.getElementById("dtAdmissaoAlt").style.borderColor = "red";
        }
    }

    function validarDemissao(admissao, demissao) {
        if (!demissao || !admissao) 
            return true;

        const dtAdm = new Date(admissao);
        const dtDem = new Date(demissao);

        if (dtDem < dtAdm) 
            return false; 
        
        return true;
    }

    function validarDtFutura(admissao) {
        if (!admissao) 
            return true;

        const dtAdm = new Date(admissao);
        
        const dtAtual = new Date();
        dtAtual.setHours(0, 0, 0, 0); 

        const dtAdmAjustada = new Date(dtAdm.getTime() + dtAdm.getTimezoneOffset() * 60000);

        if (dtAdmAjustada > dtAtual) 
            return false;
        
        return true;
    }

    function gerenciarStatusAtivo(idCampoData, idCampoCheckbox) {
        const inputData = document.getElementById(idCampoData);
        const checkAtivo = document.getElementById(idCampoCheckbox);

        const aplicarRegra = () => {
            if (inputData.value) {
                checkAtivo.checked = false; 
                checkAtivo.disabled = true;
            } else {
                checkAtivo.disabled = false; 
            }
        };

        inputData.addEventListener("input", aplicarRegra);
        inputData.addEventListener("change", aplicarRegra); 

        return aplicarRegra;
    }

    function limparValidacao() {
        document.getElementById("nome").style["border-color"] = "#ced4da";
        document.getElementById("matricula").style["border-color"] = "#ced4da";
        document.getElementById("dtAdmissao").style["border-color"] = "#ced4da";
        document.getElementById("dtDemissao").style["border-color"] = "#ced4da";
        document.getElementById("usuario").style["border-color"] = "#ced4da";
        document.getElementById("senha").style["border-color"] = "#ced4da";
        document.getElementById("msg-funcionario").innerText = "";
        document.getElementById("msg-dtAdm").innerText = "";
        document.getElementById("msg-dtDem").innerText = "";
        document.getElementById("msg-usuario").innerText = "";
        document.getElementById("msg-senha").innerText = "";
    }

    function limparFormulario(){
        let inputs = document.querySelectorAll("input");
        inputs.forEach(input => {
            if (input.type === "checkbox") 
                input.checked = false;
            else 
                input.value = "";
        });
    }

    function limparValidacaoSenha() {
        document.getElementById("novaSenha").style["border-color"] = "#ced4da";
        document.getElementById("msg-senhaAlt").innerText = "";
        document.getElementById("novaSenha").value = "";
    }
})