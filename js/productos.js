const productos = [
  {
    id: 1,
    nombre: "ASUS ROG Strix GeForce RTX 4070 Ti OC Edition",
    marca: "ASUS",
    modelo: "RTX 4070 Ti",
    precio: 749990,
    imagen: "img/rtx4070ti.jpg"
  },
  {
    id: 2,
    nombre: "Intel Core i9-12900K Processor",
    marca: "Intel",
    modelo: "i9-12900K",
    precio: 589990,
    imagen: "img/inteli912.jpg"
  },
  {
    id: 3,
    nombre: "Corsair Vengeance RGB DDR5 32GB",
    marca: "Corsair",
    modelo: "Vengeance RGB DDR5",
    precio: 189990,
    imagen: "img/ramddr5.jpg"
  },
  {
    id: 4,
    nombre: "Samsung 990 Pro 2TB NVMe SSD",
    marca: "Samsung",
    modelo: "990 Pro 2TB",
    precio: 159990,
    imagen: "img/ssd.jpg"
  },
  {
    id: 5,
    nombre: "ASUS ROG Strix Z790-E Motherboard",
    marca: "ASUS",
    modelo: "Z790-E",
    precio: 749990,
    imagen: "img/placa1.jpg"
  },
  {
    id: 6,
    nombre: "Corsair RM750 750W Power Supply",
    marca: "Corsair",
    modelo: "RM750",
    precio: 589990,
    imagen: "img/fuente.jpg"
  },
  {
    id: 7,
    nombre: "Corsair iCUE H100i Liquid Cooler",
    marca: "Corsair",
    modelo: "iCUE H100i",
    precio: 189990,
    imagen: "img/cooler.jpg"
  },
  {
    id: 8,
    nombre: "Corsair LL120 RGB Case Fans (3-Pack)",
    marca: "Corsair",
    modelo: "LL120 RGB",
    precio: 159990,
    imagen: "img/ventiladores.jpg"
  }
];

const contenedor = document.getElementById("contenedor-productos");

function renderizarProductos(lista) {
  contenedor.innerHTML = "";

  lista.forEach(function (producto) {
    contenedor.innerHTML += `
      <div class="col-6 col-md-6 col-lg-3">
        <div class="tarjeta-producto p-3 text-center">
          <a href="detalle-producto.html">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid">
          </a>
          <p class="producto mt-3 mb-1">${producto.nombre}</p>
          <p class="precio mb-2">$ ${producto.precio.toLocaleString("es-CL")}</p>
          <button class="btn boton-cyan w-100">AÑADIR AL CARRITO</button>
        </div>
      </div>
    `;
  });
}

// Cargar todos los productos inmediatamente
renderizarProductos(productos);