document.addEventListener("DOMContentLoaded", function () {
    let msgProduto = document.querySelector("#msg-produto");
    let msgProdutoAlt = document.querySelector("#msg-produtoAlt");

    const modal = document.querySelector("#modalProduto");
    modal.addEventListener('show.bs.modal', event => {
        limparValidacao();
        limparFormulario();
    });

    const modalAlt = document.querySelector("#modalProdutoAlt");
    modalAlt.addEventListener('show.bs.modal', event => {
        limparValidacaoAlt();
    });

    let inputImg = document.getElementById("inputImagem");
    inputImg.addEventListener("change", previaImagem);

    const inputs = document.querySelectorAll(".form-control, .form-select");
    inputs.forEach(campo => {
        campo.addEventListener("input", verificarBorda);
    });

    function verificarBorda() {
        this.style.borderColor = "#ced4da"; 

        let bordaRed = false;
        
        inputs.forEach(c => {
            if (c.id === "inputImagem" || c.type === "file")
                return; 
    
            if (c.style.borderColor === "red")
                bordaRed = true;
        });

        if (bordaRed == false) 
            msgProduto.textContent = ""; 
    }

    document.getElementById("btnCadastrar").addEventListener("click", cadastrar);
    document.getElementById("btnAlterar").addEventListener("click", alterar);
    document.getElementById("btnExclusao").addEventListener("click", excluir);

    const botoesAlteracao = document.querySelectorAll(".btnAlteracao");

    botoesAlteracao.forEach(btn => {
        btn.addEventListener("click", function() {
            let produtoId = this.getAttribute("data-id");
            console.log(produtoId);
            fetch(`/produto/buscar/${produtoId}`)
            .then(r => r.json())
            .then(data => {
                if(data.ok && data.produto) {
                    console.log(data.produto);
                    document.getElementById("idProdutoAlt").value = data.produto.produtoId;
                    document.getElementById("tipoProdutoAlt").value = data.produto.tipoProdutoId;
                    document.getElementById("skuAlt").value = data.produto.produtoSku;
                    document.getElementById("nomeProdutoAlt").value = data.produto.produtoNome;
                    document.getElementById("marcaProdutoAlt").value = data.produto.marcaId;
                    document.getElementById("vlCompraProdutoAlt").value = data.produto.valorCompra;
                    document.getElementById("vlVendaProdutoAlt").value = data.produto.valorVenda;
                    document.getElementById("qtdProdutoAlt").value = data.produto.qtdEstoque;

                    let divPreviaAlt = document.getElementById("divPreviaAlt");
                    let imgPreviaAlt = document.getElementById("previaImagemAlt");

                    if (data.produto.produtoImagem && data.produto.produtoImagem.trim() !== "") {
                        imgPreviaAlt.src = `/img/produtos/${data.produto.produtoImagem}`;
                        divPreviaAlt.style.display = "block"; 
                    } else {
                        imgPreviaAlt.src = "";
                        divPreviaAlt.style.display = "none";
                    }
                } else 
                    alert(data.msg || "Erro ao buscar produto");
            })
            .catch(error => {
                console.error("Erro na requisição fetch:", error);
                alert("Não foi possível carregar os dados para edição, tente novamente mais tarde.");
            });
        });
    });

    const botoesExclusao = document.querySelectorAll(".btnExclusao");
    
    botoesExclusao.forEach(btn => {
        btn.addEventListener("click", function() {
            let dados = this.dataset;

            document.getElementById("codigoExclusao").textContent = dados.id;
            document.getElementById("skuExclusao").textContent = dados.sku;
            document.getElementById("nomeExclusao").textContent = dados.nome;
            document.getElementById("marcaExclusao").textContent = dados.marca; 
            document.getElementById("tipoExclusao").textContent = dados.tipo;
            document.getElementById("qtdExclusao").textContent = dados.estoque;
            document.getElementById("vlVendaExclusao").textContent = dados.venda;
            document.getElementById("vlCompraExclusao").textContent = dados.compra;
            document.getElementById("idProdutoExcluir").value = dados.id;

            let divImagem = document.getElementById("divPreviaDel");
            let imgElement = document.getElementById("imgPreviaDel");

            if (dados.imagem && dados.imagem.trim() !== "") {
                imgElement.src = `/img/produtos/${dados.imagem}`;
                divImagem.style.display = "block"; 
            } else {
                imgElement.src = "";
                divImagem.style.display = "none";  
            }
        });
    });

    function limparFormulario() {
        document.getElementById("tipoProduto").value = "";
        document.getElementById("nomeProduto").value = "";
        document.getElementById("sku").value = "";
        document.getElementById("marcaProduto").value = "";
        document.getElementById("vlCompraProduto").value = "";
        document.getElementById("vlVendaProduto").value = "";
        document.getElementById("qtdProduto").value = "";
        document.getElementById("inputImagem").value = "";
        document.getElementById("divPrevia").style.display = "none";
    }

    function limparValidacao() {
        document.getElementById("tipoProduto").style["border-color"] = "#ced4da";
        document.getElementById("nomeProduto").style["border-color"] = "#ced4da";
        document.getElementById("sku").style["border-color"] = "#ced4da";
        document.getElementById("marcaProduto").style["border-color"] = "#ced4da";
        document.getElementById("vlCompraProduto").style["border-color"] = "#ced4da";
        document.getElementById("vlVendaProduto").style["border-color"] = "#ced4da";
        document.getElementById("qtdProduto").style["border-color"] = "#ced4da";
        msgProduto.textContent = "";
    }

     function limparValidacaoAlt() {
        document.getElementById("tipoProdutoAlt").style["border-color"] = "#ced4da";
        document.getElementById("nomeProdutoAlt").style["border-color"] = "#ced4da";
        document.getElementById("skuAlt").style["border-color"] = "#ced4da";
        document.getElementById("marcaProdutoAlt").style["border-color"] = "#ced4da";
        document.getElementById("vlCompraProdutoAlt").style["border-color"] = "#ced4da";
        document.getElementById("vlVendaProdutoAlt").style["border-color"] = "#ced4da";
        document.getElementById("qtdProdutoAlt").style["border-color"] = "#ced4da";
        msgProduto.textContent = "";
    }

    function cadastrar() {
        limparValidacao();
        let tipoId = document.getElementById("tipoProduto").value;
        let nome = document.getElementById("nomeProduto").value;
        let sku = document.getElementById("sku").value.toUpperCase();
        let vlCompra = document.getElementById("vlCompraProduto").value;
        let vlVenda = document.getElementById("vlVendaProduto").value;
        let marcaId = document.getElementById("marcaProduto").value;
        let qtdEstoque = document.getElementById("qtdProduto").value;
        let inputImagem = document.getElementById("inputImagem");

        let listaErros = [];
        if (tipoId.trim() === "")
            listaErros.push("tipoProduto");
        if (nome.trim() === "")
            listaErros.push("nomeProduto");
        if(sku.trim()=== "")
            listaErros.push("sku");
        if (vlCompra.trim() === "")
            listaErros.push("vlCompraProduto");
        if (vlVenda.trim() === "")
            listaErros.push("vlVendaProduto");
        if (marcaId.trim() === "")
            listaErros.push("marcaProduto");
        if (qtdEstoque.trim() === "")
            listaErros.push("qtdProduto");

        if (listaErros.length == 0) {
            let formData = new FormData();
            formData.append("tipoId", tipoId.trim());
            formData.append("nome", nome.trim());
            formData.append("sku", sku.trim());
            formData.append("vlCompra", vlCompra.trim());
            formData.append("vlVenda", vlVenda.trim());
            formData.append("marcaId", marcaId.trim());
            formData.append("qtdEstoque", qtdEstoque.trim());
            if (inputImagem.files.length > 0) 
                formData.append("imagem", inputImagem.files[0]);
        
            fetch("/produto/cadastrar", {
                method: 'POST',
                body: formData
            })
                .then(r => {
                    return r.json();
                })
                .then(r => {
                    if (r.ok) {
                        window.location.href = "/produto";
                    } else {
                        msgProduto.textContent = r.msg;
                    }
                })
        } else {
            if (listaErros.includes("tipoProduto"))
                document.getElementById("tipoProduto").style["border-color"] = "red";
            if (listaErros.includes("nomeProduto"))
                document.getElementById("nomeProduto").style["border-color"] = "red";
            if (listaErros.includes("sku"))
                document.getElementById("sku").style["border-color"] = "red";
            if (listaErros.includes("vlCompraProduto"))
                document.getElementById("vlCompraProduto").style["border-color"] = "red";
            if (listaErros.includes("vlVendaProduto"))
                document.getElementById("vlVendaProduto").style["border-color"] = "red";
            if (listaErros.includes("marcaProduto"))
                document.getElementById("marcaProduto").style["border-color"] = "red";
            if (listaErros.includes("qtdProduto"))
                document.getElementById("qtdProduto").style["border-color"] = "red";
            msgProduto.textContent = "Preencha os campos em vermelho";
        }
    }

    function alterar(){
        limparValidacaoAlt();

        let id = document.getElementById("idProdutoAlt").value;
        let tipoId = document.getElementById("tipoProdutoAlt").value;
        let nome = document.getElementById("nomeProdutoAlt").value;
        let sku = document.getElementById("skuAlt").value.toUpperCase();
        let vlCompra = document.getElementById("vlCompraProdutoAlt").value;
        let vlVenda = document.getElementById("vlVendaProdutoAlt").value;
        let marcaId = document.getElementById("marcaProdutoAlt").value;
        let qtdEstoque = document.getElementById("qtdProdutoAlt").value;
        let inputImagem = document.getElementById("inputImagemAlt");


        let listaErros = [];
        if (tipoId.trim() === "")
            listaErros.push("tipoProdutoAlt");
        if (nome.trim() === "")
            listaErros.push("nomeProdutoAlt");
        if(sku.trim()=== "")
            listaErros.push("skuAlt");
        if (vlCompra.trim() === "")
            listaErros.push("vlCompraProdutoAlt");
        if (vlVenda.trim() === "")
            listaErros.push("vlVendaProdutoAlt");
        if (marcaId.trim() === "")
            listaErros.push("marcaProdutoAlt");
        if (qtdEstoque.trim() === "")
            listaErros.push("qtdProdutoAlt");


        if (listaErros.length == 0) {
            let formData = new FormData();
            formData.append("id", id);
            formData.append("tipoIdAlt", tipoId.trim());
            formData.append("nomeAlt", nome.trim());
            formData.append("skuAlt", sku.trim());
            formData.append("vlCompraAlt", vlCompra.trim());
            formData.append("vlVendaAlt", vlVenda.trim());
            formData.append("marcaIdAlt", marcaId.trim());
            formData.append("qtdEstoqueAlt", qtdEstoque.trim());
            if (inputImagem.files.length > 0) 
                formData.append("imagem", inputImagem.files[0]);
            
            fetch("/produto/alterar", {
                method: 'POST',
                body: formData
            })
            .then(r => {
                return r.json();
            })
            .then(r => {
                if (r.ok) {
                    window.location.href = "/produto";
                } else {
                    msgProdutoAlt.textContent = r.msg;
                }
            })
        } else {
            if (listaErros.includes("tipoProdutoAlt"))
                document.getElementById("tipoProdutoAlt").style["border-color"] = "red";
            if (listaErros.includes("nomeProdutoAlt"))
                document.getElementById("nomeProdutoAlt").style["border-color"] = "red";
            if (listaErros.includes("skuAlt"))
                 document.getElementById("skuAlt").style["border-color"] = "red";
            if (listaErros.includes("vlCompraProdutoAlt"))
                document.getElementById("vlCompraProdutoAlt").style["border-color"] = "red";
            if (listaErros.includes("vlVendaProdutoAlt"))
                document.getElementById("vlVendaProdutoAlt").style["border-color"] = "red";
            if (listaErros.includes("marcaProdutoAlt"))
                document.getElementById("marcaProdutoAlt").style["border-color"] = "red";
            if (listaErros.includes("qtdProdutoAlt"))
                document.getElementById("qtdProdutoAlt").style["border-color"] = "red";

            msgProdutoAlt.textContent = "Preencha os campos em vermelho";
        }
    }

    function excluir() {
        let id = document.getElementById("idProdutoExcluir").value;

        if (id) {
            fetch('/produto/excluir', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id })
            })
            .then(r => r.json())
            .then(r => {
                if (r.ok) {
                    window.location.reload(); 
                } else {
                    document.getElementById("msg-produtoExc").textContent = r.msg;
                }
            });
        }
    }

    function previaImagem() {
        console.log(this.files);
        if (this.files.length > 0) {
            let img = document.getElementById("previaImagem");
            let urlImg = URL.createObjectURL(this.files[0]);
            img.src = urlImg;
            document.getElementById("divPrevia").style.display = "block";
        }
    }
})