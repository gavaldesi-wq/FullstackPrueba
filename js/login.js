const formularioLogin = document.getElementById("form-login");
const correoLogin = document.getElementById("correo");
const contrasenaLogin = document.getElementById("contrasena");

function mostrarErrorLogin(campo, mensaje) {
  const error = document.getElementById(`error-${campo.id}`);

  error.textContent = mensaje;
  error.classList.toggle("d-none", mensaje === "");
  campo.setAttribute("aria-invalid", String(mensaje !== ""));
  campo.setAttribute("aria-describedby", error.id);

  return mensaje === "";
}

function validarCorreoLogin() {
  const correo = correoLogin.value.trim();
  const formato =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;

  let mensaje = "";

  if (correo === "") {
    mensaje = "El correo es obligatorio.";
  } else if (correo.length > 100 || !formato.test(correo)) {
    mensaje = "Ingresa un correo válido de hasta 100 caracteres.";
  }

  return mostrarErrorLogin(correoLogin, mensaje);
}

function validarContrasenaLogin() {
  const contrasena = contrasenaLogin.value;
  let mensaje = "";

  if (contrasena === "") {
    mensaje = "La contraseña es obligatoria.";
  } else if (contrasena.length < 4 || contrasena.length > 10) {
    mensaje = "La contraseña debe tener entre 4 y 10 caracteres.";
  }

  return mostrarErrorLogin(contrasenaLogin, mensaje);
}

correoLogin.addEventListener("input", validarCorreoLogin);
contrasenaLogin.addEventListener("input", validarContrasenaLogin);

const mensajeLogin = document.createElement("p");
mensajeLogin.setAttribute("role", "status");
formularioLogin.append(mensajeLogin);

let iniciandoSesion = false;

formularioLogin.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  if (iniciandoSesion) {
    return;
  }

  mensajeLogin.textContent = "";

  const correoValido = validarCorreoLogin();
  const contrasenaValida = validarContrasenaLogin();

  if (!correoValido || !contrasenaValida) {
    return;
  }

  const correo = correoLogin.value.trim().toLowerCase();
  const contrasena = contrasenaLogin.value;
  const boton = formularioLogin.querySelector('button[type="submit"]');

  iniciandoSesion = true;
  boton.disabled = true;
  mensajeLogin.className = "mt-3 text-info";
  mensajeLogin.textContent = "Comprobando datos…";

  try {
    const cuentas = leerCuentas();

    const usuario = cuentas.find(function (cuenta) {
      return cuenta.correo.toLowerCase() === correo;
    });

    if (!usuario || !usuario.sal || !usuario.contrasenaHash) {
      mensajeLogin.className = "mt-3 text-warning";
      mensajeLogin.textContent = "Correo o contraseña incorrectos.";
      return;
    }

    const huella = await generarHuella(contrasena, usuario.sal);

    if (huella !== usuario.contrasenaHash) {
      mensajeLogin.className = "mt-3 text-warning";
      mensajeLogin.textContent = "Correo o contraseña incorrectos.";
      return;
    }

    if (!["Administrador", "Vendedor", "Cliente"].includes(usuario.tipo)) {
      mensajeLogin.className = "mt-3 text-warning";
      mensajeLogin.textContent = "La cuenta no tiene un tipo de usuario válido.";
      return;
    }

    sessionStorage.setItem(
      "pcshop-sesion",
      JSON.stringify({ id: usuario.id })
    );

    if (usuario.tipo === "Administrador") {
  window.location.href = "admin.html";
} else if (usuario.tipo === "Vendedor") {
  window.location.href = "vendedor.html";
} else {
  window.location.href = "index.html";
}
  } catch (error) {
    console.error("No se pudo iniciar sesión.", error);
    mensajeLogin.className = "mt-3 text-warning";
    mensajeLogin.textContent =
      "No se pudo iniciar sesión. Revisa la consola para identificar el problema.";
  } finally {
    iniciandoSesion = false;
    boton.disabled = false;
  }
});