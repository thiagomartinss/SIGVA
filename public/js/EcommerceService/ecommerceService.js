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
//nao fiz ainda
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
