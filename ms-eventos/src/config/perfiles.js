// Cada perfil reúne los campos, la regla de unicidad, el filtro y los ejemplos del PDF.
const texto = (nombre, max = 160, extra = {}) => ({ nombre, tipo: 'texto', max, ...extra });
const entero = (nombre, min = 1, max = 2147483647) => ({ nombre, tipo: 'entero', min, max });
const fecha = nombre => ({ nombre, tipo: 'fecha' });
const opcion = (nombre, valores) => ({ nombre, tipo: 'opcion', valores });

const perfiles = {
  cursos: {
    unico: 'codigo', filtro: 'semestre',
    campos: [texto('codigo', 64), texto('nombre'), entero('creditos', 1, 6), entero('cupo'), texto('semestre', 6, { patron: /^\d{4}-[12]$/, formato: 'AAAA-1 o AAAA-2' })],
    semillas: [
      { codigo: 'CUR-001', nombre: 'Redes', creditos: 3, cupo: 20, semestre: '2026-2' },
      { codigo: 'CUR-002', nombre: 'Bases de datos', creditos: 4, cupo: 25, semestre: '2026-2' },
      { codigo: 'CUR-003', nombre: 'Programación', creditos: 3, cupo: 30, semestre: '2027-1' }
    ]
  },
  eventos: {
    unico: 'codigo', filtro: 'tipo',
    campos: [texto('codigo', 64), texto('nombre'), fecha('fecha'), entero('asistentes_esperados'), opcion('tipo', ['conferencia', 'taller', 'feria']), entero('patrocinador_id')],
    semillas: [
      { codigo: 'EV-001', nombre: 'Conferencia de redes', fecha: '2026-12-01', asistentes_esperados: 50, tipo: 'conferencia', patrocinador_id: 1 },
      { codigo: 'EV-002', nombre: 'Taller de servicios', fecha: '2026-12-02', asistentes_esperados: 20, tipo: 'taller', patrocinador_id: 2 },
      { codigo: 'EV-003', nombre: 'Feria tecnológica', fecha: '2026-12-03', asistentes_esperados: 100, tipo: 'feria', patrocinador_id: 4 }
    ]
  },
  pedidos: {
    unico: 'numero', filtro: 'estado',
    campos: [texto('numero', 64), texto('cliente'), entero('cantidad'), fecha('fecha'), opcion('estado', ['pendiente', 'enviado', 'entregado'])],
    semillas: [
      { numero: 'PED-001', cliente: 'Cliente uno', cantidad: 2, fecha: '2026-12-01', estado: 'pendiente' },
      { numero: 'PED-002', cliente: 'Cliente dos', cantidad: 4, fecha: '2026-12-02', estado: 'enviado' },
      { numero: 'PED-003', cliente: 'Cliente tres', cantidad: 1, fecha: '2026-12-03', estado: 'entregado' }
    ]
  },
  viajes: {
    unico: 'codigo', filtro: 'destino',
    campos: [texto('codigo', 64), texto('origen'), texto('destino'), fecha('fecha'), entero('pasajeros')],
    semillas: [
      { codigo: 'VIA-001', origen: 'Cali', destino: 'Bogotá', fecha: '2026-12-01', pasajeros: 2 },
      { codigo: 'VIA-002', origen: 'Cali', destino: 'Medellín', fecha: '2026-12-02', pasajeros: 4 },
      { codigo: 'VIA-003', origen: 'Bogotá', destino: 'Cali', fecha: '2026-12-03', pasajeros: 3 }
    ]
  },
  reservas: {
    unico: 'codigo', filtro: 'huesped',
    campos: [texto('codigo', 64), texto('huesped'), fecha('fecha_entrada'), fecha('fecha_salida'), entero('personas')],
    semillas: [
      { codigo: 'RES-001', huesped: 'Ana Pérez', fecha_entrada: '2026-12-01', fecha_salida: '2026-12-03', personas: 2 },
      { codigo: 'RES-002', huesped: 'Luis Ruiz', fecha_entrada: '2026-12-04', fecha_salida: '2026-12-06', personas: 1 },
      { codigo: 'RES-003', huesped: 'María López', fecha_entrada: '2026-12-07', fecha_salida: '2026-12-09', personas: 3 }
    ],
    validarRelacion(datos) {
      return datos.fecha_salida <= datos.fecha_entrada ? ['fecha_salida debe ser posterior a fecha_entrada'] : [];
    }
  },
  tickets: {
    unico: 'numero', filtro: 'prioridad',
    campos: [texto('numero', 64), texto('asunto', 255), opcion('prioridad', ['baja', 'media', 'alta']), opcion('estado', ['abierto', 'cerrado']), fecha('fecha')],
    semillas: [
      { numero: 'TIC-001', asunto: 'Consulta de acceso', prioridad: 'baja', estado: 'abierto', fecha: '2026-12-01' },
      { numero: 'TIC-002', asunto: 'Revisión de equipo', prioridad: 'media', estado: 'abierto', fecha: '2026-12-02' },
      { numero: 'TIC-003', asunto: 'Falla de servicio', prioridad: 'alta', estado: 'cerrado', fecha: '2026-12-03' }
    ]
  }
};
module.exports = perfiles;
