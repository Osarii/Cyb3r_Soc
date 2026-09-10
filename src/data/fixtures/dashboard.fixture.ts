export const dashboardFixture = {
  metrics: [
    { label: 'Amenazas activas', value: '247', delta: '+12%' },
    { label: 'Incidentes críticos', value: '18', delta: '+50%' },
    { label: 'Activos monitoreados', value: '1,428', delta: '+4%' },
    { label: 'Tiempo medio de respuesta', value: '12 min', delta: '-35%' },
  ],
  locations: ['San Francisco, US', 'Berlín, DE', 'Shanghái, CN', 'São Paulo, BR'],
  totalThreats: 1248,
} as const;
