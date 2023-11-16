document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById('form');
    var nome = document.getElementById('input--nome');
    var tooltip = document.getElementById('tooltip-nome');
    var loading = document.getElementById('loading'); // Adicionado

    // Recupera os dados do localStorage ao carregar a página
    if (localStorage.getItem('nome')) {
        nome.value = localStorage.getItem('nome');
    }

    function validarFormulario() {
        // Sua lógica de validação aqui
        return true; // Substitua isso pela sua lógica de validação real
    }

    function exibirLoading() {
        loading.style.display = 'block';
    }

    function ocultarLoading() {
        loading.style.display = 'none';
    }
    function enviarFormularioAjax() {
        var formData = new FormData(form);

        exibirLoading();
        
        // Armazena os dados no localStorage antes de enviar o formulário
        localStorage.setItem('nome', nome.value);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '../formulario.php', true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {

                ocultarLoading();
                
                if (xhr.status == 200) {
                    // Sucesso no envio, redireciona para a página de sucesso
                    window.location.replace('/contents/sucess.html');
                } else {
                    // Falha no envio, redireciona para a página de erro
                    window.location.replace('/contents/error.html');
                }
            }
        };

        xhr.send(formData);
    }

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            if (validarFormulario()) {
                // Se a validação passar, envie o formulário usando AJAX
                enviarFormularioAjax();
            }
        });
    }

    nome.addEventListener("focus", function () {
        tooltip.style.display = 'block';
    });

    nome.addEventListener("blur", function () {
        tooltip.style.display = 'none';
    });
});
