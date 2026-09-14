// 0) Nombre de la variable para guardar el carrito en el navegador. 
// Así no se le borra a la persona si cierra la pestaña.
const LLAVE_CARRITO = "pcshop_carrito";


// 1) Leer lo que hay en el carrito. Si no hay nada, devuelve un arreglo vacío.
function obtenerCarrito() {
  const textoGuardado = localStorage.getItem(LLAVE_CARRITO);
  return textoGuardado ? JSON.parse(textoGuardado) : [];
}


// 2) Guarda el carrito en el navegador y de paso actualiza el numerito del menú.
function guardarCarrito(carrito) {
  localStorage.setItem(LLAVE_CARRITO, JSON.stringify(carrito));
  actualizarContadorNavbar();
}


// 3) Función para meter cosas al carrito.
// Si el producto ya estaba, solo le suma la cantidad. Si es nuevo, lo agrega al final.
function agregarAlCarrito(producto, cantidad) {
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    alert("Ingresa una cantidad entera mayor que cero.");
    return false;
  }

  const productoActual = cargarProductos().find(function (item) {
    return item.id === producto.id;
  });

  if (!productoActual) {
    alert("Este producto ya no está disponible.");
    return false;
  }

  const carrito = obtenerCarrito();

  const itemExistente = carrito.find(function (item) {
    return item.id === producto.id;
  });

  const cantidadActual = itemExistente ? itemExistente.cantidad : 0;

  if (cantidadActual + cantidad > productoActual.stock) {
    alert("La cantidad solicitada supera el stock disponible.");
    return false;
  }

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
    itemExistente.precio = productoActual.precio;
  } else {
    carrito.push({
      id: productoActual.id,
      nombre: productoActual.nombre,
      precio: productoActual.precio,
      imagen: productoActual.imagen,
      cantidad: cantidad
    });
  }

  guardarCarrito(carrito);
  return true;
}


// 4) Cambiar la cantidad de un producto.
// Si le ponen menos de 1, mejor lo borramos del carrito para que no quede en cero.
function cambiarCantidad(id, nuevaCantidad) {
  if (!Number.isInteger(nuevaCantidad) || nuevaCantidad < 0) {
    alert("La cantidad debe ser un número entero mayor o igual a cero.");
    return false;
  }

  if (nuevaCantidad === 0) {
    eliminarDelCarrito(id);
    return true;
  }

  const producto = cargarProductos().find(function (item) {
    return item.id === id;
  });

  if (!producto) {
    alert("Este producto ya no está disponible. Elimínalo del carrito.");
    return false;
  }

  if (nuevaCantidad > producto.stock) {
    alert("La cantidad solicitada supera el stock disponible.");
    return false;
  }

  const carrito = obtenerCarrito();
  const item = carrito.find(function (item) {
    return item.id === id;
  });

  if (!item) {
    return false;
  }

  item.cantidad = nuevaCantidad;
  item.precio = producto.precio;

  guardarCarrito(carrito);
  return true;
}


// 5) Borrar un producto. Filtra todo lo que NO sea ese id y guarda el resto.
function eliminarDelCarrito(id) {
  const carrito = obtenerCarrito().filter(function (item) {
    return item.id !== id;
  });
  guardarCarrito(carrito);
}


// 6) Sacar la cuenta de la plata y sumar cuántos artículos hay en total.
function calcularTotalDinero(carrito) {
  return carrito.reduce(function (acumulado, item) {
    return acumulado + item.precio * item.cantidad;
  }, 0);
}

function calcularTotalUnidades(carrito) {
  return carrito.reduce(function (acumulado, item) {
    return acumulado + item.cantidad;
  }, 0);
}


// 7) Cambiar el numerito rojo del carrito arriba en la barra de navegación.
function actualizarContadorNavbar() {
  const carrito = obtenerCarrito();
  const totalUnidades = calcularTotalUnidades(carrito);

  document.querySelectorAll(".contador-carrito").forEach(function (elemento) {
    elemento.textContent = totalUnidades;
  });

  document.querySelectorAll(".texto-carrito").forEach(function (elemento) {
    elemento.textContent = "Carrito (" + totalUnidades + ")";
  });
}


