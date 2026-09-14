if (exigirPersonal()) {
  const usuarioActual = obtenerUsuarioActual();

  document.getElementById("saludo-ventas").textContent =
    `Hola, ${usuarioActual.nombre}. Perfil: ${usuarioActual.tipo}.`;

  document.getElementById("salir-ventas")
    .addEventListener("click", cerrarSesion);

  function agregarTexto(contenedor, texto) {
    const parrafo = document.createElement("p");
    parrafo.className = "mb-2";
    parrafo.textContent = texto;
    contenedor.append(parrafo);
  }

  function crearDetalle(titulo) {
    const detalle = document.createElement("details");
    detalle.className = "border border-secondary rounded p-3 mb-3";

    const resumen = document.createElement("summary");
    resumen.className = "fw-bold";
    resumen.textContent = titulo;

    detalle.append(resumen);
    return detalle;
  }

  const listaProductos = document.getElementById("lista-productos-ventas");

  productos.forEach(function (producto) {
    const detalle = crearDetalle(
      `${producto.codigo} — ${producto.nombre}`
    );

    agregarTexto(detalle, `Categoría: ${producto.categoria}`);
    agregarTexto(
      detalle,
      `Precio: $${producto.precio.toLocaleString("es-CL")}`
    );
    agregarTexto(detalle, `Stock disponible: ${producto.stock}`);
    agregarTexto(detalle, `Marca: ${producto.marca || "Sin especificar"}`);
    agregarTexto(detalle, `Modelo: ${producto.modelo || "Sin especificar"}`);
    agregarTexto(
      detalle,
      producto.descripcionLarga || "Sin descripción."
    );

    const caracteristicas = document.createElement("ul");

    (producto.caracteristicas || []).forEach(function (texto) {
      const elemento = document.createElement("li");
      elemento.textContent = texto;
      caracteristicas.append(elemento);
    });

    detalle.append(caracteristicas);
    listaProductos.append(detalle);
  });

  const listaOrdenes = document.getElementById("lista-ordenes-ventas");
  const estadoOrdenes = document.getElementById("estado-ordenes");

  try {
    const contenido = localStorage.getItem("pcshop-ordenes");
    const ordenes = contenido === null ? [] : JSON.parse(contenido);

    if (!Array.isArray(ordenes)) {
      throw new Error("El listado de órdenes no es válido.");
    }

    estadoOrdenes.textContent = ordenes.length === 0
      ? "Todavía no hay órdenes registradas."
      : `Órdenes registradas: ${ordenes.length}`;

    ordenes.slice().reverse().forEach(function (orden) {
      const detalle = crearDetalle(
        `Orden ${orden.id.slice(0, 8)} — ${orden.estado}`
      );

      agregarTexto(detalle, `Identificador completo: ${orden.id}`);
      agregarTexto(
        detalle,
        `Fecha: ${new Date(orden.fecha).toLocaleString("es-CL")}`
      );
      agregarTexto(detalle, `Cliente: ${orden.cliente}`);
      agregarTexto(detalle, `Correo: ${orden.correo}`);
      agregarTexto(
        detalle,
        `Entrega: ${orden.direccion}, ${orden.comuna}, ${orden.region}`
      );

      const productosOrden = document.createElement("ul");

      orden.detalle.forEach(function (item) {
        const elemento = document.createElement("li");
        elemento.textContent =
          `${item.nombre} — ${item.cantidad} unidades × ` +
          `$${item.precio.toLocaleString("es-CL")} — ` +
          `Subtotal: $${item.subtotal.toLocaleString("es-CL")}`;

        productosOrden.append(elemento);
      });

      detalle.append(productosOrden);
      agregarTexto(
        detalle,
        `Total: $${orden.total.toLocaleString("es-CL")}`
      );

      listaOrdenes.append(detalle);
    });
  } catch (error) {
    listaOrdenes.replaceChildren();
    estadoOrdenes.textContent =
      "No se pudieron cargar las órdenes. Revisa la consola.";
    console.error(error);
  }
}