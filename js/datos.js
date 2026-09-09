const productos = [
  {
    id: 1,
    nombre: "ASUS ROG Strix GeForce RTX 4070 Ti OC Edition",
    marca: "ASUS",
    modelo: "RTX 4070 Ti",
    precio: 749990,
    imagen: "img/rtx4070ti.jpg",
    descripcionLarga: "La ROG Strix GeForce RTX 4070 Ti aporta un significado completamente nuevo al rendimiento térmico. Cuenta con un diseño mejorado con ventiladores Axial-tech que proporcionan un 31% más de flujo de aire. Perfecta para jugar a 1440p o 4K con Ray Tracing activado sin sacrificar fotogramas.",
    caracteristicas: [
      "Multiprocesadores Streaming NVIDIA Ada Lovelace: Hasta el doble de rendimiento y eficiencia energética.",
      "Tensor Cores de 4a Generación: Rendimiento de IA revolucionario con DLSS 3.",
      "RT Cores de 3a Generación: Hasta 2X en rendimiento de Ray Tracing.",
      "Ventiladores Axial-tech ampliados y disipador de 3.15 ranuras para menores temperaturas."
    ]
  },
  {
    id: 2,
    nombre: "Intel Core i9-12900K Processor",
    marca: "Intel",
    modelo: "i9-12900K",
    precio: 589990,
    imagen: "img/inteli912.jpg",
    descripcionLarga: "Con la nueva arquitectura híbrida de rendimiento de Intel, el Core i9-12900K distribuye el trabajo donde más se necesita, permitiéndote jugar, grabar y streamear de forma simultánea con fluidez. Es el procesador definitivo para la creación de contenido y gaming competitivo.",
    caracteristicas: [
      "16 Núcleos (8 P-cores de alto rendimiento y 8 E-cores eficientes).",
      "24 Hilos de procesamiento para multitarea extrema.",
      "Frecuencia Turbo Máxima de hasta 5.20 GHz.",
      "Soporte nativo para memoria DDR5 y conectividad PCIe 5.0."
    ]
  },
  {
    id: 3,
    nombre: "Corsair Vengeance RGB DDR5 32GB",
    marca: "Corsair",
    modelo: "Vengeance RGB DDR5",
    precio: 189990,
    imagen: "img/ramddr5.jpg",
    descripcionLarga: "Bienvenido a la vanguardia del rendimiento. La memoria DDR5 Corsair Vengeance RGB ofrece frecuencias más altas y mayores capacidades optimizadas para placas base Intel, iluminando tu PC con iluminación RGB dinámica de diez zonas con direccionamiento individual.",
    caracteristicas: [
      "Capacidad total de 32GB (2 módulos de 16GB).",
      "Velocidades extremas de hasta 6000MT/s para tiempos de carga ultrarrápidos.",
      "Regulación de voltaje integrada (PMIC) para un overclocking más fácil y estable.",
      "Perfiles Intel XMP 3.0 personalizados a través del software Corsair iCUE."
    ]
  },
  {
    id: 4,
    nombre: "Samsung 990 Pro 2TB NVMe SSD",
    marca: "Samsung",
    modelo: "990 Pro 2TB",
    precio: 159990,
    imagen: "img/ssd.jpg",
    descripcionLarga: "Alcanza el máximo rendimiento de PCIe 4.0. El Samsung 990 Pro ofrece velocidades de lectura y escritura vertiginosas, ideales para gaming en 4K, edición de video en 3D y análisis de datos. Su controlador con recubrimiento de níquel gestiona eficazmente el calor.",
    caracteristicas: [
      "Velocidades de lectura secuencial de hasta 7450 MB/s y escritura de 6900 MB/s.",
      "Capacidad de almacenamiento masivo de 2TB.",
      "Eficiencia energética mejorada, consumiendo menos energía que la generación anterior.",
      "Compatible con PC de escritorio, laptops y consolas PlayStation 5."
    ]
  },
  {
    id: 5,
    nombre: "ASUS ROG Strix Z790-E Motherboard",
    marca: "ASUS",
    modelo: "Z790-E",
    precio: 749990,
    imagen: "img/placa1.jpg",
    descripcionLarga: "Diseñada para dominar. La ROG Strix Z790-E Gaming WiFi impulsa las configuraciones más exigentes con un diseño de suministro de energía robusto y una refrigeración integral. Está preparada para sacar el máximo partido a los procesadores Intel Core de 12.ª y 13.ª generación.",
    caracteristicas: [
      "Socket Intel LGA 1700 con soporte para PCIe 5.0 y memoria DDR5.",
      "Conectividad ultrarrápida: WiFi 6E integrado, Intel 2.5 Gb Ethernet y Bluetooth 5.3.",
      "5 puertos M.2 (uno PCIe 5.0) con disipadores térmicos integrados.",
      "Tecnologías exclusivas ASUS AI Overclocking y AI Cooling II."
    ]
  },
  {
    id: 6,
    nombre: "Corsair RM750 750W Power Supply",
    marca: "Corsair",
    modelo: "RM750",
    precio: 589990,
    imagen: "img/fuente.jpg",
    descripcionLarga: "Energía fiable y silenciosa. Las fuentes de alimentación de la serie RM de Corsair, totalmente modulares y con certificación 80 PLUS Gold, proporcionan una potencia eficiente a su PC con un funcionamiento prácticamente inaudible gracias a su ventilador con modo Zero RPM.",
    caracteristicas: [
      "750W de potencia continua para alimentar componentes de gama alta.",
      "Certificación 80 PLUS Gold para una eficiencia operativa de hasta el 90%.",
      "Cables totalmente modulares (tipo plano) para un ensamblaje limpio e impecable.",
      "Ventilador de levitación magnética de 135 mm silencioso con modo Zero RPM."
    ]
  },
  {
    id: 7,
    nombre: "Corsair iCUE H100i Liquid Cooler",
    marca: "Corsair",
    modelo: "iCUE H100i",
    precio: 189990,
    imagen: "img/cooler.jpg",
    descripcionLarga: "Refrigeración extrema con un estilo deslumbrante. El H100i Elite Capellix XT ofrece una refrigeración líquida de CPU potente y silenciosa. Incluye un radiador de 240 mm y dos ventiladores PWM que garantizan que tu procesador se mantenga fresco incluso en las cargas más intensas.",
    caracteristicas: [
      "Radiador de 240 mm de alta densidad para una excelente disipación térmica.",
      "Dos ventiladores Corsair AF120 RGB Elite PWM (hasta 2100 RPM).",
      "Cabezal de bomba iluminado con 33 LEDs RGB Capellix ultrabrillantes.",
      "Incluye el controlador Commander Core para gestión inteligente de luz y velocidad."
    ]
  },
  {
    id: 8,
    nombre: "Corsair LL120 RGB Case Fans (3-Pack)",
    marca: "Corsair",
    modelo: "LL120 RGB",
    precio: 159990,
    imagen: "img/ventiladores.jpg",
    descripcionLarga: "Flujo de aire superior y una iluminación espectacular. El kit de 3 ventiladores Corsair LL120 RGB cuenta con 16 LED RGB independientes en dos halos de luz separados en cada ventilador, creando efectos visuales vibrantes y personalizados a través de iCUE.",
    caracteristicas: [
      "Control PWM dinámico que permite ajustar la velocidad entre 600 y 1500 RPM.",
      "Nivel de ruido optimizado de 24.8 dBA para un funcionamiento silencioso.",
      "Diseño de aspas optimizado para mejorar el flujo de aire y la presión estática.",
      "Incluye Lighting Node PRO para una sincronización RGB perfecta."
    ]
  }
];