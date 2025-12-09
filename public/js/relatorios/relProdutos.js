document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("buscar").addEventListener("click", carregarRelatorioProdutos);

    function carregarRelatorioProdutos() {
        let filtro = document.getElementById("filtroProd").value;
        let query = "";

        if (filtro != 0) {
            query = "?filtro=" + filtro;
        }
        fetch("/relatorio/produtos" + query)
            .then(resposta => resposta.json())
            .then(corpo => {
                console.log(corpo);
                let html = "";

                if (corpo.lista.length > 0) {
                    for (let i = 0; i < corpo.lista.length; i++) {
                        let item = corpo.lista[i];
                        html += `
                            <tr>
                                <td>${item.id}</td>
                                <td>${item.sku}</td>
                                <td>${item.nome}</td>
                                <td>${item.marca}</td>
                                <td class="${filtro == 2 ? "coluna-destaque" : ""}">${item.tipo}</td>
                                <td class="${filtro == 1 ? "coluna-destaque" : ""}">${item.estoque}</td>
                                <td>R$${Number(item.valor).toFixed(2)}</td>
                            </tr>
                        `;
                    }
                } else {
                    html = ` <tr>
                                <td colspan="7" class="text-center">Nenhum resultado Encontrado</td>
                            </tr>`;
                }
                let tabela = document.getElementById("relProdutos");
                tabela.querySelector("tbody").innerHTML = html;
            });
    }
});