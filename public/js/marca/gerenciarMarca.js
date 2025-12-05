document.addEventListener("DOMContentLoaded", function(){
    let msgMarca = document.querySelector("#msg-marca");
    let msgMarcaAlt = document.querySelector("#msg-marcaAlt");
    const inputDescMarca = document.querySelector("#descricaoMarca");
    const inputDescMarcaAlt = document.querySelector("#descricaoMarcaAlt");
    //let msgMarcaEx = document.querySelector("#msg-marcaEx");
    
    const modal = document.getElementById('modalMarca')
        modal.addEventListener('show.bs.modal', event => {
        limparValidacao();
    });
    const modalAlt = document.getElementById('modalMarcaAlt')
        modalAlt.addEventListener('show.bs.modal', event => {
        limparValidacaoAlt();
    });

    inputDescMarca.addEventListener('input', function() {
       inputDescMarca.style["border-color"] = "#ced4da"; 
        msgMarca.innerText = ""; 
    });
    inputDescMarcaAlt.addEventListener('input', function() {
       inputDescMarcaAlt.style["border-color"] = "#ced4da"; 
        msgMarcaAlt.innerText = ""; 
    });

    document.getElementById("btnCadastrar").addEventListener("click", cadastrar);
    document.getElementById("btnAlterar").addEventListener("click", alterar);
    document.getElementById("btnExcluir").addEventListener("click", excluir);

    const botoesAlteracao = document.querySelectorAll(".btnAlteracao");
    
    botoesAlteracao.forEach(function(botao){
        botao.addEventListener("click", function(){
            let dados = this.dataset;

            document.getElementById("idMarcaAlt").value = dados.id;
            document.getElementById("descricaoMarcaAlt").value = dados.nome;
            limparValidacaoAlt();
        });
    });

    const botoesExclusao = document.querySelectorAll(".btnExclusao");
    botoesExclusao.forEach(function(botao){
        botao.addEventListener("click", function(){
            const id = this.getAttribute("data-id");
            const nome = this.getAttribute("data-nome");

            document.getElementById("codigoExclusao").innerText = id;
            document.getElementById("nomeExclusao").innerText = nome;
            document.getElementById("idMarcaExcluir").value = id;
        });
    });

    function limparValidacao(){
        document.getElementById("descricaoMarca").style["border-color"] = "#ced4da";
        msgMarca.textContent = "";
    }
    function limparValidacaoAlt(){
        document.getElementById("descricaoMarcaAlt").style["border-color"] = "#ced4da";
        msgMarcaAlt.textContent = "";
    }

    function cadastrar(){
        limparValidacao();
        let descricao = document.querySelector("#descricaoMarca").value;

        let listaErros = [];
        if(descricao.trim() == "")
            listaErros.push("descricaoMarca");
        
        if(listaErros.length == 0){
            let desc = {
                descricao: descricao.trim(),
            }
            fetch("/marca/cadastrar", {
                method: 'POST',
                body: JSON.stringify(desc),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(r=> {
                return r.json();
            })
            .then(r=> {
                if(r.ok) {
                    window.location.href="/marca";
                }   
                else {
                    msgMarca.innerHTML = r.msg;
                }
            })
        }else{
            document.getElementById("descricaoMarca").style["border-color"] = "red";
            msgMarca.textContent = "Informe uma descrição válida";
        }
    }

    function alterar() {
        limparValidacao();
        
        let id = document.querySelector("#idMarcaAlt").value;
        let descricao = document.querySelector("#descricaoMarcaAlt").value;

        let listaErros = [];
        if(descricao.trim() === "") {
            listaErros.push("descricaoMarcaAlt");
        }
        
        if(listaErros.length === 0){
            let marca = {
                id: id,
                descricao: descricao.trim(),
            };

            fetch("/marca/alterar", { 
                method: 'POST',
                body: JSON.stringify(marca),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(r => r.json())
            .then(r => {
                if(r.ok) {
                    window.location.href = "/marca";
                } else {
                    msgMarcaAlt.innerHTML = r.msg;
                }
            });
        } else {
            document.getElementById("descricaoMarcaAlt").style["border-color"] = "red";
            msgMarcaAlt.textContent = "Informe uma descrição válida";
        }
    }

    function excluir() {
        const idParaExcluir = document.getElementById("idMarcaExcluir").value;

        if(idParaExcluir) {
            fetch('/marca/excluir', {
                method: 'POST',
                body: JSON.stringify({ id: idParaExcluir }),
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
        } else {
            alert("ID da marca não encontrado para exclusão.");
        }
    }
})