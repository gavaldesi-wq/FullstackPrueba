// Generamos una huella para comparar contraseñas sin guardarlas como texto.
// async y await permiten esperar el cálculo antes de seguir con el registro o login.
async function generarHuella(contrasena, sal) {
  // La API de criptografía trabaja con bytes; TextEncoder convierte nuestros textos a ese formato.
  const codificador = new TextEncoder();

  // Preparamos la contraseña como clave de entrada para PBKDF2.
  // false indica que esta clave no se puede exportar mediante la API.
  const clave = await crypto.subtle.importKey(
    "raw",
    codificador.encode(contrasena),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  // PBKDF2 combina la contraseña y la sal mediante muchas iteraciones.
  // Esto aumenta el trabajo necesario para probar contraseñas por fuerza bruta.
  const resultado = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: codificador.encode(sal),
      iterations: 600000,
      hash: "SHA-256"
    },
    clave,
    256 // Tamaño de la huella resultante en bits: equivale a 32 bytes.
  );

  // Convertimos cada byte en dos caracteres hexadecimales para guardar la huella como texto.
  // En el login repetimos el cálculo con la misma sal y comparamos las dos huellas.
  return Array.from(new Uint8Array(resultado))
    .map(function (numero) {
      return numero.toString(16).padStart(2, "0");
    })
    .join("");
}

// La sal es un valor aleatorio por cuenta. Hace que una misma contraseña pueda dar huellas distintas.
// Se guarda junto a la huella: no necesita ser secreta y se reutiliza al verificar el login.
function crearSal() {
  const numeros = crypto.getRandomValues(new Uint8Array(16));

  // Pasamos los 16 bytes aleatorios a texto hexadecimal, igual que hacemos con la huella.
  return Array.from(numeros)
    .map(function (numero) {
      return numero.toString(16).padStart(2, "0");
    })
    .join("");
}

// Leemos las mismas cuentas que utilizan el registro y la administración de usuarios.
// Estos datos pertenecen al navegador y al sitio actual; no son una base de datos compartida.
function leerCuentas() {
  const contenido = localStorage.getItem("pcshop-usuarios");
  const lista = contenido === null ? [] : JSON.parse(contenido);

  // Comprobamos que lo recuperado sea una lista. Esto no valida todavía los campos de cada cuenta.
  // Si el JSON está dañado, JSON.parse también lanza un error que debe manejar quien llame esta función.
  if (!Array.isArray(lista)) {
    throw new Error("La lista de usuarios guardada no es válida.");
  }

  return lista;
}

// Crea un administrador inicial para las demostraciones.
// Solo se crea si todavía no existe.
async function crearAdministradorInicial() {
  const cuentas = leerCuentas();

  const correoAdmin = "admin@duoc.cl";

  // Revisamos si el administrador ya existe.
  const existeAdmin = cuentas.some(function (usuario) {
    return usuario.correo.toLowerCase() === correoAdmin;
  });
 
  if (existeAdmin) {
    return;
  }

  // Contraseña que utilizaremos para entrar como administrador.
  const contrasena = "admin123";

  // Creamos la sal y la huella igual que en el registro normal.
  const sal = crearSal();
  const contrasenaHash = await generarHuella(contrasena, sal);

  const administrador = {
    id: Math.max(
      0,
      ...cuentas.map(function (usuario) {
        return usuario.id;
      })
    ) + 1,

    run: "123456785",
    nombre: "Administrador",
    apellidos: "PC-SHOP",
    correo: correoAdmin,
    fechaNacimiento: "2000-01-01",
    region: "Región Metropolitana de Santiago",
    comuna: "Santiago",
    direccion: "PC-SHOP",
    tipo: "Administrador",

    sal: sal,
    contrasenaHash: contrasenaHash
  };

  cuentas.push(administrador);

  localStorage.setItem(
    "pcshop-usuarios",
    JSON.stringify(cuentas)
  );

  console.log("Administrador inicial creado.");
}