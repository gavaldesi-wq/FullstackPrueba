const gridDestacados = document.getElementById("grid-destacados");

gridDestacados.addEventListener("click", function (evento) {
  const boton = evento.target.closest(".btn-agregar-carrito");
  if (!boton) return;

  const id = Number(boton.dataset.id);

  const producto = productos.find(function (p) {
    return p.id === id;
  });

  if (!producto) return;

  const agregado = agregarAlCarrito(
    {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen
    },
    1
  );

  if (!agregado) return;

  const textoOriginal = boton.textContent;
  boton.textContent = "¡Agregado!";
  boton.disabled = true;

  setTimeout(function () {
    boton.textContent = textoOriginal;
    boton.disabled = false;
  }, 900);
});
