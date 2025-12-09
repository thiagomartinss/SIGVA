document.addEventListener("DOMContentLoaded", function () {

    let carrinho = [];
    if (localStorage.getItem("carrinho") != null) {
        let carrinhoSerializado = localStorage.getItem("carrinho");
        carrinho = JSON.parse(carrinhoSerializado);
    }
    let contador = document.getElementById("contadorCarrinho");

    contador.innerText = carrinho.length;

    let btns = document.querySelectorAll(".addCar");
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", adicionarAoCarrinho);
    }
    document.addEventListener("show.bs.modal", renderCarrinho);
    function calcularValorCarrinho() {
        let soma = 0;
        for (let item of carrinho) {
            soma += (item.quantidade * item.preco);
        }

        document.getElementById("valorTotal").innerHTML = `<h3>Valor total: R$ ${soma}</h3`;
    }
    function renderCarrinho() {
        let html = "";

        if (carrinho.length > 0) {

            html = `<table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Imagem</th>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Valor unitário</th>                            
                                <th>Valor total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>`;

            for (let i = 0; i < carrinho.length; i++) {
                html += `<tr>
                                <td><img src="${carrinho[i].imagem}" width="80" /></td>                     
                                <td>${carrinho[i].nome}</td>
                                <td>
                                    <div style="display:flex;justify-content:space-evenly;">
                                        <button class="btn btn-light btnMais" data-id="${carrinho[i].id}"><i class="fas fa-plus"></i></button>
                                        <input style="width:70px;" class="form-control inputQtd" data-id="${carrinho[i].id}" type="text" value="${carrinho[i].quantidade}" />
                                        <button class="btn btn-light btnMenos" data-id="${carrinho[i].id}"><i class="fas fa-minus"></i></button>
                                    </div>
                                </td>
                                <td>R$ ${carrinho[i].preco}</td>
                                <td>R$ ${carrinho[i].quantidade * carrinho[i].preco}</td>
                                <td><button class="btn btn-danger btnDelete" data-id="${carrinho[i].id}"><i class="fas fa-trash"></i></button></td>
                            </tr>`;
            }

            html += `   </tbody>
                    </table>`;

            document.querySelector("#modalRender").innerHTML = html;// ??
            calcularValorCarrinho();

            ativaBotoesCarrinho();
        }
        else {
            html = "Carrinho vazio!";
            document.querySelector("#modalRender").innerHTML = html;
            contador.innerText = 0;
            calcularValorCarrinho();
        }
    }
    function adicionarAoCarrinho() {
        let produtoId = this.dataset.produto;
        let that = this;

        fetch("/produto/buscar/" + produtoId)
            .then(r => r.json())
            .then(corpo => {

                let produto = corpo.produto;
                console.log("bloco do prod:", produto);

                let spanErro = this.parentElement.querySelector(".erro-estoque");
                if (!spanErro) {
                    spanErro = document.createElement("span");
                    spanErro.classList.add("erro-estoque");
                    spanErro.style.color = "red";
                    spanErro.style.display = "block";
                    this.parentElement.appendChild(spanErro);
                }
                let estoque = produto.estoque ?? produto.qtd_estoque ?? produto.QTD_ESTOQUE ?? 0;

                if (estoque <= 0) {
                    spanErro.innerText = "Produto esgotado! (Estoque atual: 0)";
                    return;
                } else {
                    spanErro.innerText = "";
                }

                let produtoCarrinho = carrinho.filter(p => p.id == produto.id);

                if (produtoCarrinho.length == 0) {
                    produto.quantidade = 1;
                    carrinho.push(produto);
                } else {
                    produtoCarrinho[0].quantidade += 1;
                }
                localStorage.setItem("carrinho", JSON.stringify(carrinho));
                contador.innerText = carrinho.length;

                that.innerHTML = "<i class='fas fa-check'></i> Produto Adicionado ao carrinho!";
                setTimeout(() => {
                    that.innerHTML = '<i class="bi-cart-fill me-1"></i> Adicionar ao carrinho';
                }, 3000);
            });
    }
    function atualizaCarrinho() {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));

        contador.innerText = carrinho.length;

        renderCarrinho();
    }
    function ativaBotoesCarrinho() {
        const BtnMais = document.querySelectorAll(".btnMais");
        for (let i = 0; i < BtnMais.length; i++) {
            BtnMais[i].addEventListener("click", function () {
                let id = this.dataset.id;
                let item = carrinho.find(p => p.id == id);

                if (item.quantidade < 999) {
                    item.quantidade++;
                } else {
                    alert("Quantidade Maxima permitida é 999.")
                }

                atualizaCarrinho();
            })
        }
        const BtnMenos = document.querySelectorAll(".btnMenos");
        for (let i = 0; i < BtnMenos.length; i++) {
            BtnMenos[i].addEventListener("click", function () {
                let id = this.dataset.id;
                let item = carrinho.find(p => p.id == id);

                if (item.quantidade > 1) {
                    item.quantidade--;
                } else {
                    alert("A quantidade minima permitida é 1.");
                }

                atualizaCarrinho();
            })
        }
        const inputs = document.querySelectorAll(".inputQtd");
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener("change", function () {
                let id = this.dataset.id;
                let item = carrinho.find(p => p.id == id);
                //procura dentro do carrinho o 1 com esse id
                //entao para cada item camado p ele verifica se é igual ao id
                let valor = parseInt(this.value);

                if (isNaN(valor) || valor <= 0 || valor > 999) {
                    this.value = item.quantidade;

                    alert("A quantidade ddeve ser ente 1 e 999")
                    return
                }
                item.quantidade = valor;
                atualizaCarrinho();
            })
        }
        const btnDelete = document.querySelectorAll(".btnDelete");
        for (let i = 0; i < btnDelete.length; i++) {
            btnDelete[i].addEventListener("click", function () {
                let id = this.dataset.id;
                carrinho = carrinho.filter(p => p.id != id);
                //remove somente aquele item q for clicado com o filtro
                atualizaCarrinho();
            })
        }
    }

    document.getElementById("btnConfirmar").addEventListener("click", function () {
        if (carrinho.length <= 0) {
            document.getElementById("confirmMensagem").innerText =
                "Carrinho vazio!";
            const modalCarrinho = bootstrap.Modal.getInstance(document.getElementById('modalCarrinho'));
            modalCarrinho.hide();//fecha o modal do carrinoh
            setTimeout(() => {
                const modalConfirm = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
                modalConfirm.show();//abre o novo 

                document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
            }, 100);
        } else {
            const modalCarrinho = bootstrap.Modal.getInstance(document.getElementById('modalCarrinho'));
            modalCarrinho.hide();//fecha o modal

            setTimeout(() => {
                const modalConfirm = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
                modalConfirm.show();//abre o novo 

                document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
            }, 100);
        }
        carrinho = [];
        atualizaCarrinho();
    });


})