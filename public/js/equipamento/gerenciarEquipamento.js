document.addEventListener("DOMContentLoaded", function(){
    let msgEquipamento =  document.querySelector("#msg-equipamento");
    let msgEquipamentoAlt =  document.querySelector("#msg-equipamentoAlt");
    //let msgEquipamentoExc =  document.querySelector("#msg-equipamentoExc");

    const modal = document.getElementById('modalEquipamento')
        modal.addEventListener('show.bs.modal', event => {
        limparValidacao();
    });
    const modalAlt = document.getElementById('modalEquipamentoAlt')
        modalAlt.addEventListener('show.bs.modal', event => {
        limparValidacaoAlt();
    });

    document.getElementById("btnCadastrar").addEventListener("click", cadastrar);
    document.getElementById("btnAlterar").addEventListener("click", alterar);
    document.getElementById("btnConfirmarExclusao").addEventListener("click", excluir);

    const botoesAlteracao = document.querySelectorAll(".btnAlteracao");

    botoesAlteracao.forEach(function(botao){
        botao.addEventListener("click", function(){
            const equipamentoId = this.getAttribute("data-id");
            fetch(`/equipamento/buscar/${equipamentoId}`)
            .then(response => response.json())
            .then(data => {
                if(data.ok && data.equipamento){
                    document.getElementById("idEquipamentoAlt").value = data.equipamento.equipamentoId;
                    document.getElementById("descricaoEquipamentoAlt").value = data.equipamento.equipamentoNome;
                    document.getElementById("modeloEquipamentoAlt").value = data.equipamento.equipamentoModelo;
                    document.getElementById("qtdEquipamentoAlt").value = data.equipamento.equipamentoEstoque;
                    document.getElementById("marcaEquipamentoAlt").value = data.equipamento.marcaId;
                } else {
                    alert(data.msg || "Erro ao buscar os dados do equipamento.");
                }
            })
            .catch(error => {
                console.error("Erro na requisição fetch:", error);
                alert("Não foi possível carregar os dados para edição.");
            });
        });
    });

    const botoesExclusao = document.querySelectorAll(".btnExclusao");
    botoesExclusao.forEach(function(botao){
        botao.addEventListener("click", function(){
            const id = this.getAttribute("data-id");
            const nome = this.getAttribute("data-nome");
            const modelo = this.getAttribute("data-modelo");
            const marca = this.getAttribute("data-marca");
            const estoque = this.getAttribute("data-estoque");

            document.getElementById("codigoExclusao").innerText = id;
            document.getElementById("nomeExclusao").innerText = nome;
            document.getElementById("modeloExclusao").innerText = modelo;
            document.getElementById("marcaExclusao").innerText = marca;
            document.getElementById("qtdExclusao").innerText = estoque;

            document.getElementById("idEquipamentoExcluir").value = id;
        });
    });

    function limparValidacao(){
        document.getElementById("descricaoEquipamento").style["border-color"] = "#ced4da";
        document.getElementById("modeloEquipamento").style["border-color"] = "#ced4da";
        document.getElementById("qtdEquipamento").style["border-color"] = "#ced4da";
        document.getElementById("marcaEquipamento").style["border-color"] = "#ced4da";
        msgEquipamento.textContent = "";
    }
    function limparValidacaoAlt(){
        document.getElementById("descricaoEquipamentoAlt").style["border-color"] = "#ced4da";
        document.getElementById("modeloEquipamentoAlt").style["border-color"] = "#ced4da";
        document.getElementById("qtdEquipamentoAlt").style["border-color"] = "#ced4da";
        document.getElementById("marcaEquipamentoAlt").style["border-color"] = "#ced4da";
        msgEquipamentoAlt.textContent = "";
    }

    function cadastrar(){
        limparValidacao();
        let descricao = document.querySelector("#descricaoEquipamento").value;
        let modelo = document.querySelector("#modeloEquipamento").value;
        let estoque = document.querySelector("#qtdEquipamento").value;
        let marcaId = document.querySelector("#marcaEquipamento").value;

        let listaErros = [];
        if(descricao.trim() === "")
            listaErros.push("descricaoEquipamento");
        if(modelo.trim() === "")
            listaErros.push("modeloEquipamento");
        if(estoque.trim() === "")
            listaErros.push("qtdEquipamento");
        if(marcaId.trim() === "")
            listaErros.push("marcaEquipamento");
        
        if(listaErros.length == 0){
            let dados = {
                descricao: descricao.trim(),
                modelo: modelo.trim(),
                estoque: estoque.trim(),
                marcaId: marcaId
            };
            fetch("/equipamento/cadastrar", {
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
                    window.location.href="/equipamento";
                } else {
                    msgEquipamento.innerHTML = r.msg;
                }
            })
        }else{
            if(listaErros.includes("descricaoEquipamento"))
                document.getElementById("descricaoEquipamento").style["border-color"] = "red";
            if(listaErros.includes("modeloEquipamento"))
                document.getElementById("modeloEquipamento").style["border-color"] = "red";
            if(listaErros.includes("qtdEquipamento"))
                document.getElementById("qtdEquipamento").style["border-color"] = "red";
            if(listaErros.includes("marcaEquipamento"))
                document.getElementById("marcaEquipamento").style["border-color"] = "red";
            
            msgEquipamento.textContent = "Preencha os campos";
        }
    }

    function alterar() {
        limparValidacaoAlt();
        
        let id = document.querySelector("#idEquipamentoAlt").value;
        let descricao = document.querySelector("#descricaoEquipamentoAlt").value;
        let modelo = document.querySelector("#modeloEquipamentoAlt").value;
        let estoque = document.querySelector("#qtdEquipamentoAlt").value;
        let marcaId = document.querySelector("#marcaEquipamentoAlt").value;

        let listaErros = [];
         if(descricao.trim() === "")
            listaErros.push("descricaoEquipamentoAlt");
        if(modelo.trim() === "")
            listaErros.push("modeloEquipamentoAlt");
        if(estoque.trim() === "")
            listaErros.push("qtdEquipamentoAlt");
        if(marcaId.trim() === "")
            listaErros.push("marcaEquipamentoAlt");
        
        if(listaErros.length === 0){
            let equipamento = {
                id: id,
                descricao: descricao.trim(),
                modelo: modelo.trim(),
                estoque: estoque.trim(),
                marcaId: marcaId
            };

            fetch("/equipamento/alterar", {
                method: 'POST',
                body: JSON.stringify(equipamento),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(r => r.json())
            .then(r => {
                if(r.ok) {
                    window.location.href = "/equipamento";
                } else {
                    msgEquipamentoAlt.innerHTML = r.msg;
                }
            });
        } else {
            if(listaErros.includes("descricaoEquipamentoAlt"))
                document.getElementById("descricaoEquipamentoAlt").style["border-color"] = "red";
            if(listaErros.includes("modeloEquipamentoAlt"))
                document.getElementById("modeloEquipamentoAlt").style["border-color"] = "red";
            if(listaErros.includes("qtdEquipamentoAlt"))
                document.getElementById("qtdEquipamentoAlt").style["border-color"] = "red";
            if(listaErros.includes("marcaEquipamentoAlt"))
                document.getElementById("marcaEquipamentoAlt").style["border-color"] = "red";
            
            msgEquipamentoAlt.textContent = "Preencha os campos em vermelho";
        }
    }

    function excluir() {
        const idParaExcluir = document.getElementById("idEquipamentoExcluir").value;

        if(idParaExcluir) {
            fetch('/equipamento/excluir', {
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
            alert("ID do equipamento não encontrado para exclusão.");
        }
    }
});