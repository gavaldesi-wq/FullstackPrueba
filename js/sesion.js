function obtenerUsuarioActual() {
  try {
    const sesion = JSON.parse(sessionStorage.getItem("pcshop-sesion"));

    if (!sesion) {
      return null;
    }

    return leerCuentas().find(function (usuario) {
      return usuario.id === sesion.id;
    }) ?? null;
  } catch (error) {
    console.error("No se pudo recuperar la sesión.", error);
    return null;
  }
}

function cerrarSesion() {
  sessionStorage.removeItem("pcshop-sesion");
  window.location.href = "login.html";
}

function mostrarSesion() {
  const usuario = obtenerUsuarioActual();
  const contenedores = document.querySelectorAll(".enlaces-usuario");

  if (!usuario) {
    return;
  }

  contenedores.forEach(function (contenedor) {
    contenedor.replaceChildren();

    const saludo = document.createElement("span");
    saludo.className = "text-white me-3";
    saludo.textContent = `Hola, ${usuario.nombre}`;

    contenedor.append(saludo);

    if (usuario.tipo === "Administrador") {
      const enlaceAdmin = document.createElement("a");
      enlaceAdmin.href = "admin.html";
      enlaceAdmin.className = "me-3";
      enlaceAdmin.textContent = "Administración";
      contenedor.append(enlaceAdmin);
    }

    if (usuario.tipo === "Vendedor") {
      const enlaceVentas = document.createElement("a");
      enlaceVentas.href = "vendedor.html";
      enlaceVentas.className = "me-3";
      enlaceVentas.textContent = "Consultas de ventas";
      contenedor.append(enlaceVentas);
    }

    const botonSalir = document.createElement("button");
    botonSalir.type = "button";
    botonSalir.className = "btn btn-outline-light btn-sm";
    botonSalir.textContent = "Cerrar sesión";
    botonSalir.addEventListener("click", cerrarSesion);

    contenedor.append(botonSalir);
  });
}

mostrarSesion();

function exigirAdministrador() {
  const usuario = obtenerUsuarioActual();

  if (!usuario) {
    window.location.replace("login.html");
    return false;
  }

  if (usuario.tipo !== "Administrador") {
    window.location.replace("index.html");
    return false;
  }
  document.body.hidden = false;
  return true;
}

function exigirPersonal() {
  const usuario = obtenerUsuarioActual();

  if (!usuario) {
    window.location.replace("login.html");
    return false;
  }

  if (!["Administrador", "Vendedor"].includes(usuario.tipo)) {
    window.location.replace("index.html");
    return false;
  }

  document.body.hidden = false;
  return true;
}