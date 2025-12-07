function abrirModalOrcamento(id, nome, precoBase) {
    document.getElementById("orc_servico_id").value = id;
    document.getElementById("orc_servico").value = nome;
    document.getElementById("orc_preco_base").value = precoBase;

    limparFormOrcamento();

    const modal = new bootstrap.Modal(document.getElementById('modalOrcamento'));
    modal.show();
}

function limparFormOrcamento() {
    document.getElementById("orc_email").value = "";
    document.getElementById("orc_areaTotal").value = "";
    document.getElementById("orc_obs").value = "";

    const res = document.getElementById("resultadoOrcamento");
    res.classList.add("d-none");
    res.innerHTML = "";
}

function obterMultiplicador(areaFaixa) {
    switch (areaFaixa) {
        case "1-5": return 1.00;
        case "5-20": return 1.20;
        case "20-50": return 1.40;
        case "50-100": return 1.60;
        case "100+": return 2.00;
        default: return 1;
    }
}

document.getElementById("orc_areaTotal").addEventListener("change", calcularOrcamento);

function calcularOrcamento() {
    const precoBase = parseFloat(document.getElementById("orc_preco_base").value);
    const faixa = document.getElementById("orc_areaTotal").value;


    const resultado = document.getElementById("resultadoOrcamento");

    if (!faixa) {
        resultado.classList.add("d-none");
        resultado.innerHTML = "";
        return;
    }

    let multiplicador = obterMultiplicador(faixa);
    let valorFinal = precoBase * multiplicador;

    resultado.classList.remove("d-none");
    resultado.innerHTML = `
        <b>Valor estimado:</b> R$ ${valorFinal.toFixed(2)}<br>
        (Preço base: R$ ${precoBase.toFixed(2)} + ajuste pela área: ${((multiplicador - 1) * 100).toFixed(0)}%)
    `;
}
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
function validarCamposOrcamento() {
    let listaErros = [];

    let elEmail = document.getElementById("orc_email");
    let elArea = document.getElementById("orc_areaTotal");
    let elCultura = document.getElementById("orc_cultura");

    document.getElementById("msg-emailAlt").innerText = "";

    elEmail.style.borderColor = "";
    elArea.style.borderColor = "";
    elCultura.style.borderColor = "";

    let email = elEmail.value.trim();
    let area = elArea.value.trim();
    let cultura = elCultura.value.trim();
    if (email === "") {
        listaErros.push("emailAlt");
        document.getElementById("msg-emailAlt").innerText = "E-mail obrigatório";
        elEmail.style.borderColor = "red";
    } else if (!validarEmail(email)) {
        listaErros.push("emailAlt");
        document.getElementById("msg-emailAlt").innerText = "E-mail inválido";
        elEmail.style.borderColor = "red";
    }
    if (area === "") {
        listaErros.push("areaAlt");
        elArea.style.borderColor = "red";
    }
    if (cultura === "") {
        listaErros.push("culturaAlt");
        elCultura.style.borderColor = "red";
    }
    return listaErros.length === 0;
}


document.getElementById("btnEnviarOrcamento").addEventListener("click", function () {
    if(!validarCamposOrcamento()){
        return;
    }
    const modalOrcamento = bootstrap.Modal.getInstance(document.getElementById('modalOrcamento'));
    modalOrcamento.hide();

    const modalConfirm = new bootstrap.Modal(document.getElementById('modalConfirmar'));
    modalConfirm.show();
})

