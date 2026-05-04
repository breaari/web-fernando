import React, { useState } from 'react'
import api from '../utils/api'
import { useToast } from '../components/ToastProvider'
import { ERROR_MESSAGES } from '../utils/constants'

export default function SellForm() {
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

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error(ERROR_MESSAGES.REQUIRED_FIELDS)
      return
    }

    setLoading(true)

    try {
      await api.post('/inquiries', formData)

      toast.success('¡Consulta enviada! Nos contactaremos pronto para asesorarte.')

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      })
    } catch (err) {
      console.error('Error en formulario venta:', err)
      const errorMsg = err.response?.data?.message || ERROR_MESSAGES.GENERIC
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface min-h-screen pt-28 pb-20 text-on-surface">
      <div className="max-w-[900px] mx-auto px-6 md:px-12">

        <div className="mb-10">
          <span className="text-secondary tracking-[0.25em] text-xs uppercase block mb-3">
            Tasación y venta
          </span>

          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Vender tu propiedad
          </h1>

          <p className="text-on-surface-variant max-w-2xl leading-relaxed">
            Completá el formulario y nos pondremos en contacto para asesorarte en la valoración, publicación y comercialización de tu propiedad.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-primary/60 backdrop-blur-xl p-6 md:p-8 border border-white/10 rounded-xl shadow-2xl"
        >
          <Field
            label="Nombre completo *"
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
              label="Teléfono *"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-6">
            <label className="text-secondary/70 text-[10px] tracking-widest uppercase font-bold block mb-2">
              Contanos sobre tu propiedad *
            </label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="7"
              placeholder="Incluí dirección, tipo de propiedad, superficie, ambientes, estado general y cualquier detalle relevante."
              required
              className="w-full bg-transparent border border-white/15 focus:border-secondary focus:ring-0 rounded-sm px-4 py-3 text-white placeholder:text-white/35 outline-none resize-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-secondary text-primary h-14 text-[11px] tracking-widest uppercase font-bold hover:brightness-110 disabled:opacity-50 transition rounded-sm"
          >
            {loading ? 'Enviando...' : 'Enviar consulta'}
          </button>
        </form>
      </div>
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