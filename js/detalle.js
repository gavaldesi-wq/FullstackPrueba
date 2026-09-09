const parametros = new URLSearchParams(window.location.search);
const idProducto = parseInt(parametros.get("id"));
const contenedor = document.getElementById("contenedor-detalle");
const productoEncontrado = productos.find(producto => producto.id === idProducto);

if (productoEncontrado) {
  
  let listaCaracteristicas = "";
  if (productoEncontrado.caracteristicas) {
    listaCaracteristicas = productoEncontrado.caracteristicas.map(c => `<li>${c}</li>`).join("");
  }

  contenedor.innerHTML = `
    
    
    <div class="row g-4 text-white">
      
      <!-Imagen >
      <div class="col-12 col-md-5 col-lg-4">
        <div class="bg-white p-4 rounded d-flex align-items-center justify-content-center" style="height: 350px;">
          <img src="${productoEncontrado.imagen}" class="img-fluid" style="max-height: 100%; object-fit: contain;" alt="${productoEncontrado.nombre}">
        </div>
      </div>

      <!Centro-->
      <div class="col-12 col-md-7 col-lg-5">
        <h1 class="fs-3 fw-bold mb-2">${productoEncontrado.nombre}</h1>
        <div class="d-flex align-items-center mb-4 text-warning">
          <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
          <span class="text-secondary ms-2 text-decoration-underline" style="font-size: 0.9rem;">5 Valoraciones</span>
        </div>
        
        <h5 class="fw-bold mt-4 mb-3">Características principales</h5>
        <ul class="list-unstyled text-secondary" style="font-size: 0.95rem;">
          <li class="mb-1"><strong>Marca:</strong> ${productoEncontrado.marca}</li>
          <li class="mb-1"><strong>Modelo:</strong> ${productoEncontrado.modelo}</li>
          <li class="mb-1"><strong>Condición:</strong> Nuevo y sellado</li>
          <li class="mb-1"><strong>Despacho:</strong> Envío a todo Chile</li>
          <li class="mb-1"><strong>Garantía:</strong> 6 meses por fallas de fábrica</li>
        </ul>
      </div>

      <!-- 3. Caja de Precio y Carrito (Derecha) -->
      <div class="col-12 col-lg-3">
        <div class="p-4 border rounded" style="background-color: rgba(255,255,255,0.05); border-color: #333 !important;">
          <p class="text-secondary mb-1" style="font-size: 0.85rem;">Precio normal</p>
          <p class="text-decoration-line-through text-secondary mb-1">$ ${(productoEncontrado.precio * 1.1).toLocaleString("es-CL")}</p>
          
          <p class="text-secondary mt-3 mb-1" style="font-size: 0.85rem;">Precio oferta</p>
          <h2 class="text-info fw-bold mb-4">$ ${productoEncontrado.precio.toLocaleString("es-CL")}</h2>
          
          <hr class="border-secondary">
          
          <button class="btn boton-cyan w-100 fw-bold py-2 mb-3 mt-2"><i class="bi bi-cart-plus me-2"></i>AÑADIR AL CARRITO</button>
          
          <div class="d-flex align-items-center justify-content-between text-secondary" style="font-size: 0.85rem;">
            <span>Cantidad:</span>
            <input type="number" id="cantidad" value="1" min="1" class="form-control text-center bg-dark text-white border-secondary" style="width: 70px; height: 30px;">
          </div>
        </div>
      </div>
    </div>

    <!-- Fila Inferior: Descripción Detallada -->
    <div class="row text-white mt-5 pt-3">
      <div class="col-12 col-lg-9">
        <h4 class="fw-bold border-bottom border-secondary pb-2 mb-4 d-flex align-items-center">
          Descripción <i class="bi bi-stars ms-2 text-info"></i>
        </h4>
        
        <h5 class="fw-bold">${productoEncontrado.nombre}</h5>
        
        <p class="text-secondary mt-3" style="line-height: 1.7; text-align: justify;">
          ${productoEncontrado.descripcionLarga || "Descripción no disponible para este producto."}
        </p>

        <h5 class="fw-bold mt-5 mb-3">Características destacadas</h5>
        <ul class="text-secondary" style="line-height: 1.8;">
          ${listaCaracteristicas || "<li>Características no especificadas.</li>"}
        </ul>
      </div>
    </div>
  `;
} else {
  contenedor.innerHTML = `
    <div class="col-12 text-center py-5">
      <i class="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
      <h2 class="text-white mb-4">El producto que buscas no existe.</h2>
      <a href="productos.html" class="btn boton-cyan px-4">Volver al catálogo</a>
    </div>
  `;
}