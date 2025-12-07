document.addEventListener("DOMContentLoaded", function() {
    let usuarioInput = document.getElementById("usuario");
    let senhaInput = document.getElementById("senha");
    let btnLogin = document.getElementById("btnLogin");
    let msgError = document.getElementById("msg-login");

    
    function limparErro() {
        if(usuarioInput) 
            usuarioInput.style.borderColor = "#ced4da";
        if(senhaInput) 
            senhaInput.style.borderColor = "#ced4da";
        
        if(msgError) {
            msgError.innerText = "";
            msgError.classList.add("d-none"); 
        }
    }

    if(usuarioInput) 
        usuarioInput.addEventListener('input', limparErro);
    if(senhaInput) 
        senhaInput.addEventListener('input', limparErro);

    if(btnLogin) {
        btnLogin.addEventListener("click", function(event) {
            let usuarioValor = usuarioInput ? usuarioInput.value : "";
            let senhaValor = senhaInput ? senhaInput.value : "";

            if(!usuarioValor || !senhaValor) {
                event.preventDefault(); 
                
                if(msgError) {
                    msgError.innerText = "Para logar preencha o usuário e senha";
                    msgError.classList.remove("d-none"); // Remove classe que esconde
                }
        
                if(!usuarioValor && usuarioInput) 
                    usuarioInput.style.borderColor = "red";
                if(!senhaValor && senhaInput) 
                    senhaInput.style.borderColor = "red";
            }
        });
    }
});