export const notificationConstants = [
  {
    notificationId: 1,
    message: {
      en: 'The {vehicle} increased {distance} km and has current mileage of {mileage} km',
      es: 'La {vehicle} aumentó {distance} km y tiene una distancia actual de {mileage} km'
    },
  },
  {
    notificationId: 2,
    message: {
      en: 'The {vehicle} decreased {distance} km and has current mileage of {mileage} km',
      es: 'La {vehicle} disminuyó {distance} km y tiene una distancia actual de {mileage} km'
    },
  },
  {
    notificationId: 3,
    message: {
      en: 'The accumulated kilometers for {vehicle} have been reset to 0 after performing {maintenanceType}.',
      es: 'El kilometraje acumulado de {vehicle} ha sido reiniciado a 0 después de realizar {maintenanceType}.'
    },
  }
]