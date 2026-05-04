import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useToast } from '../components/ToastProvider'
import { ERROR_MESSAGES } from '../utils/constants'
import {
  FaRulerCombined,
  FaBed,
  FaBath,
  FaCar,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
} from 'react-icons/fa'
import ImageCarousel from '../components/ImageCarousel'

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  useEffect(() => {
    loadProperty()
  }, [id])

  const loadProperty = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/properties/${id}`)
      const data = response.data.data

      setProperty(data)

      setFormData(prev => ({
        ...prev,
        message: `Hola, estoy interesado/a en la propiedad: ${data.title}`,
      }))
    } catch (error) {
      console.error('Error loading property:', error)
      toast.error(ERROR_MESSAGES.NOT_FOUND)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error(ERROR_MESSAGES.REQUIRED_FIELDS)
      return
    }

    setSubmitting(true)

    try {
      await api.post('/inquiries', {
        ...formData,
        property_id: id,
      })

      toast.success('¡Consulta enviada! Nos contactaremos pronto.')

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: `Hola, estoy interesado/a en la propiedad: ${property.title}`,
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
    return (
      <div className="bg-surface min-h-screen pt-32 text-center text-on-surface-variant">
        Cargando propiedad...
      </div>
    )
  }

  if (!property) {
    return (
      <div className="bg-surface min-h-screen pt-32 text-center">
        <p className="text-on-surface-variant mb-4">Propiedad no encontrada</p>
        <button
          onClick={() => navigate(-1)}
          className="text-secondary hover:underline"
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
    property.province,
  ].filter(Boolean).join(', ')

  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const mapUrl = googleMapsKey
    ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=${encodeURIComponent(fullAddress)}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`

  return (
    <div className="bg-surface min-h-screen pt-28 pb-20 text-on-surface">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-secondary text-xs tracking-[0.18em] uppercase font-bold mb-8 hover:opacity-80 transition"
        >
          <FaArrowLeft />
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN */}
          <div className="lg:col-span-2 space-y-8">

            {/* IMAGE */}
            <div className="bg-primary/40 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <div className="h-[320px] md:h-[520px]">
                <ImageCarousel images={property.images} alt={property.title} />
              </div>
            </div>

            {/* INFO */}
            <div className="bg-primary/40 border border-white/10 rounded-xl p-6 md:p-8 shadow-2xl">
              <span className="text-secondary tracking-[0.25em] text-xs uppercase block mb-3">
                {property.operation_type_name || 'Propiedad'}
              </span>

              <h1 className="text-2xl md:text-4xl font-bold text-white mb-5 leading-tight">
                {property.title}
              </h1>

              <div className="flex items-start gap-3 text-on-surface-variant mb-6">
                <FaMapMarkerAlt className="text-secondary mt-1 flex-shrink-0" />
                <span>{fullAddress}</span>
              </div>

              <div className="text-secondary text-2xl md:text-4xl font-bold mb-8">
                ${parseFloat(property.price).toLocaleString()} {property.currency}
              </div>

              {/* FEATURES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-white/10">
                {property.surface_total && (
                  <Feature icon={<FaRulerCombined />} label="Superficie" value={`${property.surface_total} m²`} />
                )}

                {property.bedrooms && (
                  <Feature icon={<FaBed />} label="Dormitorios" value={property.bedrooms} />
                )}

                {property.bathrooms && (
                  <Feature icon={<FaBath />} label="Baños" value={property.bathrooms} />
                )}

                {property.garages !== undefined && property.garages !== null && (
                  <Feature icon={<FaCar />} label="Cocheras" value={property.garages || 0} />
                )}
              </div>

              {/* DESCRIPTION */}
              {property.description && (
                <div className="pt-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Descripción
                  </h2>
                  <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                    {property.description}
                  </p>
                </div>
              )}

              {/* DETAILS */}
              <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.surface_covered && (
                  <Detail label="Superficie cubierta" value={`${property.surface_covered} m²`} />
                )}

                {property.floor_number && (
                  <Detail label="Piso" value={property.floor_number} />
                )}

                {property.year_built && (
                  <Detail label="Año de construcción" value={property.year_built} />
                )}

                {property.property_type_name && (
                  <Detail label="Tipo de propiedad" value={property.property_type_name} />
                )}

                {property.operation_type_name && (
                  <Detail label="Operación" value={property.operation_type_name} />
                )}
              </div>

              {/* AMENITIES */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Amenities
                  </h2>

                  <div className="flex flex-wrap gap-3">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm"
                      >
                        {amenity.name || amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MAP */}
            <div className="bg-primary/40 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <div className="p-6 md:p-8">
                <span className="text-secondary tracking-[0.25em] text-xs uppercase block mb-2">
                  Ubicación
                </span>
                <h2 className="text-2xl font-bold text-white">
                  Dónde se encuentra
                </h2>
              </div>

              <div className="h-[320px] md:h-[440px]">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de la propiedad"
                />
              </div>

              <div className="p-5 border-t border-white/10 text-sm text-on-surface-variant flex gap-3">
                <FaMapMarkerAlt className="text-secondary mt-1 flex-shrink-0" />
                <span>{fullAddress}</span>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-primary/60 border border-white/10 rounded-xl p-6 md:p-8 shadow-2xl lg:sticky lg:top-28">
              <span className="text-secondary tracking-[0.25em] text-xs uppercase block mb-3">
                Consulta
              </span>

              <h2 className="text-2xl font-bold text-white mb-3">
                Consultar por esta propiedad
              </h2>

              <p className="text-on-surface-variant text-sm mb-6">
                Completá tus datos y te contactaremos a la brevedad.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Field
                  label="Nombre *"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Field
                  label="Teléfono"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <div>
                  <label className="text-secondary/70 text-[10px] tracking-widest uppercase font-bold block mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                    className="w-full bg-transparent border border-white/15 focus:border-secondary focus:ring-0 rounded-sm px-4 py-3 text-white placeholder:text-white/40 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-secondary text-primary h-14 text-[11px] tracking-widest uppercase font-bold hover:brightness-110 disabled:opacity-50 transition rounded-sm"
                >
                  {submitting ? 'Enviando...' : 'Enviar consulta'}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-white/10 space-y-4 text-sm text-on-surface-variant">
                <p className="text-white font-semibold">
                  También podés contactarnos:
                </p>

                <div className="flex items-center gap-3">
                  <FaPhoneAlt className="text-secondary" />
                  <span>(011) 4822-3456</span>
                </div>

                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-secondary" />
                  <span>info@inmobiliaria.com</span>
                </div>

                <div className="flex items-center gap-3">
                  <FaWhatsapp className="text-secondary" />
                  <span>WhatsApp disponible</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function Feature({ icon, label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="text-secondary text-2xl mb-3">
        {icon}
      </div>
      <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-white font-bold">
        {value}
      </p>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3">
      <p className="text-secondary/80 text-xs uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-white font-semibold">
        {value}
      </p>
    </div>
  )
}

function Field({ label, name, type, value, onChange, required }) {
  return (
    <div>
      <label className="text-secondary/70 text-[10px] tracking-widest uppercase font-bold block mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-transparent border-0 border-b border-white/20 focus:border-secondary focus:ring-0 px-0 py-3 text-white placeholder:text-white/40 outline-none"
      />
    </div>
  )
}