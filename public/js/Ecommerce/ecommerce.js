document.addEventListener("DOMContentLoaded", function () {

    let carrinho = [];

    if (localStorage.getItem("carrinho") != null) {
        let carSerial = localStorage.getItem("carrinho")
        carrinho = JSON.parse(carSerial);
    }

    let contador = document.getElementById("contadorCarrinho");
    contador.innerText = carrinho.length;

    let btns = document.querySelectorAll(".addCar");

    document.addEventListener("show.bs.offcanvas", renderCarrinho);

    document.getElementById("btnConfirmar").addEventListener("click", gravar);

    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", adicionarAoCarrinho);
    }
    //gravar:

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

            html = `<div class="lista-carrinho">`;

            for (let i = 0; i < carrinho.length; i++) {

                html += `
                <div class="item-carrinho border rounded p-2 mb-2 d-flex">
                    
                    <img src="${carrinho[i].imagem}" width="70" class="me-2 rounded"/>

                    <div style="flex:1">
                        <h5 class="mb-1">${carrinho[i].nome}</h5>

                        <div class="d-flex align-items-center mb-1">
                            <button class="btn btn-light btn-sm"><i class="fas fa-plus"></i></button>

                            <input class="form-control mx-2" 
                                   style="width:70px;" 
                                   type="text" 
                                   value="${carrinho[i].quantidade}" />

                            <button class="btn btn-light btn-sm"><i class="fas fa-minus"></i></button>
                        </div>

                        <div>
                            <span>Valor unitário: R$ ${carrinho[i].preco}</span><br>
                            <span>Total: <b>R$ ${carrinho[i].quantidade * carrinho[i].preco}</b></span>
                        </div>
                    </div>

                    <button class="btn btn-danger btn-sm ms-2">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            }

            html += `</div>`;

            document.querySelector(".offcanvas-body").innerHTML = html;
            calcularValorCarrinho();
        }
        else {
            document.querySelector(".offcanvas-body").innerHTML = "Carrinho vazio!";
        }
    }
    

});
