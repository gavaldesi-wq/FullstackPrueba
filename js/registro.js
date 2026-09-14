const formularioRegistro = document.getElementById("form-registro");

function runValido(run) {
  if (!/^[0-9]{6,8}[0-9K]$/.test(run)) {
    return false;
  }

  const cuerpo = run.slice(0, -1);

  if (Number(cuerpo) === 0) {
    return false;
  }

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resultado = 11 - (suma % 11);
  const digito = resultado === 11
    ? "0"
    : resultado === 10 ? "K" : String(resultado);

  return run.slice(-1) === digito;
}

function validarCampoRegistro(id) {
  const campo = document.getElementById(id);
  const valor = campo.value.trim();
  let mensaje = "";

  switch (id) {
    case "run":
      if (!runValido(valor.toUpperCase())) {
        mensaje = "Ingresa un RUN válido, sin puntos ni guion.";
      }
      break;

    case "nombre":
      if (valor.length === 0 || valor.length > 50) {
        mensaje = "El nombre es obligatorio y admite hasta 50 caracteres.";
      }
      break;

    case "apellidos":
      if (valor.length === 0 || valor.length > 100) {
        mensaje = "Los apellidos son obligatorios y admiten hasta 100 caracteres.";
      }
      break;

    case "correo": {
      const formato =
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

      if (valor.length > 100 || !formato.test(valor)) {
        mensaje =
          "Ingresa un correo válido de duoc.cl, profesor.duoc.cl o gmail.com, de hasta 100 caracteres.";
      }
      break;
    }

    case "contrasena":
      if (campo.value.length < 4 || campo.value.length > 10) {
        mensaje = "La contraseña debe tener entre 4 y 10 caracteres.";
      }
      break;

    case "confirmar-contrasena":
      if (
        campo.value === "" ||
        campo.value !== document.getElementById("contrasena").value
      ) {
        mensaje = "Las contraseñas deben coincidir.";
      }
      break;

    case "region":
      if (!Object.prototype.hasOwnProperty.call(regionesYComunas, valor)) {
        mensaje = "Selecciona una región.";
      }
      break;

    case "comuna": {
      const region = document.getElementById("region").value;
      const comunas = Object.prototype.hasOwnProperty.call(
        regionesYComunas,
        region
      ) ? regionesYComunas[region] : [];

      if (!comunas.includes(valor)) {
        mensaje = "Selecciona una comuna de la región elegida.";
      }
      break;
    }

    case "direccion":
      if (valor.length === 0 || valor.length > 300) {
        mensaje = "La dirección es obligatoria y admite hasta 300 caracteres.";
      }
      break;
  }

  const error = document.getElementById(`error-${id}`);
  error.textContent = mensaje;
  error.classList.toggle("d-none", mensaje === "");
  campo.setAttribute("aria-invalid", String(mensaje !== ""));

  return mensaje === "";
}

const camposRegistro = [
  "run",
  "nombre",
  "apellidos",
  "correo",
  "contrasena",
  "confirmar-contrasena",
  "region",
  "comuna",
  "direccion"
];

camposRegistro.forEach(function (id) {
  const campo = document.getElementById(id);
  let error = document.getElementById(`error-${id}`);

  // Región y comuna todavía no tienen un mensaje en el HTML.
  if (!error) {
    error = document.createElement("div");
    error.id = `error-${id}`;
    error.className = "mensaje-error d-none";
    campo.after(error);
  }

  campo.setAttribute("aria-describedby", error.id);

  const evento = campo.tagName === "SELECT" ? "change" : "input";

  campo.addEventListener(evento, function () {
    validarCampoRegistro(id);

    if (
      id === "contrasena" &&
      document.getElementById("confirmar-contrasena").value !== ""
    ) {
      validarCampoRegistro("confirmar-contrasena");
    }

    if (id === "region") {
      validarCampoRegistro("comuna");
    }
  });
});

const mensajeRegistro = document.createElement("p");
mensajeRegistro.setAttribute("role", "status");
formularioRegistro.append(mensajeRegistro);

let guardandoRegistro = false;

formularioRegistro.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  if (guardandoRegistro) {
    return;
  }

  mensajeRegistro.textContent = "";

  const resultados = camposRegistro.map(validarCampoRegistro);

  if (resultados.includes(false)) {
    formularioRegistro.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  const usuario = {
    run: document.getElementById("run").value.trim().toUpperCase(),
    nombre: document.getElementById("nombre").value.trim(),
    apellidos: document.getElementById("apellidos").value.trim(),
    correo: document.getElementById("correo").value.trim().toLowerCase(),
    fechaNacimiento: document.getElementById("fecha-nacimiento").value,
    region: document.getElementById("region").value,
    comuna: document.getElementById("comuna").value,
    direccion: document.getElementById("direccion").value.trim(),
    tipo: "Cliente"
  };

  const contrasena = document.getElementById("contrasena").value;
  const boton = formularioRegistro.querySelector('button[type="submit"]');

  guardandoRegistro = true;
  boton.disabled = true;
  mensajeRegistro.className = "mt-3 text-info";
  mensajeRegistro.textContent = "Guardando cuenta…";

  try {
    const sal = crearSal();
    const contrasenaHash = await generarHuella(contrasena, sal);
    const cuentas = leerCuentas();

    const duplicado = cuentas.some(function (cuenta) {
      return cuenta.run === usuario.run ||
        cuenta.correo.toLowerCase() === usuario.correo;
    });

    if (duplicado) {
      mensajeRegistro.className = "mt-3 text-warning";
      mensajeRegistro.textContent =
        "Ya existe un usuario con ese RUN o correo.";
      return;
    }

    usuario.id = Math.max(0, ...cuentas.map(function (cuenta) {
      return cuenta.id;
    })) + 1;

    usuario.sal = sal;
    usuario.contrasenaHash = contrasenaHash;

    cuentas.push(usuario);
    localStorage.setItem("pcshop-usuarios", JSON.stringify(cuentas));

    formularioRegistro.reset();
    document.getElementById("region").dispatchEvent(new Event("change"));

    camposRegistro.forEach(function (id) {
      document.getElementById(`error-${id}`).classList.add("d-none");
      document.getElementById(id).setAttribute("aria-invalid", "false");
    });

    mensajeRegistro.className = "mt-3 text-success";
    mensajeRegistro.textContent =
      "Cuenta creada correctamente. Ya puedes ir a Iniciar sesión.";
  } catch (error) {
    console.error("No se pudo registrar la cuenta.", error);
    mensajeRegistro.className = "mt-3 text-warning";
    mensajeRegistro.textContent =
      "No se pudo guardar la cuenta. Revisa la consola para identificar el problema.";
  } finally {
    guardandoRegistro = false;
    boton.disabled = false;
  }
});