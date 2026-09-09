const contenedor = document.getElementById("contenedor-productos");

function renderizarProductos(lista) {
  contenedor.innerHTML = "";

  lista.forEach(function (producto) {
    contenedor.innerHTML += `
      <div class="col-6 col-md-6 col-lg-3">
        <div class="tarjeta-producto p-3 text-center">
          
          <!-- El enlace ahora envuelve la imagen y el título del producto -->
          <a href="detalle-producto.html?id=${producto.id}" class="text-decoration-none" style="cursor: pointer;">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid mb-3">
            <p class="producto mb-1 text-white">${producto.nombre}</p>
          </a>
          
          <p class="precio mb-2">$ ${producto.precio.toLocaleString("es-CL")}</p>
          <button class="btn boton-cyan w-100">AÑADIR AL CARRITO</button>
        </div>
      </div>
    `;
  });
}

renderizarProductos(productos);