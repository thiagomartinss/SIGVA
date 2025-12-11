document.addEventListener("DOMContentLoaded", function () {

    const formOS = document.getElementById("formOS");
    const btnCancelar = document.getElementById("btnCancelar");
    
    let dadosOrdemServico = {
        clienteId: null,
        clienteEnderecoId: null,
        descServico: "",
        equipamentoId: null,
        equipamentoQtd: 1,
        status: "EM ABERTO",
        //dt_abertura: null,
        servicos: [],
        produtos: [] 
    };

    // Modais 
    const modais = document.querySelectorAll('.modal');
    const todosModaisFoco = document.querySelectorAll('.modal');
    const inputsPesquisa = document.querySelectorAll('.modal-body input[type="text"]');

    // Cliente
    const btnFiltrarCliente = document.getElementById("btnFiltrarCliente");
    const inputBuscaCliente = document.getElementById("termoBuscaCliente");
    const tabelaClientes = document.getElementById("listaClientesResultados");
    // Inputs Cliente
    const inputClienteId = document.getElementById("clienteId");
    const inputClienteEnderecoId = document.getElementById("clienteEnderecoId");
    const inputClienteNome = document.getElementById("clienteNome");
    const inputClienteCep = document.getElementById("clienteCep");
    const inputClienteLogradouro = document.getElementById("clienteLogradouro");
    const inputClienteNumero = document.getElementById("clienteNumero");
    const inputClienteBairro = document.getElementById("clienteBairro");
    const inputClienteCidade = document.getElementById("clienteCidade");
    const inputClienteEstado = document.getElementById("clienteEstado");

    // Serviço
    const btnFiltrarServico = document.getElementById("btnFiltrarServico");
    const inputBuscaServico = document.getElementById("termoBuscaServico");
    const tabelaServicosRes = document.getElementById("listaServicosResultados");
    const inputServicoId = document.getElementById("servicoIdSelecionado");
    const inputServicoNome = document.getElementById("servicoNome");
    const inputServicoValor = document.getElementById("servicoValor");
    const btnAdicionarServico = document.getElementById("btnAdicionarServico");
    const tabelaServicosAdicionados = document.getElementById("listaServicosAdicionados");

    // Equipamento 
    const btnFiltrarEquipamento = document.getElementById("btnFiltrarEquipamento");
    const inputBuscaEquipamento = document.getElementById("termoBuscaEquipamento");
    const tabelaEquipamentosRes = document.getElementById("listaEquipamentosResultados");
    const inputEquipamentoId = document.getElementById("equipamentoIdSelecionado"); 
    const inputEquipamentoNome = document.getElementById("equipamentoNome");
    const inputEquipamentoQtd = document.getElementById("equipamentoQtd");

    // Produto
    const btnFiltrarProduto = document.getElementById("btnFiltrarProduto");
    const inputBuscaProduto = document.getElementById("termoBuscaProduto");
    const tabelaProdutosRes = document.getElementById("listaProdutosResultados");
    const inputProdutoId = document.getElementById("produtoIdSelecionado");
    const inputProdutoNome = document.getElementById("produtoNome");
    const inputProdutoValor = document.getElementById("produtoValor");
    const inputProdutoQtd = document.getElementById("produtoQtd");
    const btnAdicionarProduto = document.getElementById("btnAdicionarProduto");
    const tabelaProdutosAdicionados = document.getElementById("listaProdutosAdicionados");


    modais.forEach(modal => {
        modal.addEventListener('show.bs.modal', function () {
            const inputs = modal.querySelectorAll('input[type="text"]');
            inputs.forEach(input => input.value = '');
            const tbodys = modal.querySelectorAll('tbody');
            tbodys.forEach(body => body.innerHTML = '');
        });

        modal.addEventListener('hidden.bs.modal', function () {
            document.body.classList.remove('modal-open');
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0';

            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
        });

        modal.addEventListener('shown.bs.modal', function () {
            const inputPesquisa = modal.querySelector('input[type="text"]');
            if (inputPesquisa) 
                inputPesquisa.focus();
        });
    });

    inputsPesquisa.forEach(input => {
        input.classList.add('input-uppercase');
    });

    if (btnCancelar) {
        btnCancelar.addEventListener("click", function () {
            if (confirm("Tem certeza que deseja a gereção da ordem de serviço?")) {
                inputClienteId.value = "";
                inputClienteEnderecoId.value = "";
                inputClienteNome.value = "";
                inputClienteCep.value = "";
                inputClienteLogradouro.value = "";
                inputClienteNumero.value = "";
                inputClienteBairro.value = "";
                inputClienteCidade.value = "";
                inputClienteEstado.value = "";

                inputServicoId.value = "";
                inputServicoNome.value = "";
                inputServicoValor.value = "";
                tabelaServicosAdicionados.innerHTML = "";

                inputEquipamentoId.value = "";
                inputEquipamentoNome.value = "";
                if(inputEquipamentoQtd) inputEquipamentoQtd.value = "1";

                inputProdutoId.value = "";
                inputProdutoNome.value = "";
                inputProdutoValor.value = "";
                inputProdutoQtd.value = "1";
                tabelaProdutosAdicionados.innerHTML = "";
            }
        });
    }

    if (formOS) {
        formOS.addEventListener("submit", function (e) {
            e.preventDefault();

            const inputDesc = document.getElementById("descServico");
            dadosOrdemServico.descServico = inputDesc.value ? inputDesc.value.trim().toUpperCase() : "";

            
            if (!dadosOrdemServico.clienteId) {
                alert("Selecione um cliente antes de gerar a Ordem de Serviço!");
                return;
            }

            if (!dadosOrdemServico.descServico) {
                alert("Por favor, informe a descrição do serviço.");
                return;
            }

            console.log("Dados da ordem:", dadosOrdemServico);

            
            fetch("/ordemServico/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(dadosOrdemServico) 
            })
            .then(res => res.json())
            .then(response => {
                if (response.ok) {
                    alert("Ordem de Serviço gerada com sucesso! ID: " + response.idOs);
                    window.location.href = "/ordemServico/criar"; 
                } else {
                    alert("Erro ao gerar OS: " + response.msg);
                }
            })
            .catch(err => {
                console.error(err);
                alert("Erro de conexão ao salvar.");
            });
        });
    }

    /* ---  CLIENTE --- */

    if (btnFiltrarCliente) 
        btnFiltrarCliente.addEventListener("click", listarClientes);

    if (inputBuscaCliente) {
        inputBuscaCliente.addEventListener("keypress", (e) => {
            if (e.key === "Enter") listarClientes();
        });
    }

    function listarClientes() {
        let termo = inputBuscaCliente.value.trim().toUpperCase();
        tabelaClientes.innerHTML = '<tr><td colspan="4" class="text-center">Buscando...</td></tr>';

        if (termo === "") {
            tabelaClientes.innerHTML = '<tr><td colspan="4" class="text-center">Digite algo para pesquisar.</td></tr>';
            return;
        }

        fetch(`/pessoa/pesquisar/${termo}`)
            .then(res => res.json())
            .then(data => {
                tabelaClientes.innerHTML = "";
                if (data.pessoas && data.pessoas.length > 0) {
                    data.pessoas.forEach(cliente => {
                        let row = document.createElement("tr");
                        let endId = cliente.ID_ENDERECO || ""; 
                        
                        row.innerHTML = `
                            <td>${cliente.NOME_CLIENTE}</td>
                            <td>${cliente.DOCUMENTO}</td>
                            <td>${cliente.CIDADE} / ${cliente.ESTADO}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-success btn-selecionar-cliente" 
                                    data-id="${cliente.ID_PESSOA}"
                                    data-endereco-id="${endId}"
                                    data-nome="${cliente.NOME_CLIENTE}"
                                    data-cep="${cliente.CEP}"
                                    data-logradouro="${cliente.LOGRADOURO}"
                                    data-numero="${cliente.NUMERO}"
                                    data-bairro="${cliente.BAIRRO}"
                                    data-cidade="${cliente.CIDADE}"
                                    data-estado="${cliente.ESTADO}"
                                >
                                    <i class="fa-solid fa-check"></i>
                                </button>
                            </td>
                        `;
                        tabelaClientes.appendChild(row);
                    });
                    document.querySelectorAll(".btn-selecionar-cliente").forEach(btn => {
                        btn.addEventListener("click", selecionarCliente);
                    });
                } else {
                    tabelaClientes.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum cliente encontrado.</td></tr>';
                }
            })
            .catch(err => {
                console.error(err);
                tabelaClientes.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Erro na busca.</td></tr>';
            });
    }

    function selecionarCliente(e) {
        let btn = e.target.closest("button");
        let dados = btn.dataset;

        inputClienteId.value = dados.id;
        inputClienteEnderecoId.value = dados.enderecoId;
        inputClienteNome.value = dados.nome;
        inputClienteCep.value = dados.cep;
        inputClienteLogradouro.value = dados.logradouro;
        inputClienteNumero.value = dados.numero;
        inputClienteBairro.value = dados.bairro;
        inputClienteCidade.value = dados.cidade;
        inputClienteEstado.value = dados.estado;

        dadosOrdemServico.clienteId = dados.id;
        dadosOrdemServico.clienteEnderecoId = dados.enderecoId;

        const modalEl = document.getElementById('modalBuscaCliente');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
    }

    /* ---  SERVIÇO  --- */

    if (btnFiltrarServico) 
        btnFiltrarServico.addEventListener("click", listarServicos);

    if (inputBuscaServico) {
        inputBuscaServico.addEventListener("keypress", (e) => {
            if (e.key === "Enter") listarServicos();
        });
    }

    if (btnAdicionarServico) {
        btnAdicionarServico.addEventListener("click", function () {
            let id = inputServicoId.value;
            let nome = inputServicoNome.value;
            let valor = inputServicoValor.value;

            if (!id || !nome) {
                alert("Selecione um serviço na lupa primeiro!");
                return;
            }
            if (!valor) {
                alert("Informe um valor.");
                return;
            }
            let objetoServico = {
                id: id,             
                valor: valor        
            };

            let row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    ${nome}
                    <input type="hidden" name="servicos[id][]" value="${id}">
                </td>
                <td>
                    R$ ${parseFloat(valor).toFixed(2)}
                    <input type="hidden" name="servicos[valor][]" value="${valor}">
                </td>
                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-danger btn-remover-item">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            dadosOrdemServico.servicos.push(objetoServico);
            console.log("Serviço adicionado:", dadosOrdemServico);
            tabelaServicosAdicionados.appendChild(row);
            atualizarValorTotal();
            inputServicoId.value = "";
            inputServicoNome.value = "";
            inputServicoValor.value = "";
            row.querySelector(".btn-remover-item").addEventListener("click", () => row.remove());
        });
    }

    function listarServicos() {
        let termo = inputBuscaServico.value.trim().toUpperCase();
        tabelaServicosRes.innerHTML = '<tr><td colspan="4" class="text-center">Buscando...</td></tr>';

        if (termo === "") {
            tabelaServicosRes.innerHTML = '<tr><td colspan="4" class="text-center">Digite o nome.</td></tr>';
            return;
        }

        fetch(`/servico/pesquisar/${termo}`)
            .then(res => res.json())
            .then(data => {
                tabelaServicosRes.innerHTML = "";
                if (data.servicos && data.servicos.length > 0) {
                    data.servicos.forEach(serv => {
                        let valorF = parseFloat(serv.servicoValor).toFixed(2);
                        let row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${serv.servicoId}</td>
                            <td>${serv.servicoDesc}</td>
                            <td>R$ ${valorF}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-success btn-selecionar-servico"
                                    data-id="${serv.servicoId}"
                                    data-desc="${serv.servicoDesc}"
                                    data-valor="${valorF}">
                                    <i class="fa-solid fa-check"></i>
                                </button>
                            </td>
                        `;
                        tabelaServicosRes.appendChild(row);
                    });
                    document.querySelectorAll(".btn-selecionar-servico").forEach(btn => {
                        btn.addEventListener("click", selecionarServico);
                    });
                } else {
                    tabelaServicosRes.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum serviço encontrado.</td></tr>';
                }
            })
            .catch(err => {
                console.error(err);
                tabelaServicosRes.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Erro na busca.</td></tr>';
            });
    }

    function selecionarServico(e) {
        let btn = e.target.closest("button");
        let dados = btn.dataset;
        inputServicoId.value = dados.id;
        inputServicoNome.value = dados.desc;
        inputServicoValor.value = dados.valor;
        const modalEl = document.getElementById('modalBuscaServico');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        
        if (modalInstance) 
            modalInstance.hide();
    }


    /* ---  EQUIPAMENTO  --- */

    if (btnFiltrarEquipamento) 
        btnFiltrarEquipamento.addEventListener("click", listarEquipamentos);
    
    if (inputBuscaEquipamento) {
        inputBuscaEquipamento.addEventListener("keypress", (e) => {
            if (e.key === "Enter") listarEquipamentos();
        });
    }

    function listarEquipamentos() {
        let termo = inputBuscaEquipamento.value.trim().toUpperCase();
        tabelaEquipamentosRes.innerHTML = '<tr><td colspan="4" class="text-center">Buscando...</td></tr>';

        if (termo === "") {
            tabelaEquipamentosRes.innerHTML = '<tr><td colspan="4" class="text-center">Digite modelo ou nome.</td></tr>';
            return;
        }

        fetch(`/equipamento/pesquisar/${termo}`)
            .then(res => res.json())
            .then(data => {
                tabelaEquipamentosRes.innerHTML = "";
                if (data.equipamentos && data.equipamentos.length > 0) {
                    data.equipamentos.forEach(eq => {
                        let row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${eq.nome}</td>
                            <td>${eq.modelo}</td>
                            <td>${eq.estoque}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-success btn-selecionar-equipamento"
                                    data-id="${eq.id}"
                                    data-nome="${eq.nome}"
                                    data-modelo="${eq.modelo}">
                                    <i class="fa-solid fa-check"></i>
                                </button>
                            </td>
                        `;
                        tabelaEquipamentosRes.appendChild(row);
                    });
                    document.querySelectorAll(".btn-selecionar-equipamento").forEach(btn => {
                        btn.addEventListener("click", selecionarEquipamento);
                    });
                } else {
                    tabelaEquipamentosRes.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum equipamento encontrado.</td></tr>';
                }
            })
            .catch(err => {
                console.error(err);
                tabelaEquipamentosRes.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Erro na busca.</td></tr>';
            });
    }

    function selecionarEquipamento(e) {
        let btn = e.target.closest("button");
        let dados = btn.dataset;
        inputEquipamentoId.value = dados.id;
        inputEquipamentoNome.value = `${dados.nome} - ${dados.modelo}`;

        dadosOrdemServico.equipamentoId = dados.id;
        
        const modalEl = document.getElementById('modalBuscaEquipamento');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) 
            modalInstance.hide();
    }

    if (btnFiltrarProduto) 
        btnFiltrarProduto.addEventListener("click", listarProdutos);

    if (inputBuscaProduto) {
        inputBuscaProduto.addEventListener("keypress", (e) => {
            if (e.key === "Enter") listarProdutos();
        });
    }

    if (btnAdicionarProduto) {
        btnAdicionarProduto.addEventListener("click", function () {
            let id = inputProdutoId.value;
            let nome = inputProdutoNome.value;
            let valor = inputProdutoValor.value;
            let qtd = inputProdutoQtd.value;

            if (!id || !nome) {
                alert("Selecione um produto primeiro!");
                return;
            }
            if (!valor || !qtd || parseInt(qtd) <= 0) {
                alert("Verifique valor e quantidade.");
                return;
            }
            let objetoProduto = {
                id: id,           
                valor: valor,     
                qtd: qtd          
            };

            let subtotal = (parseFloat(valor) * parseInt(qtd)).toFixed(2);
            let valorUnit = parseFloat(valor).toFixed(2);

            let row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    ${nome}
                    <input type="hidden" name="produtos[id][]" value="${id}">
                </td>
                <td>
                    R$ ${valorUnit}
                    <input type="hidden" name="produtos[valor][]" value="${valor}">
                </td>
                <td class="text-center">
                    ${qtd}
                    <input type="hidden" name="produtos[qtd][]" value="${qtd}">
                </td>
                <td>R$ ${subtotal}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-danger btn-remover-item">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;

            dadosOrdemServico.produtos.push(objetoProduto);
            console.log("Produto adicionado:", dadosOrdemServico);
            tabelaProdutosAdicionados.appendChild(row);
            atualizarValorTotal();
            inputProdutoId.value = "";
            inputProdutoNome.value = "";
            inputProdutoValor.value = "";
            inputProdutoQtd.value = "1";
            row.querySelector(".btn-remover-item").addEventListener("click", () => row.remove());
        });
    }

    function listarProdutos() {
        let termo = inputBuscaProduto.value.trim().toUpperCase();
        tabelaProdutosRes.innerHTML = '<tr><td colspan="3" class="text-center">Buscando...</td></tr>';

        if (termo === "") {
            tabelaProdutosRes.innerHTML = '<tr><td colspan="3" class="text-center">Digite o nome.</td></tr>';
            return;
        }

        fetch(`/produto/pesquisar/${termo}`)
            .then(res => res.json())
            .then(data => {
                tabelaProdutosRes.innerHTML = "";
                if (data.produtos && data.produtos.length > 0) {
                    data.produtos.forEach(prod => {
                        let valorF = parseFloat(prod.valor).toFixed(2);
                        let row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${prod.nome}</td>
                            <td>R$ ${valorF}</td>
                            <td class="text-center">
                                <button class="btn btn-sm btn-success btn-selecionar-produto"
                                    data-id="${prod.id}"
                                    data-nome="${prod.nome}"
                                    data-valor="${valorF}">
                                    <i class="fa-solid fa-check"></i>
                                </button>
                            </td>
                        `;
                        tabelaProdutosRes.appendChild(row);
                    });
                    document.querySelectorAll(".btn-selecionar-produto").forEach(btn => {
                        btn.addEventListener("click", selecionarProduto);
                    });
                } else {
                    tabelaProdutosRes.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum produto encontrado.</td></tr>';
                }
            })
            .catch(err => {
                console.error(err);
                tabelaProdutosRes.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Erro na busca.</td></tr>';
            });
    }

    function selecionarProduto(e) {
        let btn = e.target.closest("button");
        let dados = btn.dataset;
        inputProdutoId.value = dados.id;
        inputProdutoNome.value = dados.nome;
        inputProdutoValor.value = dados.valor;
        inputProdutoQtd.value = "1";
        const modalEl = document.getElementById('modalBuscaProduto');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
    }

    function atualizarValorTotal() {
        let total = 0;

        const inputsValorServico = document.querySelectorAll('input[name="servicos[valor][]"]');
        inputsValorServico.forEach(input => {
            let valor = parseFloat(input.value);
            if (!isNaN(valor)) total += valor;
        });

        const linhasProdutos = document.querySelectorAll('#listaProdutosAdicionados tr');
        linhasProdutos.forEach(row => {
            const inputValor = row.querySelector('input[name="produtos[valor][]"]');
            const inputQtd = row.querySelector('input[name="produtos[qtd][]"]');
            
            if (inputValor && inputQtd) {
                let valor = parseFloat(inputValor.value);
                let qtd = parseInt(inputQtd.value);
                if (!isNaN(valor) && !isNaN(qtd)) {
                    total += (valor * qtd);
                }
            }
        });

        const labelTotal = document.getElementById("labelValorTotal");
        if (labelTotal) {
            labelTotal.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    }
});