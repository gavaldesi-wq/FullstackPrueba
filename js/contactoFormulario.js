const form = document.querySelector('#form-contacto');
const nombre =document.querySelector('#nombre');
const correo = document.querySelector('#correo');
const comentario = document.querySelector('#comentario');

form.addEventListener("submit", function (event) {
event.preventDefault(); 
const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{2,50}$/;
const regexCorreo = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
const regexComentario = /^[\s\S]{1,500}$/;
let formularioValido = true;

if (!regexNombre.test(nombre.value.trim())) {
console.log("Nombre inválido");
formularioValido = false;
} else {
console.log("Nombre válido");
}

if(!regexCorreo.test(correo.value.trim())) {
console.log("Correo inválido");
formularioValido = false;
}else{
    console.log("Correo válido");
}

if(!regexComentario.test(comentario.value.trim())) {
console.log("Comentario inválido");
formularioValido = false;
}else{
    console.log("Comentario válido");
}

if (formularioValido) {
console.log("Formulario válido ");
} else {
console.log("Formulario inválido ");
}
});
