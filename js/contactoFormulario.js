const formularioContacto = document.getElementById("form-contacto");

// Usamos nuestros mensajes de JavaScript en lugar de los avisos automáticos del navegador.
formularioContacto.noValidate = true;

const camposContacto = ["nombre", "correo", "comentario"];

// Dejamos un espacio para el resultado del formulario. role="status" ayuda a anunciarlo con lectores de pantalla.
const resultadoContacto = document.createElement("p");
resultadoContacto.setAttribute("role", "status");
formularioContacto.append(resultadoContacto);

function validarCampoContacto(id) {
  const campo = document.getElementById(id);
  // Quitamos los espacios de los extremos para que escribir solo espacios no cuente como contenido.
  const valor = campo.value.trim();
  let mensaje = "";

  if (id === "nombre") {
    if (valor.length === 0 || valor.length > 100) {
      mensaje = "El nombre es obligatorio y admite hasta 100 caracteres.";
    }
  }

  // El correo es opcional. Si se completa, revisamos su formato y longitud.
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

  // Cada campo tiene su propio mensaje. Si no hay error, lo ocultamos con d-none de Bootstrap.
  const error = document.getElementById(`error-contacto-${id}`);
  error.textContent = mensaje;
  error.classList.toggle("d-none", mensaje === "");
  campo.setAttribute("aria-invalid", String(mensaje !== ""));

  // Devolvemos true cuando el campo pasó la validación.
  return mensaje === "";
}

// Preparamos los mensajes y eventos de los tres campos una sola vez al cargar la página.
camposContacto.forEach(function (id) {
  const campo = document.getElementById(id);
  const error = document.createElement("p");

  error.id = `error-contacto-${id}`;
  error.className = "text-warning small mt-1 d-none";
  campo.after(error);

  // Asociamos el error con su campo sin borrar otras ayudas que ya tenga en el HTML.
  const descripcionAnterior = campo.getAttribute("aria-describedby");
  campo.setAttribute(
    "aria-describedby",
    [descripcionAnterior, error.id].filter(Boolean).join(" ")
  );

  campo.maxLength = id === "comentario" ? 500 : 100;
  campo.required = id !== "correo";

  // Quitamos restricciones anteriores del nombre para usar las reglas actuales de la pauta.
  if (id === "nombre") {
    campo.removeAttribute("minlength");
    campo.removeAttribute("pattern");
  }

  // Al escribir, borramos el resultado anterior y revisamos solo el campo que cambió.
  campo.addEventListener("input", function () {
    resultadoContacto.textContent = "";
    validarCampoContacto(id);
  });
});

formularioContacto.addEventListener("submit", function (evento) {
  // Evitamos el envío normal del formulario y la recarga de la página.
  evento.preventDefault();
  resultadoContacto.textContent = "";

  // Revisamos todos los campos, incluso si la persona no escribió en alguno de ellos.
  const resultados = camposContacto.map(validarCampoContacto);

  if (resultados.includes(false)) {
    // Si hay errores, llevamos el cursor al primero para facilitar su corrección.
    formularioContacto.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  // Esta versión solo valida: no guarda el mensaje ni lo envía a un servidor.
  resultadoContacto.className = "text-success mt-3";
  resultadoContacto.textContent =
    "Formulario validado correctamente. En esta demostración no se envía el mensaje.";
});
