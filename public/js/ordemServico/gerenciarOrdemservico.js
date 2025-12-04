document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('checkEquipamento').addEventListener('change', function () {
        const div = document.getElementById('divEquipamento');
        const qntd = document.querySelectorAll("#quantidadeCheck");
        if (this.checked) {
            div.style.display = 'block';
            qntd.style.display = 'block'
        } else {
            div.style.display = 'none';
            qntd.style.display = 'none';
        }


    });
    document.getElementById('checkProdutos').addEventListener('change', function () {
        const divProdutos = document.getElementById('divProdutos');
        if (this.checked) {
            divProdutos.style.display = 'block';
        } else {
            divProdutos.style.display = 'none';
        }
    });

    document.getElementById('checkServico').addEventListener('change', function () {
        const divServicos = document.getElementById('divServico');
        if (this.checked) {
            divServicos.style.display = 'block';
        } else {
            divServicos.style.display = 'none';
        }
    });

    const checkQuantS = document.querySelectorAll('.servico-checkbox'); // SERVIÇOS

    function quantServico(checkbox) {
        const id = checkbox.dataset.id;
        const wrapp = document.getElementById("serv-wrapp" + id);
        const input = document.getElementById("serv-quant" + id);

        if (checkbox.checked) {
            wrapp.style.display = "block";
            input.required = true;
        } else {
            wrapp.style.display = "none";
            input.required = false;
            input.value = "";
        }
    }

    checkQuantS.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            quantServico(checkbox);
        });
    });



    const checkQuant = document.querySelectorAll('.equipamento-checkbox');//EQUIPAMENTOS
    function quantEquip(checkbox) {
        const id = checkbox.dataset.id;//pega o id do equipamentos selecionado
        const wrapp = document.getElementById("equip-wrapp" + id);
        const input = document.getElementById("equip-quant" + id);

        if (checkbox.checked) {
            wrapp.style.display = "block";
            input.required = true;
        } else {
            wrapp.style.display = "none";
            input.required = false;
            input.value = "";
        }
    }
    checkQuant.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            quantEquip(checkbox);
        });
    });

    const checkQuantP = document.querySelectorAll('.produto-checkbox');///PRODUTOS
    function quantProd(checkbox) {
        const id = checkbox.dataset.id;
        const wrapp = document.getElementById("prod-wrapp" + id);
        const input = document.getElementById("prod-quant" + id);

        if (checkbox.checked) {
            wrapp.style.display = "block";
            input.required = true;
        } else {
            wrapp.style.display = "none";
            input.required = false;
            input.value = "";
        }
    }
    checkQuantP.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            quantProd(checkbox);
        });
    });
    //DROPDOW  pessoas: segundo fulvio

    const BtnDrop = document.getElementById("PessoaBtn");
    const dropMenu = document.getElementById("PessoaMenu");
    const pesquisaInput = document.getElementById("pesquisaPessoa");
    const itens = document.getElementById("dropPessoaItem");
    const inputId = document.getElementById("pessoaId");

    BtnDrop.addEventListener("click", function () {
        dropMenu.classList.toggle("show");
        pesquisaInput.value = "";
        itens.innerHTML = "";
        pesquisaInput.focus();
    });
    pesquisaInput.addEventListener("input", function (e) {
        let texto = e.target.value;

        fetch("/pessoa/buscarPorNome/" + texto)
            .then(r => r.json())
            .then(data => {
                montarLista(data.pessoas);
            });
    });
    function montarLista(pessoas) {
        itens.innerHTML = "";

        if (pessoas.length === 0) {
            itens.innerHTML = "<div class='px-2 text-danger'>Nenhum resultado encontrado</div>";
            return;
        }
        pessoas.forEach(p => {
            let div = document.createElement("div");
            div.classList.add("dropdown-item");
            div.dataset.id = p.PESSOA_ID;
            div.dataset.nome = p.NOME;
            div.dataset.cep = p.CEP;
            div.dataset.logradouro = p.LOGRADOURO;
            div.dataset.bairro = p.BAIRRO;
            div.dataset.cidade = p.NOME_CID;
            div.textContent = p.NOME;

            div.addEventListener("click", function () {

                document.getElementById('cepPessoa').value = this.dataset.cep;
                document.getElementById('logradouroPessoa').value = this.dataset.logradouro;
                document.getElementById('bairroPessoa').value = this.dataset.bairro;
                document.getElementById('cidadePessoa').value = this.dataset.cidade;

                document.querySelector('.endereco-container').classList.remove('d-none');
                itens.innerHTML = "";
            });

            itens.appendChild(div);
        });
    }
    itens.addEventListener("click", function (e) {
        if (e.target.classList.contains("dropdown-item")) {
            document.getElementById("nomePessoa").value = e.target.dataset.nome;
            inputId.value = e.target.dataset.id;

            document.getElementById("cepPessoa").value = e.target.dataset.cep;
            document.getElementById("logradouroPessoa").value = e.target.dataset.logradouro;
            document.getElementById("bairroPessoa").value = e.target.dataset.bairro;
            document.getElementById("cidadePessoa").value = e.target.dataset.cidade;

            dropMenu.classList.remove("show");
        }
    });


    //fehcando o drop se clicar fora
    document.addEventListener("click", function (e) {
        if (!dropMenu.contains(e.target) && !BtnDrop.contains(e.target)) {
            dropMenu.classList.remove("show");
        }
    });

});