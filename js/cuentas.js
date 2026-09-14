async function generarHuella(contrasena, sal) {
  const codificador = new TextEncoder();

  const clave = await crypto.subtle.importKey(
    "raw",
    codificador.encode(contrasena),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const resultado = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: codificador.encode(sal),
      iterations: 600000,
      hash: "SHA-256"
    },
    clave,
    256
  );

  return Array.from(new Uint8Array(resultado))
    .map(function (numero) {
      return numero.toString(16).padStart(2, "0");
    })
    .join("");
}

function crearSal() {
  const numeros = crypto.getRandomValues(new Uint8Array(16));

  return Array.from(numeros)
    .map(function (numero) {
      return numero.toString(16).padStart(2, "0");
    })
    .join("");
}

function leerCuentas() {
  const contenido = localStorage.getItem("pcshop-usuarios");
  const lista = contenido === null ? [] : JSON.parse(contenido);

  if (!Array.isArray(lista)) {
    throw new Error("La lista de usuarios guardada no es válida.");
  }

  return lista;
}