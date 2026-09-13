const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
function agregarAlCarrito(idProducto, cantidad = 1) {
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    alert("Ingresa una cantidad entera mayor que cero.");
    return;
  }

  const producto = productos.find(function (producto) {
    return producto.id === idProducto;
  });

  if (!producto) {
    return;
  }

  const item = carrito.find(function (item) {
    return item.id === idProducto;
  });

  const cantidadActual = item ? item.cantidad : 0;

  if (cantidadActual + cantidad > producto.stock) {
    alert("La cantidad solicitada supera el stock disponible.");
    return;
  }

  if (item) {
    item.cantidad += cantidad;
  } else {
    carrito.push({
      id: idProducto,
      cantidad: cantidad
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  console.table(carrito);
}

function mostrarCarrito() {
  const contenedorCarrito = document.getElementById("contenedor-carrito");
  const totalCarrito = document.getElementById("total-carrito");

  if (!contenedorCarrito || !totalCarrito) {
    return;
  }

  contenedorCarrito.replaceChildren();
  let total = 0;

  carrito.forEach(function (item) {
    const producto = productos.find(function (producto) {
      return producto.id === item.id;
    });

    if (!producto) {
      return;
    }

    const subtotal = producto.precio * item.cantidad;
    total += subtotal;

    const fila = document.createElement("div");
    fila.className = "border-bottom border-secondary py-3";

    const nombre = document.createElement("h3");
    nombre.className = "fs-6";
    nombre.textContent = producto.nombre;

    const resumen = document.createElement("p");
    resumen.className = "mb-0";
    resumen.textContent =
      `Cantidad: ${item.cantidad} | Subtotal: $${subtotal.toLocaleString("es-CL")}`;
      const etiquetaCantidad = document.createElement("label");
 etiquetaCantidad.htmlFor = `cantidad-carrito-${item.id}`;
etiquetaCantidad.className = "form-label mt-2";
etiquetaCantidad.textContent = "Cantidad:";

const campoCantidad = document.createElement("input");
campoCantidad.type = "number";
campoCantidad.id = `cantidad-carrito-${item.id}`;
campoCantidad.min = "1";
campoCantidad.max = String(producto.stock);
campoCantidad.step = "1";
campoCantidad.value = item.cantidad;
campoCantidad.className = "form-control w-auto";

campoCantidad.addEventListener("change", function () {
  const nuevaCantidad = Number(campoCantidad.value);
  cambiarCantidad(item.id, nuevaCantidad);
});

    const botonEliminar = document.createElement("button");
botonEliminar.type = "button";
botonEliminar.className = "btn btn-outline-danger btn-sm mt-2";
botonEliminar.textContent = "Eliminar";

botonEliminar.addEventListener("click", function () {
  eliminarDelCarrito(item.id);
});

fila.append(
  nombre,
  resumen,
  etiquetaCantidad,
  campoCantidad,
  botonEliminar
);
contenedorCarrito.append(fila);
  });

  if (contenedorCarrito.childElementCount === 0) {
    contenedorCarrito.textContent = "Tu carrito está vacío.";
  }

  totalCarrito.textContent = `$${total.toLocaleString("es-CL")}`;
}
function eliminarDelCarrito(idProducto) {
  const indice = carrito.findIndex(function (item) {
    return item.id === idProducto;
  });

  if (indice === -1) {
    return;
  }

  carrito.splice(indice, 1);

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}
function cambiarCantidad(idProducto, nuevaCantidad) {
  const producto = productos.find(function (producto) {
    return producto.id === idProducto;
  });

  const item = carrito.find(function (item) {
    return item.id === idProducto;
  });

  if (!producto || !item) {
    return;
  }

  if (!Number.isInteger(nuevaCantidad) || nuevaCantidad <= 0) {
    alert("Ingresa una cantidad entera mayor que cero.");
    mostrarCarrito();
    return;
  }

  if (nuevaCantidad > producto.stock) {
    alert("La cantidad solicitada supera el stock disponible.");
    mostrarCarrito();
    return;
  }

  item.cantidad = nuevaCantidad;

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}
mostrarCarrito();
