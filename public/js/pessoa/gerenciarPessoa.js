document.addEventListener("DOMContentLoaded", function(){
    let checkPj = document.querySelector("#checkedPJ");
    let checkPf = document.querySelector("#checkedPF");
    let lbPF = document.querySelector("#lb-checkedPF");
    let lbPJ = document.querySelector("#lb-checkedPJ");
    let msgCheckPessoa = document.querySelector("#msg-checkPessoa");
    let msgNome = document.querySelector("#msg-nome");
    let msgCpf = document.querySelector("#msg-cpf");
    let msgDtNascimento = document.querySelector("#msg-dtnascimento");
    let msgCnpj = document.querySelector("#msg-cnpj");
    let msgRazao = document.querySelector("#msg-razao");
    let msgFantasia = document.querySelector("#msg-fantasia");
    let msgTelefone = document.querySelector("#msg-telefone");
    let msgEmail = document.querySelector("#msg-email");
    let msgPessoa = document.querySelector("#msg-pessoa");
    const inputNome = document.querySelector("#nome");
    const inputCpf = document.querySelector("#cpf");
    const inputDtNascimento = document.querySelector("#dtNascimento");
    const inputCnpj = document.querySelector("#cnpj");
    const inputRazao = document.querySelector("#razaoSocial");
    const inputFantasia = document.querySelector("#nomeFantasia");
    const camposPf = document.getElementById("camposPF");
    const camposPj = document.getElementById("camposPJ");
    const inputTelefone = document.querySelector("#telefone");
    const inputEmail = document.querySelector("#email");
    //const checkCliente = document.querySelector("#checkCliente");
    //const checkFornecedor = document.querySelector("#checkFornecedor");

    const btnCadastrar = document.querySelector("#btnCadastrar");

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
        inputCnpj.style.borderColor = "#ced4da";
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

    const modal = document.getElementById('modalPessoa')
        modal.addEventListener('show.bs.modal', event => {
        limparValidacao();
    });

    btnCadastrar.addEventListener("click", cadastrar);

    checkPf.addEventListener("change", function() {
        if (checkPf.checked) {
            camposPf.style.display = "block";
            camposPj.style.display = "none";
            checkPj.checked = false;
            checkFornecedor.disabled = true
            limparValidacao();

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
            checkFornecedor.disabled = false;
            limparValidacao();

            inputNome.value = "";
            inputCpf.value = "";
            inputDtNascimento.value = "";
        } else {
            camposPj.style.display = "none";
        }
    });

    function cadastrar(){
        let cadastroPessoa = [];
        if(validaTipoPessoaSelecionado()){
            if(checkPf.checked === true){
                //checkFornecedor.disable = true;
                let nome = inputNome.value.toUpperCase().trim();
                let cpf = inputCpf.value;
                let dataNasc = inputDtNascimento.value;
                let erroData = validarDataNascimento(dataNasc);
                let listaErrosPf = [];
                
                if(nome.trim() == "")
                    listaErrosPf.push("nomeVazio");
                else if (nome.trim().split(" ").filter(parte => parte !== "").length < 2) 
                    listaErrosPf.push("nomeIncompleto");
                
                if(cpf.trim() == "")
                    listaErrosPf.push("cpfVazio");
                if(cpf.trim() != "" && !validarCPF(cpf))
                    listaErrosPf.push("cpfInvalido");
                
                if(dataNasc == "")
                    listaErrosPf.push("dataNascVazio");
                if(dataNasc != "" && erroData != "") {
                    listaErrosPf.push("dataInvalida");
                    msgDtNascimento.dataset.erro = erroData; 
                }

                if(listaErrosPf.length == 0){
                    cadastroPessoa.push(nome,cpf,dataNasc);
                }
                else{
                    if(listaErrosPf.includes("nomeVazio")){
                        msgNome.innerText = "Nome é obrigatório";
                        inputNome.style["border-color"] = "red";
                    }
                    if(listaErrosPf.includes("nomeIncompleto")){
                        msgNome.innerText = "Digite o nome completo";
                        inputNome.style["border-color"] = "red";
                    }

                    if(listaErrosPf.includes("cpfVazio")){
                        msgCpf.innerText = "O campo CPF é obrigatório!";
                        inputCpf.style["border-color"] = "red";
                    }
                    if(listaErrosPf.includes("cpfInvalido")){
                        msgCpf.innerText = "Digite um CPF válido";
                        inputCpf.style["border-color"] = "red";
                    }
                    
                    if(listaErrosPf.includes("dataNascVazio")){
                        msgDtNascimento.innerText = "A data de nascimento é obrigatória";
                        inputDtNascimento.style["border-color"] = "red";
                    }
                    if(listaErrosPf.includes("dataInvalida")){
                        msgDtNascimento.innerText = msgDtNascimento.dataset.erro; 
                        inputDtNascimento.style["border-color"] = "red";
                    }
                }
            }
            if(checkPj.checked === true){
                let cnpj = inputCnpj.value;
                let razao = inputRazao.value.toUpperCase().trim();
                let fantasia = inputFantasia.value.toUpperCase().trim();
                let listaErrosPj = [];

                if(cnpj.trim() == "") 
                    listaErrosPj.push("cnpjVazio");
                if(cnpj.trim() != "" && !validarCNPJ(cnpj)) 
                    listaErrosPj.push("cnpjInvalido");

                if(razao == "") 
                    listaErrosPj.push("razaoVazio");
                else if(razao.split(" ").filter(p => p !== "").length < 2) 
                    listaErrosPj.push("razaoIncompleta");

                if(fantasia == "") 
                    listaErrosPj.push("fantasiaVazio");
                else if(fantasia.split(" ").filter(p => p !== "").length < 2) 
                    listaErrosPj.push("fantasiaIncompleta");

                if(listaErrosPj.length == 0){
                    cadastroPessoa.push(cnpj,razao,fantasia);
                } 
                else {
                    if(listaErrosPj.includes("cnpjVazio")){
                        msgCnpj.innerText = "O campo CNPJ é obrigatório!";
                        inputCnpj.style["border-color"] = "red";
                    }
                    if(listaErrosPj.includes("cnpjInvalido")){
                        msgCnpj.innerText = "CNPJ inválido!";
                        inputCnpj.style["border-color"] = "red";
                    }

                    if(listaErrosPj.includes("razaoVazio")){
                        msgRazao.innerText = "Razão Social obrigatória";
                        inputRazao.style["border-color"] = "red";
                    }
                    if(listaErrosPj.includes("razaoIncompleta")){
                        msgRazao.innerText = "Digite a Razão Social completa";
                        inputRazao.style["border-color"] = "red";
                    }

                    if(listaErrosPj.includes("fantasiaVazio")){
                        msgFantasia.innerText = "Nome Fantasia obrigatório";
                        inputFantasia.style["border-color"] = "red";
                    }
                    if(listaErrosPj.includes("fantasiaIncompleta")){
                        msgFantasia.innerText = "Digite o Nome Fantasia completo";
                        inputFantasia.style["border-color"] = "red";
                    }
                }
            }

            let listaErros = [];
            let email = inputEmail.value.trim();
            let telefone = inputTelefone.value;

            if(email.trim() == "")
                listaErros.push("emailVazio");
            else if (email != "" && !validarEmail(email))
                listaErros.push("emailInválido");
            
            if(telefone.trim() == "")
                listaErros.push("telefoneVazio");
            else if (telefone != "" && !validarTelefone(telefone))
                    listaErros.push("telefoInvalido");
            
            if(listaErros.length == 0 ){
                cadastroPessoa.push(email,telefone);

                fetch("/pessoa/cadastrar", {
                method: 'POST',
                body: JSON.stringify(cadastroPessoa),
                headers: {
                    "Content-Type": "application/json",
                }
                })
                .then(r=> {
                    return r.json();
                })
                .then(r => {
                    if(r.ok) {
                        window.location.href="/pessoa";
                    } else {
                        msgPessoa.innerHTML = r.msg;
                    }
                })
            }
            else{
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
            }
            console.log(cadastroPessoa);
        }
        
    }

    function validaTipoPessoaSelecionado() {
        if (!checkPf.checked && !checkPj.checked) {
            msgCheckPessoa.innerText = "Selecione Pessoa Física ou Jurídica";
            msgCheckPessoa.className = "text-danger";
            lbPF.style.color = 'red';
            lbPJ.style.color = 'red';
            return false;
        }
        return true;
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
    function limparValidacao(){
        checkPf.checked = false;
        checkPj.checked = false;
        checkFornecedor.disabled = false;
        lbPF.style.color = "";
        lbPJ.style.color = "";
        msgCheckPessoa.innerText = "";

        inputNome.style.borderColor = "#ced4da";
        inputCpf.style.borderColor = "#ced4da";
        inputDtNascimento.style.borderColor = "#ced4da";
        inputCnpj.style.borderColor = "#ced4da";
        inputRazao.style.borderColor = "#ced4da";
        inputFantasia.style.borderColor = "#ced4da";
        inputEmail.style.borderColor = "#ced4da";
        inputTelefone.style.borderColor = "#ced4da";

        msgNome.innerText = "";
        msgCpf.innerText = "";
        msgDtNascimento.innerText = "";
        msgCnpj.innerText = "";
        msgRazao.innerText = "";
        msgFantasia.innerText = "";
        msgEmail.innerText = "";
        msgTelefone.innerText = "";
    }
    
})