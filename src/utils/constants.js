// Configuración general de la aplicación
export const APP_CONFIG = {
  ITEMS_PER_PAGE: 12,
  API_TIMEOUT: 10000,
  IMAGE_PLACEHOLDER: '/placeholder-property.jpg'
}

// Límites y validaciones
export const VALIDATION = {
  MIN_SEARCH_CHARS: 2,
  MAX_MESSAGE_LENGTH: 1000,
  MAX_NAME_LENGTH: 100,
  PHONE_REGEX: /^[0-9\s\-\+\(\)]+$/
}

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  GENERIC: 'Ocurrió un error. Por favor, intenta nuevamente.',
  NETWORK: 'Error de conexión. Verifica tu internet.',
  NOT_FOUND: 'No se encontró el recurso solicitado.',
  VALIDATION: 'Por favor, verifica los datos ingresados.',
  REQUIRED_FIELDS: 'Todos los campos son obligatorios.'
}

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: '¡Formulario enviado correctamente!',
  INQUIRY_SENT: '¡Tu consulta fue enviada! Te contactaremos pronto.',
  SAVED: 'Guardado exitosamente.'
}
