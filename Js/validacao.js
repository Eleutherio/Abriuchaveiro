const form = document.getElementById('form')

const nomeInput = document.getElementById('nome')
const telefoneInput = document.getElementById('fone')
const emailInput = document.getElementById('email')
const mensagemInput = document.getElementById('msg')
const campos = document.querySelectorAll('.required')
const spans = document.getElementsByClassName('.span__required');



console.log (form, nomeInput, emailInput, telefoneInput, mensagemInput);

form.addEventListener ("submit", (event) => {
   event.preventDefault();

    if (emailInput.value === "" || validaEmail (emailInput.value) || validaTelefone (telefoneInput)) {
        ("Por favor, ensira seus dados");
        return;
    } 

    
     form.submit();
});

function validaTelefone (tel) {
    const telregex = new RegExp (
        /^[0-9.-]$/ 
    ); if (telregex.test(tel))
    return true;
 else return false;
}
function validaEmail (email){
    const emailRegex = new RegExp (
        /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/
    ); if (emailRegex.test(email))
            return true;
        else {
            return false;
    }
} 
function requiredError(index){
    campos[index].style.border = '2px solid red';
    spans[index].style.display = block;
}
