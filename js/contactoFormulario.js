const formularioContacto = document.getElementById("form-contacto");

formularioContacto.noValidate = true;

const camposContacto = ["nombre", "correo", "comentario"];

const resultadoContacto = document.createElement("p");
resultadoContacto.setAttribute("role", "status");
formularioContacto.append(resultadoContacto);

function validarCampoContacto(id) {
  const campo = document.getElementById(id);
  const valor = campo.value.trim();
  let mensaje = "";

  if (id === "nombre") {
    if (valor.length === 0 || valor.length > 100) {
      mensaje = "El nombre es obligatorio y admite hasta 100 caracteres.";
    }
  }

  if (id === "correo" && valor !== "") {
    const formato =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;

    if (valor.length > 100 || !formato.test(valor)) {
      mensaje = "Ingresa un correo válido de hasta 100 caracteres.";
    }
  }

  if (id === "comentario") {
    if (valor.length === 0 || valor.length > 500) {
      mensaje = "El comentario es obligatorio y admite hasta 500 caracteres.";
    }
  }

  const error = document.getElementById(`error-contacto-${id}`);
  error.textContent = mensaje;
  error.classList.toggle("d-none", mensaje === "");
  campo.setAttribute("aria-invalid", String(mensaje !== ""));

  return mensaje === "";
}

camposContacto.forEach(function (id) {
  const campo = document.getElementById(id);
  const error = document.createElement("p");

  error.id = `error-contacto-${id}`;
  error.className = "text-warning small mt-1 d-none";
  campo.after(error);

  const descripcionAnterior = campo.getAttribute("aria-describedby");
  campo.setAttribute(
    "aria-describedby",
    [descripcionAnterior, error.id].filter(Boolean).join(" ")
  );

  campo.maxLength = id === "comentario" ? 500 : 100;
  campo.required = id !== "correo";

  if (id === "nombre") {
    campo.removeAttribute("minlength");
    campo.removeAttribute("pattern");
  }

  campo.addEventListener("input", function () {
    resultadoContacto.textContent = "";
    validarCampoContacto(id);
  });
});

formularioContacto.addEventListener("submit", function (evento) {
  evento.preventDefault();
  resultadoContacto.textContent = "";

  const resultados = camposContacto.map(validarCampoContacto);

  if (resultados.includes(false)) {
    formularioContacto.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  resultadoContacto.className = "text-success mt-3";
  resultadoContacto.textContent =
    "Formulario validado correctamente. En esta demostración no se envía el mensaje.";
});