if (exigirAdministrador()) {

const CLAVE_USUARIOS = "pcshop-usuarios";
const formularioUsuario = document.getElementById("form-usuario");
const mensajeUsuario = document.getElementById("mensaje-usuario");

function cargarUsuarios() {
  try {
    const contenido = localStorage.getItem(CLAVE_USUARIOS);
    const lista = contenido === null ? [] : JSON.parse(contenido);

    if (Array.isArray(lista)) {
      return lista;
    }
  } catch (error) {
    console.error("No se pudieron cargar los usuarios.", error);
  }

  return [];
}

const usuarios = cargarUsuarios();

function valorUsuario(id) {
  return document.getElementById(id).value.trim();
}

function validarRun(run) {
  if (!/^[0-9]{6,8}[0-9K]$/.test(run)) {
    return false;
  }

  const cuerpo = run.slice(0, -1);
  const digitoIngresado = run.slice(-1);

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
  const digitoEsperado = resultado === 11
    ? "0"
    : resultado === 10
      ? "K"
      : String(resultado);

  return digitoIngresado === digitoEsperado;
}

function leerFormularioUsuario() {
  return {
    run: valorUsuario("usuario-run").toUpperCase(),
    nombre: valorUsuario("usuario-nombre"),
    apellidos: valorUsuario("usuario-apellidos"),
    correo: valorUsuario("usuario-correo").toLowerCase(),
    tipo: valorUsuario("usuario-tipo"),
    fechaNacimiento: valorUsuario("usuario-fecha"),
    region: valorUsuario("region"),
    comuna: valorUsuario("comuna"),
    direccion: valorUsuario("usuario-direccion")
  };
}

function validarUsuario(datos, idEdicion) {
  const errores = [];

  if (!validarRun(datos.run)) {
    errores.push("Ingresa un RUN válido, sin puntos ni guion.");
  }

  if (datos.nombre.length === 0 || datos.nombre.length > 50) {
    errores.push("El nombre es obligatorio y admite hasta 50 caracteres.");
  }

  if (datos.apellidos.length === 0 || datos.apellidos.length > 100) {
    errores.push("Los apellidos son obligatorios y admiten hasta 100 caracteres.");
  }

  const formatoCorreo =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

  if (datos.correo.length > 100 || !formatoCorreo.test(datos.correo)) {
    errores.push(
      "Ingresa un correo válido de duoc.cl, profesor.duoc.cl o gmail.com, de hasta 100 caracteres."
    );
  }

  if (!["Administrador", "Cliente", "Vendedor"].includes(datos.tipo)) {
    errores.push("Selecciona un tipo de usuario.");
  }

  const comunasPermitidas = Object.prototype.hasOwnProperty.call(
    regionesYComunas,
    datos.region
  ) ? regionesYComunas[datos.region] : [];

  if (!comunasPermitidas.includes(datos.comuna)) {
    errores.push("Selecciona una región y una comuna correspondiente.");
  }

  if (datos.direccion.length === 0 || datos.direccion.length > 300) {
    errores.push("La dirección es obligatoria y admite hasta 300 caracteres.");
  }

  if (usuarios.some(function (usuario) {
    return usuario.id !== idEdicion && usuario.run === datos.run;
  })) {
    errores.push("Ya existe un usuario con ese RUN.");
  }

  if (usuarios.some(function (usuario) {
    return usuario.id !== idEdicion && usuario.correo === datos.correo;
  })) {
    errores.push("Ya existe un usuario con ese correo.");
  }

  return errores;
}

function mostrarUsuariosAdmin() {
  const tabla = document.getElementById("tabla-usuarios");
  tabla.replaceChildren();

  document.getElementById("resumen-usuarios").textContent =
    usuarios.length === 0
      ? "No hay usuarios registrados."
      : `Usuarios registrados: ${usuarios.length}`;

  usuarios.forEach(function (usuario) {
    const fila = document.createElement("tr");

    const valores = [
      usuario.run,
      `${usuario.nombre} ${usuario.apellidos}`,
      usuario.correo,
      usuario.tipo,
      usuario.comuna
    ];

    valores.forEach(function (valor) {
      const celda = document.createElement("td");
      celda.textContent = valor;
      fila.append(celda);
    });

    const acciones = document.createElement("td");
    const botonEditar = document.createElement("button");

    botonEditar.type = "button";
    botonEditar.className = "btn btn-outline-info btn-sm";
    botonEditar.textContent = "Editar";

    botonEditar.addEventListener("click", function () {
      editarUsuario(usuario.id);
    });

    acciones.append(botonEditar);
    fila.append(acciones);
    tabla.append(fila);
  });
}

function limpiarFormularioUsuario() {
  formularioUsuario.reset();
  document.getElementById("usuario-id").value = "";

  document.getElementById("region").dispatchEvent(new Event("change"));

  document.getElementById("titulo-formulario-usuario").textContent =
    "Nuevo usuario";

  mensajeUsuario.textContent = "";
}

function editarUsuario(idUsuario) {
  const usuario = usuarios.find(function (usuario) {
    return usuario.id === idUsuario;
  });

  if (!usuario) {
    return;
  }

  const campos = {
    "usuario-id": usuario.id,
    "usuario-run": usuario.run,
    "usuario-nombre": usuario.nombre,
    "usuario-apellidos": usuario.apellidos,
    "usuario-correo": usuario.correo,
    "usuario-tipo": usuario.tipo,
    "usuario-fecha": usuario.fechaNacimiento ?? "",
    "usuario-direccion": usuario.direccion
  };

  Object.entries(campos).forEach(function ([id, valor]) {
    document.getElementById(id).value = valor;
  });

  const region = document.getElementById("region");
  region.value = usuario.region;
  region.dispatchEvent(new Event("change"));
  document.getElementById("comuna").value = usuario.comuna;

  document.getElementById("titulo-formulario-usuario").textContent =
    "Editar usuario";

  mensajeUsuario.textContent = "";
  formularioUsuario.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

formularioUsuario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const idTexto = valorUsuario("usuario-id");
  const idEdicion = idTexto === "" ? null : Number(idTexto);
  const datos = leerFormularioUsuario();
  const errores = validarUsuario(datos, idEdicion);

  mensajeUsuario.className = "mt-3 text-warning";

  if (errores.length > 0) {
    mensajeUsuario.textContent = errores.join(" ");
    return;
  }

  const indice = usuarios.findIndex(function (usuario) {
    return usuario.id === idEdicion;
  });

  if (idEdicion !== null && indice === -1) {
    mensajeUsuario.textContent = "No se encontró el usuario para editar.";
    return;
  }

  const usuarioAnterior = indice === -1 ? null : usuarios[indice];

  const usuarioGuardado = {
    ...usuarioAnterior,
    ...datos,
    id: idEdicion ?? (
      Math.max(0, ...usuarios.map(function (usuario) {
        return usuario.id;
      })) + 1
    )
  };

  if (indice === -1) {
    usuarios.push(usuarioGuardado);
  } else {
    usuarios[indice] = usuarioGuardado;
  }

  try {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
  } catch (error) {
    if (indice === -1) {
      usuarios.pop();
    } else {
      usuarios[indice] = usuarioAnterior;
    }

    mensajeUsuario.textContent =
      "No se pudo guardar el usuario. Intenta nuevamente.";
    return;
  }

  limpiarFormularioUsuario();
  mostrarUsuariosAdmin();

  mensajeUsuario.className = "mt-3 text-success";
  mensajeUsuario.textContent = idEdicion === null
    ? "Usuario creado correctamente."
    : "Usuario actualizado correctamente.";
});

document.getElementById("limpiar-usuario")
  .addEventListener("click", limpiarFormularioUsuario);

mostrarUsuariosAdmin();
}