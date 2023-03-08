
$('.nav__menu__itens a').mouse(function() {
    $('.nav__menu__itens > a').removeClass('active');
    $(this).addClass('active'); 
}); 