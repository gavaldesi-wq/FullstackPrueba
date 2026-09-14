// Preparamos las funciones del panel solo si la sesión tiene el rol Administrador.
if (exigirAdministrador()) {

// Armamos la tabla usando la lista de productos cargada desde datos.js.
function mostrarProductosAdmin() {
    const tabla = document.getElementById("tabla-productos");
    const resumen = document.getElementById("resumen-productos");

    // Borramos las filas anteriores para no repetirlas cada vez que actualizamos la tabla.
    tabla.replaceChildren();
    resumen.textContent = `Productos registrados: ${productos.length}`;

    productos.forEach(function (producto) {
        const fila = document.createElement("tr");

        // El estado depende de las existencias. Solo comparamos con stock crítico si ese límite está definido.
        let estado = "Disponible";

        if (producto.stock === 0) {
            estado = "Sin stock";
        } else if (
            producto.stockCritico !== undefined &&
            producto.stockCritico !== null &&
            producto.stockCritico !== "" &&
            producto.stock <= producto.stockCritico
        ) {
            estado = "Stock crítico";
        }

        // El orden de estos valores debe coincidir con las columnas del encabezado en admin.html.
        const valores = [
            producto.codigo,
            producto.nombre,
            producto.categoria,
            `$${producto.precio.toLocaleString("es-CL")}`,
            producto.stock,
            estado
        ];

        valores.forEach(function (valor) {
            const celda = document.createElement("td");
            // Insertamos los datos como texto, sin interpretarlos como HTML.
            celda.textContent = valor;
            fila.append(celda);
        });

        // Resaltamos la celda de estado cuando no hay stock o se alcanzó el límite crítico.
        if (estado !== "Disponible") {
            fila.lastElementChild.classList.add("text-warning", "fw-bold");
        }
        const acciones = document.createElement("td");
        const botonEditar = document.createElement("button");

        botonEditar.type = "button";
        botonEditar.className = "btn btn-outline-info btn-sm";
        botonEditar.textContent = "Editar";

        // Cada botón carga en el formulario el producto correspondiente a su fila.
        botonEditar.addEventListener("click", function () {
            cargarProductoEnFormulario(producto.id);
        });

        acciones.append(botonEditar);
        fila.append(acciones);

        tabla.append(fila);
    });
}

// Dibujamos la tabla con los datos que tiene actualmente el arreglo productos.
mostrarProductosAdmin();

const formularioProducto = document.getElementById("form-producto");
const mensajeProducto = document.getElementById("mensaje-producto");

// Leemos el campo indicado y quitamos espacios sobrantes al principio y al final.
function obtenerTexto(id) {
    return document.getElementById(id).value.trim();
}

// Procesamos el formulario con JavaScript para validar y guardar sin recargar la página.
formularioProducto.addEventListener("submit", function (evento) {
    evento.preventDefault();
    mensajeProducto.textContent = "";
    mensajeProducto.className = "mt-3 text-warning";

    const idTexto = obtenerTexto("producto-id");
    // Sin ID estamos creando un producto; con ID estamos editando uno existente.
    const idEdicion = idTexto === "" ? null : Number(idTexto);

    const codigo = obtenerTexto("producto-codigo");
    const nombre = obtenerTexto("producto-nombre");
    const categoria = obtenerTexto("producto-categoria");
    const descripcion = obtenerTexto("producto-descripcion");

    // Conservamos también el texto original: Number convierte un campo vacío en 0 y necesitamos distinguirlos.
    const precioTexto = obtenerTexto("producto-precio");
    const stockTexto = obtenerTexto("producto-stock");
    const criticoTexto = obtenerTexto("producto-stock-critico");

    const precio = Number(precioTexto);
    const stock = Number(stockTexto);
    // Un límite vacío se guarda como null porque el stock crítico es opcional.
    const stockCritico = criticoTexto === "" ? null : Number(criticoTexto);

    // Reunimos todos los errores para mostrarlos juntos al intentar guardar.
    const errores = [];

    if (codigo.length < 3) {
        errores.push("El código debe tener al menos 3 caracteres.");
    }

    // El código no puede repetirse. Al editar, excluimos el propio producto de la búsqueda.
    if (productos.some(function (producto) {
        return producto.codigo.toLowerCase() === codigo.toLowerCase()
            && producto.id !== idEdicion;
    })) {
        errores.push("Ese código ya pertenece a otro producto.");
    }

    if (nombre.length === 0 || nombre.length > 100) {
        errores.push("El nombre es obligatorio y admite hasta 100 caracteres.");
    }

    if (!categoria) {
        errores.push("Selecciona una categoría.");
    }

    // Aceptamos precio cero y decimales, pero no campos vacíos, valores negativos ni números no finitos.
    if (precioTexto === "" || !Number.isFinite(precio) || precio < 0) {
        errores.push("El precio debe ser un número mayor o igual a cero.");
    }

    // Las existencias se cuentan en unidades enteras; cero significa que no hay stock.
    if (stockTexto === "" || !Number.isInteger(stock) || stock < 0) {
        errores.push("El stock debe ser un número entero mayor o igual a cero.");
    }

    if (
        stockCritico !== null &&
        (!Number.isInteger(stockCritico) || stockCritico < 0)
    ) {
        errores.push("El stock crítico debe ser un entero mayor o igual a cero.");
    }

    if (descripcion.length > 500) {
        errores.push("La descripción admite hasta 500 caracteres.");
    }

    // Si algún dato falla, mostramos los mensajes y no modificamos la lista.
    if (errores.length > 0) {
        mensajeProducto.textContent = errores.join(" ");
        return;
    }

    // Reunimos los datos validados. Conservamos el ID al editar; para uno nuevo usamos el mayor ID más uno.
    const nuevoProducto = {
        id: idEdicion ?? (
            Math.max(0, ...productos.map(function (producto) {
                return producto.id;
            })) + 1
        ),
        codigo: codigo,
        nombre: nombre,
        categoria: categoria,
        precio: precio,
        stock: stock,
        stockCritico: stockCritico,
        marca: obtenerTexto("producto-marca"),
        modelo: obtenerTexto("producto-modelo"),
        imagen: obtenerTexto("producto-imagen"),
        descripcionLarga: descripcion,
        // Cada línea del campo será una característica. Quitamos espacios y descartamos líneas vacías.
        caracteristicas: obtenerTexto("producto-caracteristicas")
            .split("\n")
            .map(function (linea) {
                return linea.trim();
            })
            .filter(function (linea) {
                return linea !== "";
            })
    };

    // Buscamos la posición del producto que se está editando; -1 indica que no está en la lista.
    const indice = productos.findIndex(function (producto) {
        return producto.id === idEdicion;
    });

    if (idEdicion !== null && indice === -1) {
        mensajeProducto.textContent = "No se encontró el producto para editar.";
        return;
    }

    // Conservamos el objeto anterior para recuperarlo si falla el guardado.
    const productoAnterior = indice === -1 ? null : productos[indice];

    if (indice === -1) {
        // Si es nuevo, lo agregamos al final del arreglo.
        productos.push(nuevoProducto);
    } else {
        // Al editar, mantenemos los campos anteriores y reemplazamos los que vienen del formulario.
        productos[indice] = {
            ...productoAnterior,
            ...nuevoProducto
        };
    }

    try {
        // Esta función de datos.js guarda el catálogo en localStorage del navegador.
        guardarProductos();
    // Si no se pudo guardar, deshacemos el cambio en memoria y avisamos en el formulario.
    } catch (error) {
        if (indice === -1) {
            productos.pop();
        } else {
            productos[indice] = productoAnterior;
        }

        mensajeProducto.textContent =
            "No se pudieron guardar los cambios. Intenta nuevamente.";
        return;
    }

    // Dibujamos la tabla con los datos que tiene actualmente el arreglo productos.
    mostrarProductosAdmin();
    formularioProducto.reset();
    // Borramos el ID oculto para que el próximo guardado cree un producto nuevo.
    document.getElementById("producto-id").value = "";
    document.getElementById("titulo-formulario").textContent = "Nuevo producto";

    mensajeProducto.className = "mt-3 text-success";
    mensajeProducto.textContent = idEdicion === null
        ? "Producto creado correctamente."
        : "Producto actualizado correctamente.";
});

// Limpiar formulario también permite cancelar una edición sin guardar sus cambios.
document.getElementById("cancelar-edicion")
    .addEventListener("click", function () {
        formularioProducto.reset();
        // Borramos el ID oculto para que el próximo guardado cree un producto nuevo.
        document.getElementById("producto-id").value = "";
        document.getElementById("titulo-formulario").textContent =
            "Nuevo producto";
        mensajeProducto.textContent = "";
    });

// Buscamos el producto elegido y colocamos sus datos en los campos para poder editarlos.
function cargarProductoEnFormulario(idProducto) {
    const producto = productos.find(function (producto) {
        return producto.id === idProducto;
    });

    if (!producto) {
        return;
    }

    // Relacionamos cada campo HTML con su dato. ?? deja vacío un valor opcional que no exista.
    const campos = {
        "producto-id": producto.id,
        "producto-codigo": producto.codigo,
        "producto-nombre": producto.nombre,
        "producto-categoria": producto.categoria,
        "producto-precio": producto.precio,
        "producto-stock": producto.stock,
        "producto-stock-critico": producto.stockCritico ?? "",
        "producto-marca": producto.marca ?? "",
        "producto-modelo": producto.modelo ?? "",
        "producto-imagen": producto.imagen ?? "",
        "producto-descripcion": producto.descripcionLarga ?? "",
        // Convertimos el arreglo de características en un texto con una característica por línea.
        "producto-caracteristicas": (producto.caracteristicas ?? []).join("\n")
    };

    // Recorremos las parejas de identificador y valor para completar el formulario.
    Object.entries(campos).forEach(function ([id, valor]) {
        document.getElementById(id).value = valor;
    });

    document.getElementById("titulo-formulario").textContent =
        "Editar producto";

    mensajeProducto.textContent = "";
    // Acercamos el formulario a la vista y después dejamos el cursor en el nombre.
    formularioProducto.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    document.getElementById("producto-nombre").focus();
}
}
