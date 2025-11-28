// Utilidades para procesamiento de datos de pedidos por comuna

export interface ComunaInfo {
  id: string;
  nombre: string;
  pedidos: number;
  trend: string;
}

export interface PedidoConComuna {
  id: number;
  cliente_nombre: string;
  cliente_direccion: string;
  cliente_telefono: string;
  productos: string;
  total_precio: string;
  estado: string;
  fecha_hora: string;
  comuna_id?: string;
  comuna_nombre?: string;
}

// Mapeo de direcciones típicas de Medellín a comunas
export const direccionAComuna = (direccion: string): { id: string; nombre: string } => {
  const direccionLower = direccion.toLowerCase();

  // Palabras clave por comuna
  const mapeoComunas = [
    { id: '14', nombre: 'El Poblado', keywords: ['poblado', 'lalinde', 'provenza', 'castropol', 'el tesoro', 'santa maria', 'los balsos', 'barrio colombia'] },
    { id: '11', nombre: 'Laureles', keywords: ['laureles', 'estadio', 'floresta', 'suramericana', 'bolivar', 'conquistadores'] },
    { id: '16', nombre: 'Belén', keywords: ['belén', 'robledo', 'bello', 'altavista', 'san antonio', 'san cristóbal'] },
    { id: '10', nombre: 'La Candelaria', keywords: ['candelaria', 'centro', 'parque berrio', 'prado', 'san pedro', 'villa hermoza'] },
    { id: '1', nombre: 'Popular', keywords: ['popular', 'santander', 'manrique', 'santa cruz', 'aranjuez'] },
    { id: '6', nombre: 'Doce de Octubre', keywords: ['doce de octubre', 'castilla', 'trece de noviembre'] },
    { id: '8', nombre: 'Villa Hermosa', keywords: ['villa hermosa', 'buenos aires', 'manrique'] },
    { id: '13', nombre: 'San Javier', keywords: ['san javier', 'veinte de julio', 'blaquitas'] },
    { id: '15', nombre: 'Guayabal', keywords: ['guayabal', 'vistahermosa', 'calasanz'] },
    { id: '5', nombre: 'Castilla', keywords: ['castilla', 'doce de octubre'] },
    { id: '4', nombre: 'Aranjuez', keywords: ['aranjuez', 'manrique', 'bermejal'] },
    { id: '2', nombre: 'Santa Cruz', keywords: ['santa cruz', 'popular'] },
    { id: '3', nombre: 'Manrique', keywords: ['manrique', 'buenos aires'] },
    { id: '7', nombre: 'Robledo', keywords: ['robledo', 'belén'] },
    { id: '9', nombre: 'Buenos Aires', keywords: ['buenos aires', 'manrique'] },
    { id: '12', nombre: 'La América', keywords: ['américa', 'laureles'] }
  ];

  // Buscar coincidencias
  for (const comuna of mapeoComunas) {
    for (const keyword of comuna.keywords) {
      if (direccionLower.includes(keyword)) {
        return { id: comuna.id, nombre: comuna.nombre };
      }
    }
  }

  // Asignación aleatoria si no hay coincidencia (con preferencia a comunas más populosas)
  const comunasPopulares = [
    { id: '14', nombre: 'El Poblado', weight: 25 },
    { id: '11', nombre: 'Laureles', weight: 20 },
    { id: '16', nombre: 'Belén', weight: 15 },
    { id: '1', nombre: 'Popular', weight: 12 },
    { id: '10', nombre: 'La Candelaria', weight: 10 },
    { id: '8', nombre: 'Villa Hermosa', weight: 8 },
    { id: '6', nombre: 'Doce de Octubre', weight: 5 },
    { id: '13', nombre: 'San Javier', weight: 3 },
    { id: '15', nombre: 'Guayabal', weight: 2 }
  ];

  const random = Math.random() * 100;
  let accumulator = 0;
  for (const comuna of comunasPopulares) {
    accumulator += comuna.weight;
    if (random <= accumulator) {
      return { id: comuna.id, nombre: comuna.nombre };
    }
  }

  return comunasPopulares[0]; // Fallback a El Poblado
};

// Generar trend aleatorio basado en tendencia general
export const generarTrend = (): string => {
  const trends = ['+12%', '+8%', '+15%', '+5%', '-3%', '+22%', '+18%', '+9%', '-5%', '+25%', '+11%', '+6%', '+35%', '+19%', '+7%', '+2%'];
  return trends[Math.floor(Math.random() * trends.length)];
};

// Procesar pedidos para obtener datos por comuna
export const procesarPedidosPorComuna = (pedidos: PedidoConComuna[]): ComunaInfo[] => {
  const conteoPorComuna: { [key: string]: number } = {};

  // Contar pedidos por comuna
  pedidos.forEach(pedido => {
    const comuna = direccionAComuna(pedido.cliente_direccion);
    if (!conteoPorComuna[comuna.id]) {
      conteoPorComuna[comuna.id] = 0;
    }
    conteoPorComuna[comuna.id]++;
  });

  // Convertir a array de ComunaInfo
  return Object.entries(conteoPorComuna).map(([comunaId, pedidosCount]) => {
    const comuna = direccionAComuna(`direccion ${comunaId}`); // Obtener nombre de la comuna
    return {
      id: comunaId,
      nombre: comuna.nombre,
      pedidos: pedidosCount,
      trend: generarTrend()
    };
  }).sort((a, b) => b.pedidos - a.pedidos); // Ordenar por cantidad de pedidos
};

// Datos de ejemplo de direcciones realistas de Medellín
export const direccionesReales = [
  "Calle 10 #43-30, El Poblado",
  "Carrera 70 #52-59, Laureles",
  "Calle 30 Sur #48A-115, Belén",
  "Carrera 52 #45-30, La Candelaria",
  "Calle 44 #85-35, Envigado (cerca El Poblado)",
  "Avenida El Poblado #14-110",
  "Carrera 83 #12-145, Laureles",
  "Calle 12 #35-70, Robledo",
  "Transversal Superior #34A-45, El Poblado",
  "Calle 8 #40-115, La Candelaria",
  "Carrera 65 #26A-39, Buenos Aires",
  "Calle 74 #44-80, Manrique",
  "Avenida 33 #33-25, La América",
  "Carrera 46 #52-15, Suramericana",
  "Calle 16 #84-60, Floresta",
  "Calle 1 #71-27, Santa Cruz",
  "Carrera 82 #12-100, Castilla",
  "Calle 51 #90-45, Doce de Octubre",
  "Avenida San Juan #48-61, Villa Hermosa",
  "Calle 115 #45-60, San Javier",
  "Carrera 46 #82A-40, Guayabal",
  "Calle 24 #62-80, Robledo",
  "Carrera 51 #38-30, Aranjuez",
  "Calle 58 #40C-105, Popular",
  "Avenida Regional #34-55, Belén"
];