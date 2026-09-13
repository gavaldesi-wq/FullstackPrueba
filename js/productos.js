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
          <!-- data-id: acá guardamos el id del producto "pegado" al botón,
               para que el JS sepa después CUÁL producto agregar al hacer clic -->
          <button type="button" class="btn boton-cyan w-100 btn-agregar-carrito" data-id="${producto.id}">
            AÑADIR AL CARRITO
          </button>
        </div>
      </div>
    `;
  });
}

renderizarProductos(productos);


contenedor.addEventListener("click", function (evento) {

  const boton = evento.target.closest(".btn-agregar-carrito");
  if (!boton) return; 

  const id = Number(boton.dataset.id);
  const producto = productos.find(function (p) {
    return p.id === id;
  });
  if (!producto) return;


  agregarAlCarrito(
    { id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen },
    1
  );

  const textoOriginal = boton.textContent;
  boton.textContent = "¡Agregado!";
  boton.disabled = true;
  setTimeout(function () {
    boton.textContent = textoOriginal;
    boton.disabled = false;
  }, 900);
});