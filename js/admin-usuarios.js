// Solo preparamos el panel si la sesión tiene el rol Administrador. Es un control local de la demostración.
if (exigirAdministrador()) {

// Usamos la misma clave que el registro para trabajar con la misma lista de cuentas.
const CLAVE_USUARIOS = "pcshop-usuarios";
const formularioUsuario = document.getElementById("form-usuario");
const mensajeUsuario = document.getElementById("mensaje-usuario");

// Recuperamos la lista guardada. Si no hay datos o no se pueden leer, empezamos con una lista vacía.
function cargarUsuarios() {
  try {
    const contenido = localStorage.getItem(CLAVE_USUARIOS);
    // localStorage guarda texto; JSON.parse lo convierte de nuevo en datos de JavaScript.
    const lista = contenido === null ? [] : JSON.parse(contenido);

    if (Array.isArray(lista)) {
      return lista;
    }
  } catch (error) {
    console.error("No se pudieron cargar los usuarios.", error);
  }

  return [];
}

// Esta es la copia de los usuarios con la que trabajaremos mientras la página esté abierta.
const usuarios = cargarUsuarios();

// Leemos un campo y quitamos los espacios sobrantes del principio y del final.
function valorUsuario(id) {
  return document.getElementById(id).value.trim();
}

// Primero revisamos el formato: entre 7 y 9 caracteres en total, sin puntos ni guion.
function validarRun(run) {
  if (!/^[0-9]{6,8}[0-9K]$/.test(run)) {
    return false;
  }

  // Separamos el número del último carácter, que corresponde al dígito verificador.
  const cuerpo = run.slice(0, -1);
  const digitoIngresado = run.slice(-1);

  if (Number(cuerpo) === 0) {
    return false;
  }

  let suma = 0;
  let multiplicador = 2;

  // Recorremos el número de derecha a izquierda, multiplicando por 2 hasta 7 y repitiendo el ciclo.
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  // Aplicamos módulo 11: el resultado 11 corresponde a 0 y el 10 corresponde a K.
  const resultado = 11 - (suma % 11);
  const digitoEsperado = resultado === 11
    ? "0"
    : resultado === 10
      ? "K"
      : String(resultado);

  return digitoIngresado === digitoEsperado;
}

// Reunimos los campos en un objeto. Normalizamos la K del RUN y el correo para facilitar las comparaciones.
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

// Juntamos los errores para mostrarlos al guardar, sin detenernos solamente en el primero.
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

  // Además del formato, limitamos el correo a los tres dominios definidos para esta entrega.
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

  // Comprobamos que la región exista en nuestros datos y que la comuna pertenezca a ella.
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

  // Al buscar duplicados ignoramos el usuario que estamos editando: puede conservar sus propios datos.
  if (usuarios.some(function (usuario) {
    return usuario.id !== idEdicion && usuario.run === datos.run;
  })) {
    errores.push("Ya existe un usuario con ese RUN.");
  }

  // Al buscar duplicados ignoramos el usuario que estamos editando: puede conservar sus propios datos.
  if (usuarios.some(function (usuario) {
    return usuario.id !== idEdicion && usuario.correo === datos.correo;
  })) {
    errores.push("Ya existe un usuario con ese correo.");
  }

  return errores;
}

// Volvemos a dibujar la tabla con la lista actual después de crear o editar un usuario.
function mostrarUsuariosAdmin() {
  const tabla = document.getElementById("tabla-usuarios");
  // Quitamos las filas anteriores para que no se repitan al actualizar la tabla.
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
      // Mostramos el contenido como texto, sin interpretarlo como etiquetas HTML.
      celda.textContent = valor;
      fila.append(celda);
    });

    const acciones = document.createElement("td");
    const botonEditar = document.createElement("button");

    botonEditar.type = "button";
    botonEditar.className = "btn btn-outline-info btn-sm";
    botonEditar.textContent = "Editar";

    // Cada botón recuerda el identificador de su fila y carga ese usuario en el formulario.
    botonEditar.addEventListener("click", function () {
      editarUsuario(usuario.id);
    });

    acciones.append(botonEditar);
    fila.append(acciones);
    tabla.append(fila);
  });
}

// Restablecemos los campos y salimos del modo edición borrando el identificador oculto.
function limpiarFormularioUsuario() {
  formularioUsuario.reset();
  document.getElementById("usuario-id").value = "";

  // Avisamos a regiones.js del cambio para que también reinicie las opciones de comuna.
  document.getElementById("region").dispatchEvent(new Event("change"));

  document.getElementById("titulo-formulario-usuario").textContent =
    "Nuevo usuario";

  mensajeUsuario.textContent = "";
}

// Buscamos por ID para cargar exactamente el usuario seleccionado.
function editarUsuario(idUsuario) {
  const usuario = usuarios.find(function (usuario) {
    return usuario.id === idUsuario;
  });

  if (!usuario) {
    return;
  }

  // Relacionamos cada identificador del formulario con su valor guardado. ?? usa un valor alternativo si falta el dato.
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
  // Primero cargamos las comunas de la región; después podemos seleccionar la comuna guardada.
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

// Interceptamos Guardar para validar y persistir los datos sin recargar la página.
formularioUsuario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const idTexto = valorUsuario("usuario-id");
  // Un ID vacío significa usuario nuevo. Si tiene valor, estamos editando uno existente.
  const idEdicion = idTexto === "" ? null : Number(idTexto);
  const datos = leerFormularioUsuario();
  const errores = validarUsuario(datos, idEdicion);

  mensajeUsuario.className = "mt-3 text-warning";

  if (errores.length > 0) {
    mensajeUsuario.textContent = errores.join(" ");
    return;
  }

  // findIndex devuelve la posición del usuario; si no lo encuentra, devuelve -1.
  const indice = usuarios.findIndex(function (usuario) {
    return usuario.id === idEdicion;
  });

  if (idEdicion !== null && indice === -1) {
    mensajeUsuario.textContent = "No se encontró el usuario para editar.";
    return;
  }

  const usuarioAnterior = indice === -1 ? null : usuarios[indice];

  // Conservamos los campos anteriores, incluida la huella de contraseña si existe, y aplicamos los cambios del formulario.
  const usuarioGuardado = {
    ...usuarioAnterior,
    ...datos,
    // Al editar mantenemos el ID. Al crear usamos el mayor ID actual más uno.
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
    // Convertimos la lista a texto para conservarla al recargar, en este navegador y sitio.
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
  } catch (error) {
    // Si falla el guardado, deshacemos el cambio en memoria para no mostrarlo como si se hubiera guardado.
    if (indice === -1) {
      usuarios.pop();
    } else {
      usuarios[indice] = usuarioAnterior;
    }

    mensajeUsuario.textContent =
      "No se pudo guardar el usuario. Intenta nuevamente.";
    return;
  }

  // Solo limpiamos el formulario y actualizamos la tabla después de guardar correctamente.
  limpiarFormularioUsuario();
  mostrarUsuariosAdmin();

  mensajeUsuario.className = "mt-3 text-success";
  mensajeUsuario.textContent = idEdicion === null
    ? "Usuario creado correctamente."
    : "Usuario actualizado correctamente.";
});

document.getElementById("limpiar-usuario")
  .addEventListener("click", limpiarFormularioUsuario);

// Mostramos la lista apenas termina de prepararse el panel.
mostrarUsuariosAdmin();
}
