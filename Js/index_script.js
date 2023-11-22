var cabecalho = document.querySelector('.cabeçalho__container');
var efeito = document.querySelector('.hide');

document.addEventListener('scroll', function() {
    if (pageYOffset > 50) {
        cabecalho.style.transition = '.3s ease-out';
        cabecalho.style.transform = 'translateY(-200%)';
    } else {
        cabecalho.style.transform = '';
    }
});

