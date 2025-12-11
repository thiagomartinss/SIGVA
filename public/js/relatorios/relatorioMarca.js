document.addEventListener("DOMContentLoaded", function () {

    const btnBuscar = document.getElementById("buscar");

    btnBuscar.addEventListener("click", carregarRelatorioProdutos);

    function carregarRelatorioProdutos() {

        let filtro = document.getElementById("filtroProd").value;
        let query = filtro != 0 ? "?filtro=" + filtro : "";

        fetch("/relatorio/relatorioMarca" + query)
            .then(resposta => resposta.json())
            .then(corpo => {

                console.log(corpo);

                let html = "";

                if (corpo.lista.length > 0) {

                    for (let item of corpo.lista) {
                        html += `
                            <tr>
                                <td>${item.id}</td>
                                <td class="${filtro == 1 ? "coluna-destaque" : ""}">${item.marca}</td>
                                <td>${item.equipamento}</td>
                                <td>${item.descricao}</td>
                                <td>${item.cliente}</td>
                                <td>R$ ${Number(item.valor).toFixed(2)}</td>
                            </tr>
                        `;
                    }

                } else {
                    html = `
                        <tr>
                            <td colspan="6" class="text-center">Nenhum resultado encontrado</td>
                        </tr>`;
                }

                document.querySelector("#relProdutos tbody").innerHTML = html;
            });
    }
});
