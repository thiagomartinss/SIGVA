document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("buscar").addEventListener("click", carregarRelatorioPessoa);

    function carregarRelatorioPessoa() {
        let filtro = document.getElementById("filtroProd").value;
        let query = "";

        if (filtro != 0) {
            query = "?filtro=" + filtro;
        }
        fetch("/relatorio/pessoas" + query)
            .then(res => res.json())
            .then(retorno => {

                let lista = retorno.lista;
                let thead = document.getElementById("headPessoa");
                let tbody = document.getElementById("bodyPessoa");

                thead.innerHTML = `
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Documento</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Tipo</th>
                `;
                tbody.innerHTML = "";

                lista.forEach(p => {
                    let nome = p.nomePF ? p.nomePF : p.nomePJ;
                    let doc = p.cpf ? p.cpf : p.cnpj;

                    let tipo = "";
                    let classe = "";

                    if (p.ehCliente == 1) {
                        tipo = "Cliente";
                        classe = "text-success fw-bold";
                    }

                    if (p.ehFornecedor == 1) {
                        tipo = "Fornecedor";
                        classe = "text-primary fw-bold";
                    }

                    let tr = `
                        <tr>
                            <td>${p.pessoaId}</td>
                            <td>${nome}</td>
                            <td>${doc}</td>
                            <td>${p.email}</td>
                            <td>${p.telefone}</td>
                            <td class="${classe}">${tipo}</td>
                        </tr>
                    `;

                    tbody.innerHTML += tr;
                });
            });
    }
});
