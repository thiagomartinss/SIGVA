document.addEventListener("DOMContentLoaded", function () {

    // ESTADO GLOBAL DA EDIÇÃO
    let dadosOrdemServico = {
        idOs: document.getElementById("editIdOs").value,
        clienteId: document.getElementById("clienteId").value, // Já vem preenchido
        descServico: document.getElementById("descServico").value,
        equipamentoId: document.getElementById("equipamentoIdSelecionado").value,
        servicos: [],
        produtos: []
    };

    // --- 1. CARREGAR DADOS INICIAIS (Vindo do Banco) ---
    if (typeof dadosIniciais !== 'undefined') {
        
        // Mapear Serviços do Banco para o nosso padrão JS
        if(dadosIniciais.servicos) {
            dadosIniciais.servicos.forEach(s => {
                dadosOrdemServico.servicos.push({
                    id: s.SERVICO_ID_SERVICO,
                    nome: s.NOME_SERVICO, // Vem do join
                    valor: s.VALOR_SERVICO
                });
            });
        }

        // Mapear Produtos do Banco
        if(dadosIniciais.produtos) {
            dadosIniciais.produtos.forEach(p => {
                dadosOrdemServico.produtos.push({
                    id: p.PRODUTO_ID_PRODUTO,
                    nome: p.NOME_PRODUTO, // Vem do join
                    valor: p.VALOR_UNITARIO,
                    qtd: p.QUANTIDADE
                });
            });
        }

        // Renderiza tudo na tela
        renderizarTabelas();
    }


    // --- 2. FUNÇÕES DE RENDERIZAÇÃO (Desenham a tabela baseada no array) ---
    function renderizarTabelas() {
        atualizarValorTotal();

        // Serviços
        const tbodyServ = document.getElementById("listaServicosAdicionados");
        tbodyServ.innerHTML = "";
        dadosOrdemServico.servicos.forEach((s, index) => {
            let row = `<tr>
                <td>${s.nome}</td>
                <td>R$ ${parseFloat(s.valor).toFixed(2)}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-danger" onclick="removerServico(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`;
            tbodyServ.innerHTML += row;
        });

        // Produtos
        const tbodyProd = document.getElementById("listaProdutosAdicionados");
        tbodyProd.innerHTML = "";
        dadosOrdemServico.produtos.forEach((p, index) => {
            let subtotal = (p.valor * p.qtd).toFixed(2);
            let row = `<tr>
                <td>${p.nome}</td>
                <td>R$ ${parseFloat(p.valor).toFixed(2)}</td>
                <td class="text-center">${p.qtd}</td>
                <td>R$ ${subtotal}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-danger" onclick="removerProduto(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`;
            tbodyProd.innerHTML += row;
        });
    }

    function atualizarValorTotal() {
        let total = 0;
        dadosOrdemServico.servicos.forEach(s => total += parseFloat(s.valor));
        dadosOrdemServico.produtos.forEach(p => total += (parseFloat(p.valor) * parseFloat(p.qtd)));
        document.getElementById("labelValorTotal").innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Funções Globais para o OnClick
    window.removerServico = function(idx) {
        dadosOrdemServico.servicos.splice(idx, 1);
        renderizarTabelas();
    }
    window.removerProduto = function(idx) {
        dadosOrdemServico.produtos.splice(idx, 1);
        renderizarTabelas();
    }


    // --- 3. LÓGICA DE ADICIONAR NOVOS ITENS (Igual ao Criar OS) ---
    
    // Botão Adicionar Serviço
    document.getElementById("btnAdicionarServico").addEventListener("click", function() {
        let id = document.getElementById("servicoIdSelecionado").value;
        let nome = document.getElementById("servicoNome").value;
        let valor = document.getElementById("servicoValor").value;

        if(!id) return alert("Selecione um serviço");
        
        dadosOrdemServico.servicos.push({ id, nome, valor });
        renderizarTabelas();
        
        // Limpar inputs
        document.getElementById("servicoIdSelecionado").value = "";
        document.getElementById("servicoNome").value = "";
        document.getElementById("servicoValor").value = "";
    });

    // Botão Adicionar Produto
    document.getElementById("btnAdicionarProduto").addEventListener("click", function() {
        let id = document.getElementById("produtoIdSelecionado").value;
        let nome = document.getElementById("produtoNome").value;
        let valor = document.getElementById("produtoValor").value;
        let qtd = document.getElementById("produtoQtd").value;

        if(!id) return alert("Selecione um produto");
        
        dadosOrdemServico.produtos.push({ id, nome, valor, qtd });
        renderizarTabelas();

        // Limpar
        document.getElementById("produtoIdSelecionado").value = "";
        document.getElementById("produtoNome").value = "";
        document.getElementById("produtoValor").value = "";
        document.getElementById("produtoQtd").value = "1";
    });

    // --- 4. LÓGICA DOS MODAIS DE BUSCA (Produto/Serviço/Equipamento) ---
    // (AQUI VOCÊ PRECISA COPIAR A MESMA LÓGICA DE BUSCA DO SEU ARQUIVO criarOs.js)
    // Exemplo para Equipamento:
    /*
    document.getElementById("btnFiltrarEquipamento").addEventListener("click", ...);
    function selecionarEquipamento(...) {
        document.getElementById("equipamentoIdSelecionado").value = id;
        document.getElementById("equipamentoNome").value = nome;
        dadosOrdemServico.equipamentoId = id;
    }
    */
    // **Importante:** Lembre-se de atualizar `dadosOrdemServico.equipamentoId` quando selecionar equipamento.


    // --- 5. SALVAR ALTERAÇÕES (SUBMIT) ---
    document.getElementById("btnSalvarAlteracoes").addEventListener("click", function() {
        
        // Atualiza campos finais
        dadosOrdemServico.descServico = document.getElementById("descServico").value;
        dadosOrdemServico.equipamentoId = document.getElementById("equipamentoIdSelecionado").value;

        fetch("/ordemServico/alterar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosOrdemServico) // Envia o objeto completo
        })
        .then(r => r.json())
        .then(resp => {
            if(resp.ok) {
                alert("OS Atualizada com Sucesso!");
                window.location.href = "/ordemServico/listar";
            } else {
                alert("Erro: " + resp.msg);
            }
        });
    });

    // --- LÓGICA DE BUSCA NOS MODAIS ---

    // 1. Busca SERVIÇO
    document.getElementById("btnFiltrarServico").addEventListener("click", function() {
        let termo = document.getElementById("termoBuscaServico").value;
        buscarGenerico(`/servico/pesquisar/${termo}`, "listaServicosResultados", (item) => `
            <td>${item.servicoId}</td>
            <td>${item.servicoDesc}</td>
            <td>R$ ${item.servicoValor}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-success btn-selecionar-servico"
                    data-id="${item.servicoId}" data-desc="${item.servicoDesc}" data-valor="${item.servicoValor}">
                    <i class="fa-solid fa-check"></i>
                </button>
            </td>
        `);
    });

    // Selecionar Serviço (Delegação de Evento)
    document.addEventListener("click", function(e) {
        const btn = e.target.closest(".btn-selecionar-servico");
        if(btn) {
            let d = btn.dataset;
            document.getElementById("servicoIdSelecionado").value = d.id;
            document.getElementById("servicoNome").value = d.desc;
            document.getElementById("servicoValor").value = d.valor;
            bootstrap.Modal.getInstance(document.getElementById('modalBuscaServico')).hide();
        }
    });

    // 2. Busca PRODUTO
    document.getElementById("btnFiltrarProduto").addEventListener("click", function() {
        let termo = document.getElementById("termoBuscaProduto").value;
        buscarGenerico(`/produto/pesquisar/${termo}`, "listaProdutosResultados", (item) => `
            <td>${item.nome}</td>
            <td>R$ ${item.valor}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-success btn-selecionar-produto"
                    data-id="${item.id}" data-nome="${item.nome}" data-valor="${item.valor}">
                    <i class="fa-solid fa-check"></i>
                </button>
            </td>
        `);
    });

    // Selecionar Produto
    document.addEventListener("click", function(e) {
        const btn = e.target.closest(".btn-selecionar-produto");
        if(btn) {
            let d = btn.dataset;
            document.getElementById("produtoIdSelecionado").value = d.id;
            document.getElementById("produtoNome").value = d.nome;
            document.getElementById("produtoValor").value = d.valor;
            document.getElementById("produtoQtd").value = "1";
            bootstrap.Modal.getInstance(document.getElementById('modalBuscaProduto')).hide();
        }
    });

    // 3. Busca EQUIPAMENTO
    document.getElementById("btnFiltrarEquipamento").addEventListener("click", function() {
        let termo = document.getElementById("termoBuscaEquipamento").value;
        buscarGenerico(`/equipamento/pesquisar/${termo}`, "listaEquipamentosResultados", (item) => `
            <td>${item.nome}</td>
            <td>${item.modelo}</td>
            <td>${item.estoque}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-success btn-selecionar-equipamento"
                    data-id="${item.id}" data-nome="${item.nome}" data-modelo="${item.modelo}">
                    <i class="fa-solid fa-check"></i>
                </button>
            </td>
        `);
    });

    // Selecionar Equipamento
    document.addEventListener("click", function(e) {
        const btn = e.target.closest(".btn-selecionar-equipamento");
        if(btn) {
            let d = btn.dataset;
            document.getElementById("equipamentoIdSelecionado").value = d.id;
            document.getElementById("equipamentoNome").value = `${d.nome} - ${d.modelo}`;
            // Atualiza direto no objeto global
            // (Se sua variavel global se chamar 'dadosOrdemServico', verifique o nome no inicio do arquivo)
            // dadosOrdemServico.equipamentoId = d.id; 
            bootstrap.Modal.getInstance(document.getElementById('modalBuscaEquipamento')).hide();
        }
    });

    // Função Auxiliar
    function buscarGenerico(url, tbodyId, templateFn) {
        const tbody = document.getElementById(tbodyId);
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">Buscando...</td></tr>';
        fetch(url).then(res => res.json()).then(data => {
            tbody.innerHTML = "";
            let lista = data.produtos || data.servicos || data.equipamentos || [];
            if(lista.length > 0) lista.forEach(item => tbody.innerHTML += templateFn(item));
            else tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nada encontrado.</td></tr>';
        }).catch(() => tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Erro.</td></tr>');
    }
});