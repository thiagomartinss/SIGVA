document.addEventListener("DOMContentLoaded", function () {
    let dadosEdicao = {
        idOs: null,
        descServico: "",
        equipamentoId: null,
        servicos: [],
        produtos: []
    };

    const btnsEditar = document.querySelectorAll(".btn-editar-os");
    btnsEditar.forEach(btn => {
        btn.addEventListener("click", function() {
            let id = this.dataset.id;
            carregarDadosEdicao(id);
        });
    });

    function carregarDadosEdicao(id) {
        fetch(`/ordemServico/buscar/${id}`)
        .then(r => r.json())
        .then(resp => {
            if(resp.ok) {
                let d = resp.dados;
                
                dadosEdicao.idOs = d.os.ID_OS;
                dadosEdicao.descServico = d.os.DESC_SERVICO;
                dadosEdicao.equipamentoId = d.os.EQUIPAMENTO_ID_EQUIPAMENTO;
                
                dadosEdicao.servicos = d.servicos.map(s => ({
                    id: s.SERVICO_ID_SERVICO,
                    nome: s.NOME_SERVICO,
                    valor: s.VALOR_SERVICO
                }));

                dadosEdicao.produtos = d.produtos.map(p => ({
                    id: p.PRODUTO_ID_PRODUTO,
                    nome: p.NOME_PRODUTO,
                    qtd: p.QUANTIDADE,
                    valor: p.VALOR_UNITARIO
                }));

                document.getElementById("editIdOs").value = d.os.ID_OS;
                document.getElementById("editDescServico").value = d.os.DESC_SERVICO;
                
                if(d.equipamento) {
                    document.getElementById("editEquipamentoId").value = d.equipamento.ID_EQUIPAMENTO;
                    document.getElementById("editEquipamentoNome").value = d.equipamento.DESC_EQUIPAMENTO || d.equipamento.MODELO;
                } else {
                    document.getElementById("editEquipamentoId").value = "";
                    document.getElementById("editEquipamentoNome").value = "";
                }

                renderizarTabelasEdicao();
                atualizarTotalEdicao();

            } else {
                alert("Erro ao buscar dados: " + resp.msg);
            }
        });
    }

    function renderizarTabelasEdicao() {
        let tbodyServ = document.getElementById("editListaServicos");
        tbodyServ.innerHTML = "";
        dadosEdicao.servicos.forEach((s, index) => {
            let row = `<tr>
                <td>${s.nome}</td>
                <td>R$ <input type="number" class="form-control form-control-sm d-inline w-75" value="${s.valor}" onchange="alterarValorServico(${index}, this.value)"></td>
                <td><button type="button" class="btn btn-sm btn-danger" onclick="removerServico(${index})"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`;
            tbodyServ.innerHTML += row;
        });


        let tbodyProd = document.getElementById("editListaProdutos");
        tbodyProd.innerHTML = "";
        dadosEdicao.produtos.forEach((p, index) => {
            let row = `<tr>
                <td>${p.nome}</td>
                <td><input type="number" class="form-control form-control-sm" value="${p.qtd}" onchange="alterarQtdProduto(${index}, this.value)"></td>
                <td>R$ ${p.valor}</td>
                <td><button type="button" class="btn btn-sm btn-danger" onclick="removerProduto(${index})"><i class="fa-solid fa-trash"></i></button></td>
            </tr>`;
            tbodyProd.innerHTML += row;
        });
    }

    window.removerServico = function(idx) {
        dadosEdicao.servicos.splice(idx, 1);
        renderizarTabelasEdicao();
        atualizarTotalEdicao();
    }
    window.removerProduto = function(idx) {
        dadosEdicao.produtos.splice(idx, 1);
        renderizarTabelasEdicao();
        atualizarTotalEdicao();
    }
    window.alterarValorServico = function(idx, val) {
        dadosEdicao.servicos[idx].valor = val;
        atualizarTotalEdicao();
    }
    window.alterarQtdProduto = function(idx, val) {
        dadosEdicao.produtos[idx].qtd = val;
        atualizarTotalEdicao();
    }

    function atualizarTotalEdicao() {
        let total = 0;
        dadosEdicao.servicos.forEach(s => total += parseFloat(s.valor));
        dadosEdicao.produtos.forEach(p => total += (parseFloat(p.valor) * parseFloat(p.qtd)));
        document.getElementById("editValorTotal").innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    document.getElementById("btnSalvarEdicaoReal").addEventListener("click", function() {
        dadosEdicao.descServico = document.getElementById("editDescServico").value;
        dadosEdicao.equipamentoId = document.getElementById("editEquipamentoId").value;

        fetch("/ordemServico/alterar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosEdicao)
        })
        .then(r => r.json())
        .then(resp => {
            if(resp.ok) {
                alert("Salvo com sucesso!");
                window.location.reload();
            } else {
                alert("Erro: " + resp.msg);
            }
        });
    });

    const btnsConcluir = document.querySelectorAll(".btn-concluir-os");
    const labelId = document.getElementById("confOsId");
    const labelCliente = document.getElementById("confCliente");
    const labelValor = document.getElementById("confValor");
    const btnConfirmarConclusao = document.getElementById("btnConfirmarConclusao");

    let idParaConcluir = null;


    btnsConcluir.forEach(btn => {
        btn.addEventListener("click", function() {
            let dados = this.dataset;
            idParaConcluir = dados.id;

            
            labelId.innerText = "#" + dados.id;
            labelCliente.innerText = dados.cliente;
            
            
            let valorFormatado = parseFloat(dados.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            labelValor.innerText = valorFormatado;
        });
    });


    if(btnConfirmarConclusao) {
        btnConfirmarConclusao.addEventListener("click", function() {
            if(!idParaConcluir) return;

            
            this.disabled = true;
            this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando...';

            fetch("/ordemServico/concluir", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idOs: idParaConcluir })
            })
            .then(res => res.json())
            .then(response => {
                if(response.ok) {
                    alert("Ordem de Serviço Finalizada!");
                    window.location.reload(); 
                } else {
                    alert("Erro: " + response.msg);
                    
                    document.getElementById("btnConfirmarConclusao").disabled = false;
                    document.getElementById("btnConfirmarConclusao").innerHTML = '<i class="fa-solid fa-check me-2"></i>CONFIRMAR';
                }
            })
            .catch(err => {
                console.error(err);
                alert("Erro de conexão.");
            });
        });
    }

    document.addEventListener("click", function(e) {
       
        const btn = e.target.closest(".btn-cancelar-os");
        
        if(btn) {
            let id = btn.dataset.id;
        
            if(confirm(`Tem certeza que deseja CANCELAR a Ordem de Serviço #${id}?`)) {
                
                fetch("/ordemServico/cancelar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idOs: id })
                })
                .then(res => res.json())
                .then(response => {
                    if(response.ok) {
                        alert("Ordem de Serviço cancelada com sucesso!");
                        window.location.reload();
                    } else {
                        alert("Erro ao cancelar: " + response.msg);
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Erro de conexão.");
                });
            }
        }
    });
});