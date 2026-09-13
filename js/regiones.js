
const regionesYComunas = {
  "Arica y Parinacota": ["Arica", "Putre", "Camarones"],
  "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte"],
  "Antofagasta": ["Antofagasta", "Calama", "Tocopilla", "Mejillones"],
  "Atacama": ["Copiapó", "Vallenar", "Caldera"],
  "Coquimbo": ["La Serena", "Coquimbo", "Ovalle", "Illapel"],
  "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Quillota"],
  "Región Metropolitana de Santiago": [
    "Santiago", "Providencia", "Las Condes", "Ñuñoa", "Conchalí",
    "Maipú", "La Florida", "Puente Alto", "San Miguel", "Recoleta",
    "Independencia", "Quilicura", "La Reina", "Macul", "Peñalolén"
  ],
  "Libertador General Bernardo O'Higgins": ["Rancagua", "San Fernando", "Rengo", "Machalí"],
  "Maule": ["Talca", "Curicó", "Linares", "Constitución"],
  "Ñuble": ["Chillán", "San Carlos", "Bulnes", "Chillán Viejo"],
  "Biobío": ["Concepción", "Talcahuano", "Los Ángeles", "Coronel", "Chiguayante"],
  "La Araucanía": ["Temuco", "Villarrica", "Angol", "Pucón"],
  "Los Ríos": ["Valdivia", "La Unión", "Río Bueno"],
  "Los Lagos": ["Puerto Montt", "Osorno", "Castro", "Ancud"],
  "Aysén": ["Coyhaique", "Puerto Aysén", "Chile Chico"],
  "Magallanes y de la Antártica Chilena": ["Punta Arenas", "Puerto Natales", "Porvenir"]
};


const selectRegion = document.getElementById("region");
const selectComuna = document.getElementById("comuna");


Object.keys(regionesYComunas).forEach(function (nombreRegion) {
  const opcion = document.createElement("option");
  opcion.value = nombreRegion;         
  opcion.textContent = nombreRegion;  
  selectRegion.appendChild(opcion);
});



selectRegion.addEventListener("change", function () {

  selectComuna.innerHTML = '<option selected disabled value="">-- Selecciona la comuna --</option>';


  const comunas = regionesYComunas[selectRegion.value] || [];

  comunas.forEach(function (nombreComuna) {
    const opcion = document.createElement("option");
    opcion.value = nombreComuna;
    opcion.textContent = nombreComuna;
    selectComuna.appendChild(opcion);
  });
});
