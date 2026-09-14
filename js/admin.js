if (exigirAdministrador()) {

function mostrarProductosAdmin() {
    const tabla = document.getElementById("tabla-productos");
    const resumen = document.getElementById("resumen-productos");

    tabla.replaceChildren();
    resumen.textContent = `Productos registrados: ${productos.length}`;

    productos.forEach(function (producto) {
        const fila = document.createElement("tr");

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
            celda.textContent = valor;
            fila.append(celda);
        });

        if (estado !== "Disponible") {
            fila.lastElementChild.classList.add("text-warning", "fw-bold");
        }
        const acciones = document.createElement("td");
        const botonEditar = document.createElement("button");

        botonEditar.type = "button";
        botonEditar.className = "btn btn-outline-info btn-sm";
        botonEditar.textContent = "Editar";

        botonEditar.addEventListener("click", function () {
            cargarProductoEnFormulario(producto.id);
        });

        acciones.append(botonEditar);
        fila.append(acciones);

        tabla.append(fila);
    });
}

mostrarProductosAdmin();

const formularioProducto = document.getElementById("form-producto");
const mensajeProducto = document.getElementById("mensaje-producto");

function obtenerTexto(id) {
    return document.getElementById(id).value.trim();
}

formularioProducto.addEventListener("submit", function (evento) {
    evento.preventDefault();
    mensajeProducto.textContent = "";
    mensajeProducto.className = "mt-3 text-warning";

    const idTexto = obtenerTexto("producto-id");
    const idEdicion = idTexto === "" ? null : Number(idTexto);

    const codigo = obtenerTexto("producto-codigo");
    const nombre = obtenerTexto("producto-nombre");
    const categoria = obtenerTexto("producto-categoria");
    const descripcion = obtenerTexto("producto-descripcion");

    const precioTexto = obtenerTexto("producto-precio");
    const stockTexto = obtenerTexto("producto-stock");
    const criticoTexto = obtenerTexto("producto-stock-critico");

    const precio = Number(precioTexto);
    const stock = Number(stockTexto);
    const stockCritico = criticoTexto === "" ? null : Number(criticoTexto);

    const errores = [];

    if (codigo.length < 3) {
        errores.push("El código debe tener al menos 3 caracteres.");
    }

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

    if (precioTexto === "" || !Number.isFinite(precio) || precio < 0) {
        errores.push("El precio debe ser un número mayor o igual a cero.");
    }

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

    if (errores.length > 0) {
        mensajeProducto.textContent = errores.join(" ");
        return;
    }

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
        caracteristicas: obtenerTexto("producto-caracteristicas")
            .split("\n")
            .map(function (linea) {
                return linea.trim();
            })
            .filter(function (linea) {
                return linea !== "";
            })
    };

    const indice = productos.findIndex(function (producto) {
        return producto.id === idEdicion;
    });

    if (idEdicion !== null && indice === -1) {
        mensajeProducto.textContent = "No se encontró el producto para editar.";
        return;
    }

    const productoAnterior = indice === -1 ? null : productos[indice];

    if (indice === -1) {
        productos.push(nuevoProducto);
    } else {
        productos[indice] = {
            ...productoAnterior,
            ...nuevoProducto
        };
    }

    try {
        guardarProductos();
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

    mostrarProductosAdmin();
    formularioProducto.reset();
    document.getElementById("producto-id").value = "";
    document.getElementById("titulo-formulario").textContent = "Nuevo producto";

    mensajeProducto.className = "mt-3 text-success";
    mensajeProducto.textContent = idEdicion === null
        ? "Producto creado correctamente."
        : "Producto actualizado correctamente.";
});

document.getElementById("cancelar-edicion")
    .addEventListener("click", function () {
        formularioProducto.reset();
        document.getElementById("producto-id").value = "";
        document.getElementById("titulo-formulario").textContent =
            "Nuevo producto";
        mensajeProducto.textContent = "";
    });

function cargarProductoEnFormulario(idProducto) {
    const producto = productos.find(function (producto) {
        return producto.id === idProducto;
    });

    if (!producto) {
        return;
    }

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
        "producto-caracteristicas": (producto.caracteristicas ?? []).join("\n")
    };

    Object.entries(campos).forEach(function ([id, valor]) {
        document.getElementById(id).value = valor;
    });

    document.getElementById("titulo-formulario").textContent =
        "Editar producto";

    mensajeProducto.textContent = "";
    formularioProducto.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    document.getElementById("producto-nombre").focus();
}
}