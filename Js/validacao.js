document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('form');
    const nome = document.getElementById('input--nome');
    const email = document.getElementById('input--email');
    const telefone = document.getElementById('input--telefone');
    const bairro = document.getElementById('input--bairro');


    // Preenchimento automático via localStorage
    if (
        localStorage.getItem('nome') &&
        localStorage.getItem('email') &&
        localStorage.getItem('telefone') &&
        localStorage.getItem('bairro')
    ) {
        nome.value = localStorage.getItem('nome');
        email.value = localStorage.getItem('email');
        telefone.value = localStorage.getItem('telefone');
        bairro.value = localStorage.getItem('bairro');
    }
    // Ao enviar o formulário
    form.addEventListener('submit', function (e) {
        if (!validarFormulario()) {
            e.preventDefault();
            alert("Por favor, preencha todos os campos corretamente.");
        }
    });

    function validarFormulario() {
        let valido = true;

        if (!validarNome()) valido = false;
        if (!validarEmail()) valido = false;
        if (!validarTelefone()) valido = false;
        if (!validarBairro()) valido = false;

        return valido;
    }

    function validarNome() {
        if (nome.value.length >= 3 && nome.value.length <= 30) {
            nome.style.border = "1px solid green";
            return true;
        } else {
            return false;
        }
    }

    function validarEmail() {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (regex.test(email.value)) {
            return true;
        } else {
            return false;
        }
    }

    function validarTelefone() {
        const regex = /^\d{10,11}$/;
        if (regex.test(telefone.value)) {
            telefone.style.border = "1px solid green";
            return true;
        } else {
            telefone.style.border = "1px solid red";
            return false;
        }
    }

    function validarBairro() {
        if (bairro.value.trim().length >= 3) {
            bairro.style.border = "1px solid green";
            return true;
        } else {
            bairro.style.border = "1px solid red";
            return false;
        }
    }
    // Função para validar qualquer input baseado no seu id
function validarInput(input) {
    switch (input.id) {
        case 'input--nome':
            return validarNome();
        case 'input--email':
            return validarEmail();
        case 'input--telefone':
            return validarTelefone();
        case 'input--bairro':
            return validarBairro();
        default:
            return true;
    }
}

// Evento de foco
document.addEventListener('focus', function (e) {
    if (e.target.tagName === 'INPUT') {
        // Resetar borda dos outros inputs que não são válidos
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            if (input !== e.target && !validarInput(input)) {
                input.style.border = '';
            }
        });

        // Se o campo focado não for válido, pinta de vermelho
        if (!validarInput(e.target)) {
            e.target.style.border = '1px solid red';
        }
    }
}, true);


});
