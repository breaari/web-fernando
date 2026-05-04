import React, { useState } from 'react'
import api from '../utils/api'
import { useToast } from '../components/ToastProvider'
import { ERROR_MESSAGES } from '../utils/constants'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'

export default function Contact() {
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)

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

    setLoading(true)

    try {
      await api.post('/contact', formData)
      toast.success('¡Mensaje enviado! Nos pondremos en contacto pronto.')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      console.error('Error en contacto:', err)
      const errorMsg = err.response?.data?.message || ERROR_MESSAGES.GENERIC
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface min-h-screen pt-28 pb-20 text-on-surface">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">

        <div className="text-center mb-12">
          <span className="text-secondary tracking-[0.25em] text-xs uppercase block mb-3">
            Contacto
          </span>

          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Hablemos de tu próximo paso
          </h1>

          <p className="text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Estamos para asesorarte en compra, venta, alquiler o tasación de propiedades.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <ContactCard
            icon={<FaPhone />}
            title="Teléfono"
            main="(011) 4822-3456"
            sub="Lunes a viernes de 9:00 a 18:00"
          />

          <ContactCard
            icon={<FaEnvelope />}
            title="Email"
            main="info@faleronipropiedades.com"
            sub="Respuesta dentro de las 24 hs"
          />

          <ContactCard
            icon={<FaMapMarkerAlt />}
            title="Ubicación"
            main="Mar del Plata"
            sub="Buenos Aires, Argentina"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-primary/60 backdrop-blur-xl p-6 md:p-8 border border-white/10 rounded-xl shadow-2xl"
          >
            <span className="text-secondary tracking-[0.25em] text-xs uppercase block mb-3">
              Mensaje
            </span>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Enviá tu consulta
            </h2>

            <Field
              label="Nombre *"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <Field
                label="Email *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Field
                label="Teléfono"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6">
              <label className="text-secondary/70 text-[10px] tracking-widest uppercase font-bold block mb-2">
                Mensaje *
              </label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="Contanos en qué podemos ayudarte"
                required
                className="w-full bg-transparent border border-white/15 focus:border-secondary focus:ring-0 rounded-sm px-4 py-3 text-white placeholder:text-white/35 outline-none resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-secondary text-primary h-14 text-[11px] tracking-widest uppercase font-bold hover:brightness-110 disabled:opacity-50 transition rounded-sm"
            >
              {loading ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>

          <aside className="bg-primary/40 border border-white/10 rounded-xl p-6 md:p-8 shadow-2xl h-fit">
            <span className="text-secondary tracking-[0.25em] text-xs uppercase block mb-3">
              Atención personalizada
            </span>

            <h3 className="text-2xl font-bold text-white mb-4">
              También podés escribirnos directo
            </h3>

            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Recibí asesoramiento para vender, comprar o alquilar con una atención clara y cercana.
            </p>

            <a
              href="https://wa.me/5491148223456"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 flex items-center justify-center gap-3 bg-secondary text-primary text-[11px] tracking-widest uppercase font-bold hover:brightness-110 transition rounded-sm"
            >
              <FaWhatsapp />
              WhatsApp
            </a>

            <div className="mt-8 pt-8 border-t border-white/10 space-y-4 text-sm text-on-surface-variant">
              <div className="flex gap-3">
                <FaMapMarkerAlt className="text-secondary mt-1 flex-shrink-0" />
                <span>Mar del Plata, Buenos Aires, Argentina</span>
              </div>

              <div className="flex gap-3">
                <FaEnvelope className="text-secondary mt-1 flex-shrink-0" />
                <span>info@faleronipropiedades.com</span>
              </div>

              <div className="flex gap-3">
                <FaPhone className="text-secondary mt-1 flex-shrink-0" />
                <span>(011) 4822-3456</span>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </div>
  )
}

function ContactCard({ icon, title, main, sub }) {
  return (
    <div className="bg-primary/40 border border-white/10 rounded-xl p-6 text-center hover:border-secondary/60 transition shadow-2xl">
      <div className="text-secondary text-3xl mb-4 flex justify-center">
        {icon}
      </div>

      <h3 className="text-white font-bold text-lg mb-2">
        {title}
      </h3>

      <p className="text-on-surface font-semibold text-sm mb-1">
        {main}
      </p>

      <p className="text-on-surface-variant text-xs">
        {sub}
      </p>
    </div>
  )
}

function Field({ label, type, name, value, onChange, required }) {
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