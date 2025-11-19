document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('checkEquipamento').addEventListener('change', function () {
        const div = document.getElementById('divEquipamento');
        const qntd = document.querySelectorAll("#quantidadeCheck");
        if (this.checked) {
            div.style.display = 'block';
            qntd.style.display = 'block'
        } else {
            div.style.display = 'none';
            qntd.style.display = 'none';
        }


    });


    document.getElementById('checkProdutos').addEventListener('change', function () {
        const divProdutos = document.getElementById('divProdutos');
        if (this.checked) {
            divProdutos.style.display = 'block';
        } else {
            divProdutos.style.display = 'none';
        }
    });


    const checkQuant = document.querySelectorAll('.equipamento-checkbox');//EQUIPAMENTOS
    function quantEquip(checkbox) {
        const id = checkbox.dataset.id;//pega o id do equipamentos selecionado
        const wrapp = document.getElementById("equip-wrapp" + id);
        const input = document.getElementById("equip-quant" + id);

        if (checkbox.checked) {
            wrapp.style.display = "block";
            input.required = true;
        } else {
            wrapp.style.display = "none";
            input.required = false;
            input.value = "";
        }
    }
    checkQuant.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            quantEquip(checkbox);
        });
    });

    const checkQuantP = document.querySelectorAll('.produto-checkbox');///PRODUTOS
    function quantProd(checkbox) {
        const id = checkbox.dataset.id;
        const wrapp = document.getElementById("prod-wrapp" + id);
        const input = document.getElementById("prod-quant" + id);

        if (checkbox.checked) {
            wrapp.style.display = "block";
            input.required = true;
        } else {
            wrapp.style.display = "none";
            input.required = false;
            input.value = "";
        }
    }
    checkQuantP.forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            quantProd(checkbox);
        });
    });
    //DROPDOW  pessoas: segundo fulvio

    const BtnDrop = document.getElementById("PessoaBtn");
    const dropMenu=document.getElementById("PessoaMenu");
    const pesquisaInput=document.getElementById("pesquisaPessoa");
    const itens=document.getElementById("dropPessoaItem");
    const inputId=document.getElementById("pessoaId");

    BtnDrop.addEventListener("click",function(){
        dropMenu.classList.toggle("show");
        pesquisaInput.value="";
        filtragem("");
        pesquisaInput.focus();
    });
    pesquisaInput.addEventListener("input",function(e){
        filtragem(e.target.value);
    });
    function filtragem(filter){
        const itensC = itens.querySelectorAll(".dropdown-item");
        let visivel=0;
        itensC.forEach(function(item){
            if(item.textContent.toLowerCase().includes(filter.toLowerCase())){
                item.style.display="block"
                visivel++;
            }else{
                item.style.display="none"
            }
        });
        if(visivel===0){
            itens.innerHTML="<div class='text-danger px-2' >Nenhum Resultado encontrado</div>"

        }else{
            if(itens.querySelector('.text-muted')){
                itens.querySelector('.text-muted').remove();
            }
        }
    }
    itens.addEventListener("click",function(e){//escolhendo uma opçao
        if(e.target.classList.contains("dropdown-item")){
            BtnDrop.textContent=e.target.textContent;
            inputId.value=e.target.dataset.id;
            dropMenu.classList.remove("show");
        }
    });
    //fehcando o drop se clicar fora
    document.addEventListener("click",function(e){
        if(!dropMenu.contains(e.target)&& !BtnDrop.contains(e.target)){
            dropMenu.classList.remove("show");
        }
    });

});