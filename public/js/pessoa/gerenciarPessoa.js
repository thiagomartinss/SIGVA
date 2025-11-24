document.addEventListener("DOMContentLoaded", function(){
    let checkPj = document.querySelector("#checkedPJ");
    let checkPf = document.querySelector("#checkedPF");
    let checkCliente = document.querySelector("#checkCliente");
    let checkFornecedor = document.querySelector("#checkFornecedor");

    let lbPF = document.querySelector("#lb-checkedPF");
    let lbPJ = document.querySelector("#lb-checkedPJ");
    let lbPerfil = document.querySelector("#lbPerfil");

    let msgCheckPessoa = document.querySelector("#msg-checkPessoa");
    let msgNome = document.querySelector("#msg-nome");
    let msgCpf = document.querySelector("#msg-cpf");
    let msgDtNascimento = document.querySelector("#msg-dtnascimento");
    let msgCnpj = document.querySelector("#msg-cnpj");
    let msgRazao = document.querySelector("#msg-razao");
    let msgFantasia = document.querySelector("#msg-fantasia");
    let msgTelefone = document.querySelector("#msg-telefone");
    let msgEmail = document.querySelector("#msg-email");
    let msgCep = document.querySelector("#msg-cep");
    let msgLogradouro = document.querySelector("#msg-logradouro");
    let msgNumero = document.querySelector("#msg-numero");
    let msgBairro = document.querySelector("#msg-bairro");
    let msgCidade = document.querySelector("#msg-cidade");
    let msgUf = document.querySelector("#msg-uf");
    let msgPerfil = document.querySelector("#msg-perfil");
    let msgPessoa = document.querySelector("#msg-pessoa");
    let msgPessoaAlt = document.querySelector("#msg-pessoaAlt");

    const inputNome = document.querySelector("#nome");
    const inputCpf = document.querySelector("#cpf");
    const inputDtNascimento = document.querySelector("#dtNascimento");
    const inputCnpj = document.querySelector("#cnpj");
    const inputRazao = document.querySelector("#razaoSocial");
    const inputFantasia = document.querySelector("#nomeFantasia");
    const inputTelefone = document.querySelector("#telefone");
    const inputEmail = document.querySelector("#email");
    const inputCep = document.querySelector("#cep");
    const inputLogradouro = document.querySelector("#logradouro");
    const inputNumero = document.querySelector("#numero");
    const inputBairro = document.querySelector("#bairro");
    
    const camposPf = document.getElementById("camposPF");
    const camposPj = document.getElementById("camposPJ");

    const selectCidade = document.querySelector("#cidade");
    const selectUf = document.querySelector("#uf");

    const inputCepAlt = document.querySelector("#cepAlt");
    const inputTelefoneAlt = document.querySelector("#telefoneAlt")

    const btnCadastrar = document.querySelector("#btnCadastrar");
    const btnAlterar = document.querySelector("#btnAlterar");
    const btnExcluir = document.querySelector("#btnConfirmarExclusao");

    inputCpf.addEventListener('input', function() {
        inputCpf.style.borderColor = "#ced4da"; 
        msgCpf.innerText = "";
        let value = inputCpf.value;

        value = value.replace(/\D/g, ""); 

        if (value.length > 11) 
            value = value.slice(0, 11); 

        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        inputCpf.value = value;
    });

    inputDtNascimento.addEventListener('change', function() {
        inputDtNascimento.style["border-color"] = "#ced4da"; 
        msgDtNascimento.innerText = ""; 
    });

    inputNome.addEventListener('change', function() {
        inputNome.style["border-color"] = "#ced4da"; 
        msgNome.innerText = ""; 
    });

    inputCnpj.addEventListener('input', function() {
        inputCnpj.style["border-color"] = "#ced4da";
        msgCnpj.innerText = "";
        
        let value = inputCnpj.value;
        value = value.replace(/\D/g, ""); 

        if (value.length > 14) value = value.slice(0, 14); 

        value = value.replace(/^(\d{2})(\d)/, "$1.$2");
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
        value = value.replace(/(\d{4})(\d)/, "$1-$2");
        
        inputCnpj.value = value;
    });

    inputRazao.addEventListener('change', function() {
        inputRazao.style.borderColor = "#ced4da";
        msgRazao.innerText = "";
    });

    inputFantasia.addEventListener('change', function() {
        inputFantasia.style.borderColor = "#ced4da";
        msgFantasia.innerText = ""; 
    });

    inputTelefone.addEventListener('input', function() {
    
        inputTelefone.style.borderColor = "#ced4da";
        msgTelefone.innerText = "";
        
        let value = inputTelefone.value.replace(/\D/g, ""); 
        
        if (value.length > 11) value = value.slice(0, 11); 

        if (value.length > 10) {
            value = value.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
        } else if (value.length > 5) {
            value = value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        } else if (value.length > 2) {
            value = value.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
        }
        
        inputTelefone.value = value;
    });

    inputEmail.addEventListener('input', function() {
        inputEmail.style.borderColor = "#ced4da";
        msgEmail.innerText = "";
    });

    inputCep.addEventListener('input', function() {
        inputCep.style.borderColor = "#ced4da"; 
        let value = inputCep.value;

        value = value.replace(/\D/g, ""); 
        
        if (value.length > 8) {
            value = value.slice(0, 8);
        }

        value = value.replace(/^(\d{5})(\d)/, "$1-$2");

        inputCep.value = value;
    });

    inputNumero.addEventListener('input', function(){
        inputNumero.style["border-color"] = "#ced4da";
        msgNumero.innerText = "";
    });

     // --- INTEGRAÇÃO VIA CEP ---
    inputCep.addEventListener('blur', function() {
        inputCep.style.borderColor = "#ced4da"; 
        msgCep.innerText = "";

        let cep = inputCep.value.replace(/\D/g, '');

        if (cep.length !== 8) {
            return; // CEP invalido ou incompleto
        }

        inputLogradouro.value = "Pesquisando...";
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    msgCep.innerText = "CEP não encontrado!";
                    limparCamposEndereco();
                    return;
                }

                inputLogradouro.value = data.logradouro;
                inputBairro.value = data.bairro;

                selecionarOpcaoPorTexto(selectUf, data.uf);
                selecionarOpcaoPorTexto(selectCidade, data.localidade);

                inputLogradouro.style.borderColor = "#ced4da";
                msgLogradouro.innerText = "";

                inputBairro.style.borderColor = "#ced4da";
                msgBairro.innerText = "";

                selectCidade.style.borderColor = "#ced4da";
                msgCidade.innerText = "";

                selectUf.style.borderColor = "#ced4da";
                msgUf.innerText = "";

                document.querySelector("#numero").focus();
            })
            .catch(error => {
                msgCep.innerText = "Erro ao buscar CEP";
                limparCamposEndereco();
            });
    });

    if(inputCepAlt){
        inputCepAlt.addEventListener('blur', function() {
            let cep = inputCepAlt.value.replace(/\D/g, '');

            if (cep.length !== 8) {
                return; 
            }
            let logradouroAlt = document.getElementById("logradouroAlt");
            let bairroAlt = document.getElementById("bairroAlt");
            let cidadeAlt = document.getElementById("cidadeAlt");
            let ufAlt = document.getElementById("ufAlt");
            let numeroAlt = document.getElementById("numeroAlt");

            logradouroAlt.value = "Pesquisando...";

            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (data.erro) {
                        alert("CEP não encontrado!");
                        logradouroAlt.value = "";
                        bairroAlt.value = "";
                        return;
                    }

                    logradouroAlt.value = data.logradouro;
                    bairroAlt.value = data.bairro;

                    selecionarOpcaoPorTexto(ufAlt, data.uf);
                    selecionarOpcaoPorTexto(cidadeAlt, data.localidade);

 
                    if(numeroAlt) numeroAlt.focus();
                })
                .catch(error => {
                    console.error(error);
                    logradouroAlt.value = "";
                    alert("Erro ao buscar CEP");
                });
        });
    }

    if(inputTelefoneAlt){
        inputTelefoneAlt.addEventListener('input', function() {
            inputTelefoneAlt.style.borderColor = "#ced4da";
            let value = inputTelefoneAlt.value.replace(/\D/g, ""); 
            
            if (value.length > 11) value = value.slice(0, 11); 

            if (value.length > 10) {
                value = value.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
            } else if (value.length > 5) {
                value = value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
            } else if (value.length > 2) {
                value = value.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
            }
            inputTelefoneAlt.value = value;
        });
    }

    if(inputCepAlt){
        inputCepAlt.addEventListener('input', function() {
            inputCepAlt.style.borderColor = "#ced4da"; 
            let value = inputCepAlt.value.replace(/\D/g, ""); 
            if (value.length > 8) value = value.slice(0, 8);
            value = value.replace(/^(\d{5})(\d)/, "$1-$2");
            inputCepAlt.value = value;
        });
    }

    const modal = document.getElementById('modalPessoa')
    modal.addEventListener('show.bs.modal', event => {
        limparFormulario();
    });

    const modalAlt = document.getElementById('modalPessoaAlt');
    modalAlt.addEventListener('show.bs.modal', event => {
        limparValidacaoAlt(); 
    });

    const modalDel = document.getElementById('modalPessoaDel');
    modalDel.addEventListener('show.bs.modal', event => {
        const msgExc = document.getElementById("msg-pessoaExc");
        if(msgExc) msgExc.innerText = "";
    });

    const botoesAlteracao = document.querySelectorAll(".btnAlteracao");
    botoesAlteracao.forEach(function(botao){
        botao.addEventListener("click", function(){
            const id = this.getAttribute("data-id");

            fetch(`/pessoa/buscar/${id}`)
            .then(response => response.json())
            .then(data => {
                if(data.ok && data.pessoa){
                    let p = data.pessoa;
                    let isCliente = (p.ehCliente == 1 || p.ehCliente == "1" || p.ehCliente === true);
                    let isFornecedor = (p.ehFornecedor == 1 || p.ehFornecedor == "1" || p.ehFornecedor === true);
                    console.log(p, isCliente, isFornecedor);
                    document.getElementById("idPessoaAlt").value = p.pessoaId;
                    document.getElementById("tipoPessoaAlt").value = p.tipo;
                    document.getElementById("emailAlt").value = p.email;

                    let tel = p.telefone.replace(/\D/g, "");
                    if(tel.length === 11) 
                        tel = tel.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
                    else if(tel.length === 10) 
                        tel = tel.replace(/^(\d{2})(\d{4})(\d{4}).*/, "($1) $2-$3");
                    
                    document.getElementById("telefoneAlt").value = tel; 

                    let cepFormatado = p.cep.replace(/\D/g, "");
                    if(cepFormatado.length === 8) {
                        cepFormatado = cepFormatado.replace(/^(\d{5})(\d)/, "$1-$2");
                    }
                    document.getElementById("cepAlt").value = cepFormatado;

                    document.getElementById("logradouroAlt").value = p.logradouro;
                    document.getElementById("numeroAlt").value = p.numero;
                    document.getElementById("bairroAlt").value = p.bairro;
                    document.getElementById("cidadeAlt").value = p.cidadeId;
                    document.getElementById("ufAlt").value = p.ufId;

                    document.getElementById("checkClienteAlt").checked = isCliente;
                    document.getElementById("checkFornecedorAlt").checked = isFornecedor;

                    if(p.tipo === 'PF'){
                        document.getElementById("camposPFAlt").style.display = "block";
                        document.getElementById("camposPJAlt").style.display = "none";
                        document.getElementById("nomeAlt").value = p.nome;
                        let chkFornecedorAlt = document.getElementById("checkFornecedorAlt");
                        chkFornecedorAlt.checked = false;
                        chkFornecedorAlt.disabled = true;
                        let cpfFormatado = p.cpf.replace(/\D/g, ""); 
                        cpfFormatado = cpfFormatado.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                        document.getElementById("cpfAlt").value = cpfFormatado;

                        if(p.dataNascimento) {
                            let dataFormatada = new Date(p.dataNascimento).toISOString().split('T')[0];
                            document.getElementById("dtNascimentoAlt").value = dataFormatada;
                        }
                    } else {
                        document.getElementById("camposPFAlt").style.display = "none";
                        document.getElementById("camposPJAlt").style.display = "block";
                        document.getElementById("checkFornecedorAlt").disabled = false;
                        let cnpjFormatado = p.cnpj.replace(/\D/g,""); 
                        cnpjFormatado = cnpjFormatado.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
                        document.getElementById("cnpjAlt").value = cnpjFormatado; 

                        document.getElementById("razaoSocialAlt").value = p.razaoSocial;
                        document.getElementById("nomeFantasiaAlt").value = p.nomeFantasia;
                    }

                     var modalAlt2 = new bootstrap.Modal(document.getElementById('modalPessoaAlt'));
                     modalAlt2.show();
                } else {
                    alert(data.msg || "Erro ao buscar dados.");
                }
            })
        });
    });

    const botoesExclusao = document.querySelectorAll(".btnExclusao");
    botoesExclusao.forEach(function(botao){
        botao.addEventListener("click", function(){
            const id = this.getAttribute("data-id");
            const nome = this.getAttribute("data-nome");

            document.getElementById("nomeExclusao").innerText = nome;
            document.getElementById("idPessoaExcluir").value = id;
            
            var modalDel = new bootstrap.Modal(document.getElementById('modalPessoaDel'));
            modalDel.show();
        });
    });

    btnCadastrar.addEventListener("click", cadastrar);
    btnAlterar.addEventListener("click", alterar);
    btnExcluir.addEventListener("click", excluir);

    checkPf.addEventListener("change", function() {
        if (checkPf.checked) {
            camposPf.style.display = "block";
            camposPj.style.display = "none";
            checkPj.checked = false;
            limparValidacao();
            checkFornecedor.disabled = true; 
            checkFornecedor.checked = false;

            inputCnpj.value = "";
            inputRazao.value = "";
            inputFantasia.value = "";
        } else {
            camposPf.style.display = "none";
        }
    });

    checkPj.addEventListener("change", function() {
        if (checkPj.checked) {
            camposPj.style.display = "block";
            camposPf.style.display = "none";
            checkPf.checked = false; 
            limparValidacao();
            checkFornecedor.disabled = false;
            inputNome.value = "";
            inputCpf.value = "";
            inputDtNascimento.value = "";
        } else {
            camposPj.style.display = "none";
        }
    });

    checkCliente.addEventListener("change", function(){
        if(checkCliente.checked){
            msgPerfil.innerText = "";
            lbPerfil.style.color = "";
        }
    });

    checkFornecedor.addEventListener("change", function(){
        if(checkFornecedor.checked){
            msgPerfil.innerText = "";
            lbPerfil.style.color = "";
        }
    })

    function cadastrar(){
        limparValidacao();

        let dados = validaCampos();

        if(dados){
            console.log(dados);
            fetch("/pessoa/cadastrar", {
                method: 'POST',
                body: JSON.stringify(dados),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(r => r.json())
            .then(r => {
                if(r.ok) {
                    console.log("Cadastrado com sucesso!");
                    window.location.href="/pessoa";
                } else {
                    msgPessoa.innerHTML = r.msg;
                }
            });
        }
    }

    function alterar(){
        limparValidacaoAlt();

        let id = document.getElementById("idPessoaAlt").value;
        let tipo = document.getElementById("tipoPessoaAlt").value; 
        let elNome = document.getElementById("nomeAlt");
        let elDtNasc = document.getElementById("dtNascimentoAlt");
        let elRazao = document.getElementById("razaoSocialAlt");
        let elFantasia = document.getElementById("nomeFantasiaAlt");
        let elEmail = document.getElementById("emailAlt");
        let elTelefone = document.getElementById("telefoneAlt");
        let elCep = document.getElementById("cepAlt");
        let elLogradouro = document.getElementById("logradouroAlt");
        let elNumero = document.getElementById("numeroAlt");
        let elBairro = document.getElementById("bairroAlt");
        let elCidade = document.getElementById("cidadeAlt");
        let elUf = document.getElementById("ufAlt");
        let elCheckCliente = document.getElementById("checkClienteAlt");
        let elCheckFornecedor = document.getElementById("checkFornecedorAlt");
        let email = elEmail.value.trim();
        let telefone = elTelefone.value.replace(/\D/g, "");
        let cep = elCep.value.replace(/\D/g, "");
        let logradouro = elLogradouro.value;
        let numero = elNumero.value;
        let bairro = elBairro.value;
        let cidadeId = elCidade.value;
        let ufId = elUf.value;
        let ehCliente = elCheckCliente.checked;
        let ehFornecedor = elCheckFornecedor.checked;
        let listaErros = [];

        if(tipo === 'PF'){
            let nome = elNome.value.toUpperCase().trim();
            let dataNasc = elDtNasc.value;

            if(nome == "") {
                listaErros.push("nomeAlt");
                document.getElementById("msg-nomeAlt").innerText = "Nome é obrigatório";
                elNome.style.borderColor = "red";
            } else if (nome.split(" ").filter(p => p !== "").length < 2) {
                listaErros.push("nomeAlt");
                document.getElementById("msg-nomeAlt").innerText = "Digite o nome completo";
                elNome.style.borderColor = "red";
            }

            if(dataNasc == "") {
                listaErros.push("dtNascimentoAlt");
                document.getElementById("msg-dtNascimentoAlt").innerText = "Data obrigatória";
                elDtNasc.style.borderColor = "red";
            } else {
                let erroData = validarDataNascimento(dataNasc); // Reutiliza sua função
                if(erroData != "") {
                    listaErros.push("dtNascimentoAlt");
                    document.getElementById("msg-dtNascimentoAlt").innerText = erroData;
                    elDtNasc.style.borderColor = "red";
                }
            }
        } 
        else {
            let razao = elRazao.value.toUpperCase().trim();
            let fantasia = elFantasia.value.toUpperCase().trim();

            if(razao == "") {
                listaErros.push("razaoAlt");
                document.getElementById("msg-razaoAlt").innerText = "Razão Social obrigatória";
                elRazao.style.borderColor = "red";
            }
            if(fantasia == "") {
                listaErros.push("fantasiaAlt");
                document.getElementById("msg-fantasiaAlt").innerText = "Nome Fantasia obrigatório";
                elFantasia.style.borderColor = "red";
            }
        }

        if(email == "") {
            listaErros.push("emailAlt");
            document.getElementById("msg-emailAlt").innerText = "Email obrigatório";
            elEmail.style.borderColor = "red";
        } else if (!validarEmail(email)) { 
            listaErros.push("emailAlt");
            document.getElementById("msg-emailAlt").innerText = "Email inválido";
            elEmail.style.borderColor = "red";
        }
        if(telefone == "") {
            listaErros.push("telefoneAlt");
            document.getElementById("msg-telefoneAlt").innerText = "Celular obrigatório";
            elTelefone.style.borderColor = "red";
        } else if (!validarTelefone(elTelefone.value)) { 
             listaErros.push("telefoneAlt");
             document.getElementById("msg-telefoneAlt").innerText = "Telefone inválido";
             elTelefone.style.borderColor = "red";
        }

        if(cep == "") {
            listaErros.push("cepAlt");
            document.getElementById("msg-cepAlt").innerText = "CEP obrigatório";
            elCep.style.borderColor = "red";
        }
        if(logradouro.trim() == "") {
            listaErros.push("logradouroAlt");
            document.getElementById("msg-logradouroAlt").innerText = "Logradouro obrigatório";
            elLogradouro.style.borderColor = "red";
        }
        if(numero.trim() == "") {
            listaErros.push("numeroAlt");
            document.getElementById("msg-numeroAlt").innerText = "Número obrigatório";
            elNumero.style.borderColor = "red";
        }
        if(bairro.trim() == "") {
            listaErros.push("bairroAlt");
            document.getElementById("msg-bairroAlt").innerText = "Bairro obrigatório";
            elBairro.style.borderColor = "red";
        }
        if(cidadeId == "" || cidadeId == null) {
            listaErros.push("cidadeAlt");
            document.getElementById("msg-cidadeAlt").innerText = "Selecione a cidade";
            elCidade.style.borderColor = "red";
        }
        if(ufId == "" || ufId == null) {
            listaErros.push("ufAlt");
            document.getElementById("msg-ufAlt").innerText = "Selecione o estado";
            elUf.style.borderColor = "red";
        }

        if(!ehCliente && !ehFornecedor){
            listaErros.push("perfilAlt");
            document.getElementById("msg-pessoaAlt").innerText = "Selecione pelo menos um perfil (Cliente ou Fornecedor)";
        }

        if(listaErros.length > 0) {
            return; 
        }

        let dados = {
            id: id,
            tipoPessoa: tipo,
            email: email,
            telefone: telefone,
            cep: cep,
            logradouro: logradouro,
            numero: numero,
            bairro: bairro,
            cidadeId: cidadeId,
            ufId: ufId,
            ehCliente: ehCliente,
            ehFornecedor: ehFornecedor
        };

        if(tipo === 'PF'){
            dados.nome = elNome.value.toUpperCase();
            dados.dataNascimento = elDtNasc.value;
        } else {
            dados.razaoSocial = elRazao.value.toUpperCase();
            dados.nomeFantasia = elFantasia.value.toUpperCase();
        }

        fetch("/pessoa/alterar", {
            method: 'POST',
            body: JSON.stringify(dados),
            headers: { "Content-Type": "application/json" }
        })
        .then(r => r.json())
        .then(r => {
            if(r.ok) {
                window.location.reload();
            } else {
                document.getElementById("msg-pessoaAlt").innerText = r.msg;
            }
        });
    }

    function excluir() {
        const id = document.getElementById("idPessoaExcluir").value;
        if(id) {
            fetch('/pessoa/excluir', {
                method: 'POST',
                body: JSON.stringify({ id: id }),
                headers: { "Content-Type": "application/json" }
            })
            .then(r => r.json())
            .then(r => {
                if(r.ok) {
                    window.location.reload();
                } else {
                    alert(r.msg);
                }
            });
        }
    }

    function validaCampos(){
        let nome = inputNome.value.toUpperCase().trim();
        let cpf = inputCpf.value;
        let dataNasc = inputDtNascimento.value;
        let erroData = validarDataNascimento(dataNasc);

        let cnpj = inputCnpj.value;
        let razao = inputRazao.value.toUpperCase().trim();
        let fantasia = inputFantasia.value.toUpperCase().trim();

        let telefone = inputTelefone.value;
        let email = inputEmail.value.trim();
        let cep = inputCep.value;
        let logradouro = inputLogradouro.value;
        let numero = inputNumero.value;
        let bairro = inputBairro.value;
        let cidade = selectCidade.value;
        let uf = selectUf.value;
        let listaErros = [];

        if (!checkPf.checked && !checkPj.checked)
            listaErros.push("tipoPessoa");

        if(checkPf.checked){
             if(nome.trim() == "")
                listaErros.push("nomeVazio");
            else if (nome.trim().split(" ").filter(parte => parte !== "").length < 2) 
                listaErros.push("nomeIncompleto");
            
            if(cpf.trim() == "")
                listaErros.push("cpfVazio");
            if(cpf.trim() != "" && !validarCPF(cpf))
                listaErros.push("cpfInvalido");
            
            if(dataNasc == "")
                listaErros.push("dataNascVazio");
            if(dataNasc != "" && erroData != "") {
                listaErros.push("dataInvalida");
                msgDtNascimento.dataset.erro = erroData; 
            }
        }
        if(checkPj.checked){
            if(cnpj.trim() == "") 
                listaErros.push("cnpjVazio");
            if(cnpj.trim() != "" && !validarCNPJ(cnpj)) 
                listaErros.push("cnpjInvalido");

            if(razao == "") 
                listaErros.push("razaoVazio");
            else if(razao.split(" ").filter(p => p !== "").length < 2) 
                listaErros.push("razaoIncompleta");

            if(fantasia == "") 
                listaErros.push("fantasiaVazio");
            else if(fantasia.split(" ").filter(p => p !== "").length < 2) 
                listaErros.push("fantasiaIncompleta");
        }
        if(email.trim() == "")
            listaErros.push("emailVazio");
        else if (email != "" && !validarEmail(email))
            listaErros.push("emailInválido");
        
        if(telefone.trim() == "")
            listaErros.push("telefoneVazio");
        else if (telefone != "" && !validarTelefone(telefone))
                listaErros.push("telefoInvalido");
        
        if(cep.trim() == "")
            listaErros.push("cepVazio");
        
        if(logradouro.trim() == "")
            listaErros.push("logradouroVazio");

        if(numero.trim() == "")
            listaErros.push("numeroVazio");

        if(bairro.trim() == "")
            listaErros.push("bairroVazio");

        if(cidade == "" || cidade == null)
            listaErros.push("cidadeVazio");

        if(uf == "" || uf == null)
            listaErros.push("ufVazio");

        if(!checkCliente.checked && !checkFornecedor.checked)
            listaErros.push("perfilVazio");

        if(listaErros.length == 0){
            console.log("tudo ok");
            let dadosPessoa = {
                tipoPessoa: checkPf.checked ? 'PF' : 'PJ',
                email: email,
                telefone: telefone.replace(/\D/g, ""), 
                cep: cep.replace(/\D/g, ""),
                logradouro: logradouro,
                numero: numero,
                bairro: bairro,
                cidadeId: cidade,
                ufId: uf,
                ehCliente: checkCliente.checked,
                ehFornecedor: checkFornecedor.checked
            };
            if(checkPf.checked){
                dadosPessoa.nome = nome; 
                dadosPessoa.cpf = cpf.replace(/\D/g, ""); 
                dadosPessoa.dataNascimento = dataNasc;
            }else {
                dadosPessoa.cnpj = cnpj.replace(/\D/g, "");
                dadosPessoa.razaoSocial = razao;
                dadosPessoa.nomeFantasia = fantasia;
            }
            return dadosPessoa;
        }
        else{
            if(listaErros.includes("tipoPessoa")){
                msgCheckPessoa.innerText = "Selecione Pessoa Física ou Jurídica";
                msgCheckPessoa.className = "text-danger";
                lbPF.style.color = 'red';
                lbPJ.style.color = 'red';
            }
            if(listaErros.includes("nomeVazio")){
                msgNome.innerText = "Nome é obrigatório";
                inputNome.style["border-color"] = "red";
            }
            if(listaErros.includes("nomeIncompleto")){
                msgNome.innerText = "Digite o nome completo";
                inputNome.style["border-color"] = "red";
            }

            if(listaErros.includes("cpfVazio")){
                msgCpf.innerText = "O campo CPF é obrigatório!";
                inputCpf.style["border-color"] = "red";
            }
            if(listaErros.includes("cpfInvalido")){
                msgCpf.innerText = "Digite um CPF válido";
                inputCpf.style["border-color"] = "red";
            }
            if(listaErros.includes("dataNascVazio")){
                msgDtNascimento.innerText = "A data de nascimento é obrigatória";
                inputDtNascimento.style["border-color"] = "red";
            }
            if(listaErros.includes("dataInvalida")){
                msgDtNascimento.innerText = msgDtNascimento.dataset.erro; 
                inputDtNascimento.style["border-color"] = "red";
            }
             if(listaErros.includes("cnpjVazio")){
                msgCnpj.innerText = "O campo CNPJ é obrigatório!";
                inputCnpj.style["border-color"] = "red";
            }
            if(listaErros.includes("cnpjInvalido")){
                msgCnpj.innerText = "CNPJ inválido!";
                inputCnpj.style["border-color"] = "red";
            }

            if(listaErros.includes("razaoVazio")){
                msgRazao.innerText = "Razão Social obrigatória";
                inputRazao.style["border-color"] = "red";
            }
            if(listaErros.includes("razaoIncompleta")){
                msgRazao.innerText = "Digite a Razão Social completa";
                inputRazao.style["border-color"] = "red";
            }

            if(listaErros.includes("fantasiaVazio")){
                msgFantasia.innerText = "Nome Fantasia obrigatório";
                inputFantasia.style["border-color"] = "red";
            }
            if(listaErros.includes("fantasiaIncompleta")){
                msgFantasia.innerText = "Digite o Nome Fantasia completo";
                inputFantasia.style["border-color"] = "red";
            }
            if(listaErros.includes("emailVazio")){
                msgEmail.innerText = "Email obrigatório";
                inputEmail.style["border-color"] = "red";
            }
            if(listaErros.includes("emailInválido")){
                msgEmail.innerText = "Email inválido";
                inputEmail.style["border-color"] = "red";
            }
            if(listaErros.includes("telefoneVazio")){
                msgTelefone.innerText = "Celular obrigatório";
                inputTelefone.style["border-color"] = "red";
            }
            if(listaErros.includes("telefoInvalido")){
                msgTelefone.innerText = "Telefone inválido";
                inputTelefone.style["border-color"] = "red";
            }
            if(listaErros.includes("cepVazio")){
                msgCep.innerText = "CEP obrigatório";
                inputCep.style["border-color"] = "red";
            }

            if(listaErros.includes("logradouroVazio")){
                msgLogradouro.innerText = "Logradouro obrigatório";
                inputLogradouro.style["border-color"] = "red";
            }

            if(listaErros.includes("numeroVazio")){
                msgNumero.innerText = "Número obrigatório";
                inputNumero.style["border-color"] = "red";
            }

            if(listaErros.includes("bairroVazio")){
                msgBairro.innerText = "Bairro obrigatório";
                inputBairro.style["border-color"] = "red";
            }

            if(listaErros.includes("cidadeVazio")){
                msgCidade.innerText = "Selecione uma cidade";
                selectCidade.style["border-color"] = "red";
            }

            if(listaErros.includes("ufVazio")){
                msgUf.innerText = "Selecione um estado";
                selectUf.style["border-color"] = "red"; 
            }

            if(listaErros.includes("perfilVazio")){
                msgPerfil.innerText = "Selecione o perfil";
                lbPerfil.style.color = 'red';
            }
            return null;
        }
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');

        //Verifica se tem 11 dígitos ou se todos são iguais
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) 
            return false;

        let soma = 0;
        let resto;

        //  Validação do 1º Dígito
        for (let i = 1; i <= 9; i++) {
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;

        if ((resto === 10) || (resto === 11)) {
            resto = 0;
        }
        if (resto !== parseInt(cpf.substring(9, 10))) {
            return false;
        }

        // Validação do 2º Dígito
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;

        if ((resto === 10) || (resto === 11)) {
            resto = 0;
        }
        if (resto !== parseInt(cpf.substring(10, 11))) {
            return false;
        }

        return true;
    }

    function validarDataNascimento(dtNascimento) {
        let dataNasc = new Date(dtNascimento + "T00:00:00");
        let dataAtual = new Date();

        if (dataNasc > dataAtual)
            return "A data não pode ser futura";

        if (dataNasc.getFullYear() < 1900) 
            return "Ano de nascimento inválido";

        let idade = dataAtual.getFullYear() - dataNasc.getFullYear();
        let mes = dataAtual.getMonth() - dataNasc.getMonth();

        if (mes < 0 || (mes === 0 && dataAtual.getDate() < dataNasc.getDate())) 
            idade--;

        if (idade < 18) 
            return "Precisa ser maior de 18 anos";

        return "";
    }

    function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj == '') return false;
        if (cnpj.length != 14) return false;

        if (/^(\d)\1+$/.test(cnpj)) return false;

        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) return false;

        return true;
    }

    function validarTelefone(telefone) {
        const numeros = telefone.replace(/\D/g, "");
        
        if (numeros.length < 10 || numeros.length > 11) 
            return false;

        if (numeros.length === 11 && parseInt(numeros.substring(2, 3)) !== 9)
            return false;
        
        if (/^(\d)\1+$/.test(numeros)) 
            return false;

        return true;
    }
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function selecionarOpcaoPorTexto(selectElement, textoParaAchar) {
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].text.toUpperCase() === textoParaAchar.toUpperCase()) {
                selectElement.selectedIndex = i; 
                return; 
            }
        }
        selectElement.value = ""; 
    }

     function limparCamposEndereco() {
        inputLogradouro.value = "";
        inputBairro.value = "";
        selectCidade.value = "";
        selectUf.value = "";
    }

    function limparValidacao(){
        lbPF.style.color = "";
        lbPJ.style.color = "";
        lbPerfil.style.color = "";
        
        inputNome.style.borderColor = "#ced4da";
        inputCpf.style.borderColor = "#ced4da";
        inputDtNascimento.style.borderColor = "#ced4da";
        inputCnpj.style.borderColor = "#ced4da";
        inputRazao.style.borderColor = "#ced4da";
        inputFantasia.style.borderColor = "#ced4da";
        inputEmail.style.borderColor = "#ced4da";
        inputTelefone.style.borderColor = "#ced4da";
        inputCep.style.borderColor = "#ced4da";
        inputLogradouro.style.borderColor = "#ced4da";
        inputBairro.style.borderColor = "#ced4da";
        inputNumero.style.borderColor = "#ced4da";
        selectCidade.style.borderColor = "#ced4da";
        selectUf.style.borderColor = "#ced4da";

        msgCheckPessoa.innerText = "";
        msgNome.innerText = "";
        msgCpf.innerText = "";
        msgDtNascimento.innerText = "";
        msgCnpj.innerText = "";
        msgRazao.innerText = "";
        msgFantasia.innerText = "";
        msgEmail.innerText = "";
        msgTelefone.innerText = "";
        msgCep.innerText = "";
        msgLogradouro.innerText = "";
        msgBairro.innerText = "";
        msgNumero.innerText = "";
        msgCidade.innerText = "";
        msgUf.innerText = "";
        msgPerfil.innerText = "";
    }

    function limparValidacaoAlt(){
        let msgPessoaAlt = document.getElementById("msg-pessoaAlt");
        if(msgPessoaAlt) msgPessoaAlt.innerText = "";

        const campos = [
            "nomeAlt", "dtNascimentoAlt", 
            "razaoSocialAlt", "nomeFantasiaAlt", 
            "telefoneAlt", "emailAlt", 
            "cepAlt", "logradouroAlt", "numeroAlt", "bairroAlt", "cidadeAlt", "ufAlt" 
        ];

        const spans = [
            "msg-nomeAlt", "msg-dtNascimentoAlt",
            "msg-razaoAlt", "msg-fantasiaAlt",
            "msg-telefoneAlt", "msg-emailAlt",
            "msg-cepAlt", "msg-logradouroAlt", "msg-numeroAlt", "msg-bairroAlt", "msg-cidadeAlt", "msg-ufAlt"
        ];

        campos.forEach(id => {
            let elemento = document.getElementById(id);
            if(elemento){
                elemento.style.borderColor = "#ced4da";
            }
        });

        spans.forEach(id => {
            let elemento = document.getElementById(id);
            if(elemento){
                elemento.innerText = "";
            }
        });
    }


    function limparFormulario(){
        limparValidacao();

        inputNome.value = "";
        inputCpf.value = "";
        inputDtNascimento.value = "";
        inputCnpj.value = "";
        inputRazao.value = "";
        inputFantasia.value = "";
        inputEmail.value = "";
        inputTelefone.value = ""
        inputCep.value = "";
        inputLogradouro.value = "";
        inputNumero.value = "";
        inputBairro.value = "";
        selectCidade.value = "";
        selectUf.value = "";
        checkPf.checked = true;          
        checkPj.checked = false;         
        checkCliente.checked = false;     
        checkFornecedor.checked = false; 
        checkFornecedor.disabled = true; 
        camposPf.style.display = "block"; 
        camposPj.style.display = "none";
    }
    
})