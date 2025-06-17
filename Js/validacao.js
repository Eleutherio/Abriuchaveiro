document.addEventListener("DOMContentLoaded", function () {

    function validarFormulario() {

// capturando os imputs //
        var form = document.getElementById('form');
        var nome = document.getElementById('input--nome');
        var email = document.getElementById('input--email');
        var bairro = document.getElementById('input--bairro');
        var telefone = document.getElementById('input--telefone');
        var tooltip = document.getElementById('tooltip-nome');
        var loading = document.getElementById('loading'); 
//----------------------- //

// Auto preenchimento com local storage //
    if (localStorage.getItem('nome') && localStorage.getItem('email') && localStorage.getItem('telefone') && localStorage.getItem('bairro')) {
        nome.value = localStorage.getItem('nome');
        email.value = localStorage.getItem('email');
        telefone.value = localStorage.getItem('telefone');
        bairro.value = localStorage.getItem('nome');
    }
//---------------------//


// Função de validação do Fromulário //
        let valido = true;

        if (!validarNome()) valido = false; 
        if (!validarEmail()) valido = false;
        if (!validarTelefone()) valido = false;
        if (!validarBairro()) valido = false;
        if (!validarServico()) valido = false;
        if (!validarMensagem()) valido = false;

        function validarNome (){
            const nome = document.getElementByque('nome').value;
            if (nome.length >= 3 && nome.length <= 30){
                document.querySelector('.nome__container input').style.border = "1px solid green";;
                return true;
            };
    }
    return valido;   
}
});