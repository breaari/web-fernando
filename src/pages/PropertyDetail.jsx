import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useToast } from '../components/ToastProvider'
import { ERROR_MESSAGES } from '../utils/constants'
import { FaRulerCombined, FaBed, FaBath, FaCar, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa'
import ImageCarousel from '../components/ImageCarousel'

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadProperty()
  }, [id])

  const loadProperty = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/properties/${id}`)
      setProperty(response.data.data)
      
      // Pre-llenar mensaje
      setFormData(prev => ({
        ...prev,
        message: `Hola, estoy interesado/a en la propiedad: ${response.data.data.title}`
      }))
    } catch (error) {
      console.error('Error loading property:', error)
      toast.error(ERROR_MESSAGES.NOT_FOUND)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(ERROR_MESSAGES.REQUIRED_FIELDS)
      return
    }

    setSubmitting(true)
    try {
      await api.post('/inquiries', {
        ...formData,
        property_id: id
      })
      toast.success('¡Consulta enviada! Nos contactaremos pronto.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: `Hola, estoy interesado/a en la propiedad: ${property.title}`
      })
    } catch (err) {
      console.error('Error al enviar consulta:', err)
      const errorMsg = err.response?.data?.message || ERROR_MESSAGES.GENERIC
      toast.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Cargando...</div>
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 mb-4">Propiedad no encontrada</p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          Volver
        </button>
      </div>
    )
  }

  const fullAddress = [
    property.street,
    property.street_number,
    property.neighborhood,
    property.city,
    property.province
  ].filter(Boolean).join(', ')

  // Generar URL del mapa (Google Maps embed)
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(fullAddress)}`
  
  // Alternativa usando iframe de búsqueda (sin API key)
  const searchMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:underline mb-3 md:mb-4 text-sm md:text-base"
      >
        <FaArrowLeft /> Volver
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carrusel de imágenes */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-64 md:h-96">
              <ImageCarousel images={property.images} alt={property.title} />
            </div>
          </div>

          {/* Información principal */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h1 className="text-xl md:text-3xl font-bold mb-2 md:mb-3">{property.title}</h1>
            
            <div className="flex items-center gap-2 text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
              <FaMapMarkerAlt className="text-blue-500" />
              <span className="line-clamp-1">{fullAddress}</span>
            </div>

            <div className="text-2xl md:text-4xl font-bold text-blue-600 mb-4 md:mb-6">
              ${parseFloat(property.price).toLocaleString()} {property.currency}
            </div>

            {/* Características principales */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b">
              {property.surface_total && (
                <div className="flex items-center gap-2 md:gap-3">
                  <FaRulerCombined className="text-blue-500 text-xl md:text-2xl" />
                  <div>
                    <div className="text-xs md:text-sm text-gray-600">Superficie</div>
                    <div className="font-semibold text-sm md:text-base">{property.surface_total} m²</div>
                  </div>
                </div>
              )}
              {property.bedrooms && (
                <div className="flex items-center gap-2 md:gap-3">
                  <FaBed className="text-blue-500 text-xl md:text-2xl" />
                  <div>
                    <div className="text-xs md:text-sm text-gray-600">Dormitorios</div>
                    <div className="font-semibold text-sm md:text-base">{property.bedrooms}</div>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-2 md:gap-3">
                  <FaBath className="text-blue-500 text-xl md:text-2xl" />
                  <div>
                    <div className="text-xs md:text-sm text-gray-600">Baños</div>
                    <div className="font-semibold text-sm md:text-base">{property.bathrooms}</div>
                  </div>
                </div>
              )}
              {property.garages !== undefined && property.garages !== null && (
                <div className="flex items-center gap-2 md:gap-3">
                  <FaCar className="text-blue-500 text-xl md:text-2xl" />
                  <div>
                    <div className="text-xs md:text-sm text-gray-600">Cocheras</div>
                    <div className="font-semibold text-sm md:text-base">{property.garages || 0}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Descripción */}
            {property.description && (
              <div className="mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Descripción</h2>
                <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap">{property.description}</p>
              </div>
            )}

            {/* Detalles adicionales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
              {property.surface_covered && (
                <div>
                  <span className="text-xs md:text-sm text-gray-600">Superficie cubierta:</span>
                  <span className="ml-2 font-semibold text-sm md:text-base">{property.surface_covered} m²</span>
                </div>
              )}
              {property.floor_number && (
                <div>
                  <span className="text-xs md:text-sm text-gray-600">Piso:</span>
                  <span className="ml-2 font-semibold text-sm md:text-base">{property.floor_number}</span>
                </div>
              )}
              {property.year_built && (
                <div>
                  <span className="text-xs md:text-sm text-gray-600">Año de construcción:</span>
                  <span className="ml-2 font-semibold text-sm md:text-base">{property.year_built}</span>
                </div>
              )}
              {property.property_type_name && (
                <div>
                  <span className="text-xs md:text-sm text-gray-600">Tipo de propiedad:</span>
                  <span className="ml-2 font-semibold text-sm md:text-base">{property.property_type_name}</span>
                </div>
              )}
              {property.operation_type_name && (
                <div>
                  <span className="text-xs md:text-sm text-gray-600">Operación:</span>
                  <span className="ml-2 font-semibold text-sm md:text-base">{property.operation_type_name}</span>
                </div>
              )}
            </div>

            {/* Amenidades */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t">
                <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Amenidades</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm"
                    >
                      {amenity.name || amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mapa */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <h2 className="text-lg md:text-xl font-bold p-4 md:p-6 pb-3 md:pb-4">Ubicación</h2>
            <div className="h-64 md:h-96">
              <iframe
                src={searchMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de la propiedad"
              />
            </div>
            <div className="p-3 md:p-4 bg-gray-50 text-xs md:text-sm text-gray-600">
              <FaMapMarkerAlt className="inline mr-2 text-blue-500" />
              <span className="line-clamp-2">{fullAddress}</span>
            </div>
          </div>
        </div>

        {/* Sidebar - Formulario de consulta */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 md:p-6 lg:sticky lg:top-6">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Consultar por esta propiedad</h2>
            <p className="text-gray-600 mb-4 md:mb-6 text-sm">
              Completa el formulario y te contactaremos a la brevedad
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mensaje *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-500 text-white py-3 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400 transition"
              >
                {submitting ? 'Enviando...' : 'Enviar consulta'}
              </button>
            </form>

            {/* Información de contacto */}
            <div className="mt-6 pt-6 border-t text-sm text-gray-600">
              <p className="mb-2">
                <strong>También puedes contactarnos:</strong>
              </p>
              <p>📞 (011) 4822-3456</p>
              <p>📧 info@inmobiliaria.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