// 8) Pintar los productos en la página del carrito.
// Si no estamos en esa página, se corta y no hace nada.
function renderizarPaginaCarrito() {
  const contenedor = document.getElementById("contenedor-carrito");
  if (!contenedor) return; 

  const mensajeVacio = document.getElementById("carrito-vacio");
  const resumen = document.getElementById("resumen-carrito");
  const elementoTotal = document.getElementById("total-carrito");
  const carrito = obtenerCarrito();

  // Si no hay nada, muestra el mensaje de que está vacío
  if (carrito.length === 0) {
    contenedor.innerHTML = "";
    mensajeVacio.classList.remove("d-none");
    resumen.classList.add("d-none");
    return;
  }

  // Si hay cosas, armamos la lista
  mensajeVacio.classList.add("d-none");
  resumen.classList.remove("d-none");

  contenedor.innerHTML = "";
  carrito.forEach(function (item) {
    const subtotal = item.precio * item.cantidad;

    contenedor.innerHTML += `
      <div class="fila-carrito d-flex align-items-center gap-3 p-3 mb-3">
        <img src="${item.imagen}" alt="${item.nombre}" class="miniatura-carrito">

        <div class="flex-grow-1">
          <p class="producto mb-1">${item.nombre}</p>
          <p class="precio mb-0">$ ${item.precio.toLocaleString("es-CL")} c/u</p>
        </div>

        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-sm boton-cyan btn-restar" data-id="${item.id}">−</button>
          <span class="px-2">${item.cantidad}</span>
          <button type="button" class="btn btn-sm boton-cyan btn-sumar" data-id="${item.id}">+</button>
        </div>

        <p class="precio mb-0 text-end" style="min-width: 110px;">$ ${subtotal.toLocaleString("es-CL")}</p>

        <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${item.id}">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
  });

  elementoTotal.textContent = "$ " + calcularTotalDinero(carrito).toLocaleString("es-CL");
}


// 9) Escuchar los clics de los botones de sumar, restar o el basurero.
// Se le pone al document entero para que agarre los botones aunque se creen después.
document.addEventListener("click", function (evento) {
  const contenedor = document.getElementById("contenedor-carrito");
  if (!contenedor || !contenedor.contains(evento.target)) return;

  const botonSumar = evento.target.closest(".btn-sumar");
  const botonRestar = evento.target.closest(".btn-restar");
  const botonEliminar = evento.target.closest(".btn-eliminar");

  if (botonSumar) {
    const id = Number(botonSumar.dataset.id);
    const item = obtenerCarrito().find(function (i) { return i.id === id; });
    if (item) cambiarCantidad(id, item.cantidad + 1);
    renderizarPaginaCarrito();
  }

  if (botonRestar) {
    const id = Number(botonRestar.dataset.id);
    const item = obtenerCarrito().find(function (i) { return i.id === id; });
    if (item) cambiarCantidad(id, item.cantidad - 1);
    renderizarPaginaCarrito();
  }

  if (botonEliminar) {
    const id = Number(botonEliminar.dataset.id);
    eliminarDelCarrito(id);
    renderizarPaginaCarrito();
  }
});


function pagarCarrito() {
  const usuario = obtenerUsuarioActual();

  if (!usuario) {
    alert("Inicia sesión para confirmar tu pedido.");
    window.location.href = "login.html";
    return;
  }

  try {
    const carrito = obtenerCarrito();

    if (!Array.isArray(carrito) || carrito.length === 0) {
      return;
    }

    const catalogo = cargarProductos();
    const cantidades = new Map();

    carrito.forEach(function (item) {
      if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {
        throw new Error("El carrito contiene una cantidad inválida.");
      }

      cantidades.set(
        item.id,
        (cantidades.get(item.id) || 0) + item.cantidad
      );
    });

    const detalle = [];

    cantidades.forEach(function (cantidad, id) {
      const producto = catalogo.find(function (producto) {
        return producto.id === id;
      });

      if (!producto) {
        throw new Error("Un producto del carrito ya no está disponible.");
      }

      if (
        !Number.isInteger(producto.stock) ||
        cantidad > producto.stock
      ) {
        throw new Error(`Stock insuficiente para ${producto.nombre}.`);
      }

      if (!Number.isFinite(producto.precio) || producto.precio < 0) {
        throw new Error(`El precio de ${producto.nombre} no es válido.`);
      }

      detalle.push({
        id: producto.id,
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidad,
        subtotal: producto.precio * cantidad
      });
    });

    const total = detalle.reduce(function (suma, item) {
      return suma + item.subtotal;
    }, 0);

    if (!Number.isFinite(total)) {
      throw new Error("No se pudo calcular el total del pedido.");
    }

    const acepta = confirm(
      "¿Confirmar pedido de demostración por $" +
      total.toLocaleString("es-CL") +
      "? No se realizará ningún cobro."
    );

    if (!acepta) {
      return;
    }

    const textoOrdenes = localStorage.getItem("pcshop-ordenes");
    const ordenes = textoOrdenes === null ? [] : JSON.parse(textoOrdenes);

    if (!Array.isArray(ordenes)) {
      throw new Error("No se pudo leer el listado de órdenes.");
    }

    const orden = {
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      usuarioId: usuario.id,
      cliente: `${usuario.nombre} ${usuario.apellidos}`,
      correo: usuario.correo,
      direccion: usuario.direccion,
      region: usuario.region,
      comuna: usuario.comuna,
      estado: "Pendiente",
      detalle: detalle,
      total: total
    };

    ordenes.push(orden);
    localStorage.setItem("pcshop-ordenes", JSON.stringify(ordenes));

    // La orden ya está guardada. Intentamos limpiar el carrito.
    try {
      guardarCarrito([]);
      renderizarPaginaCarrito();
    } catch (error) {
      alert(
        "El pedido quedó registrado, pero no se pudo vaciar el carrito. " +
        "No vuelvas a confirmarlo."
      );
      return;
    }

    alert("Pedido registrado correctamente. No se realizó ningún cobro.");
  } catch (error) {
    console.error("No se pudo registrar el pedido.", error);
    alert(error.message || "No se pudo registrar el pedido.");
  }
}


// 11) Cargar esto apenas se abra cualquier página.
actualizarContadorNavbar();
renderizarPaginaCarrito();