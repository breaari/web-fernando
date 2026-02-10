import React, { useState } from 'react'
import api from '../utils/api'
import { useToast } from '../components/ToastProvider'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants'

export default function SellForm() {
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
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
        message: ''
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
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Vender tu propiedad</h1>
      <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">Completa el formulario y nos pondremos en contacto para asesorarte</p>

      <form onSubmit={handleSubmit} className="bg-white p-4 md:p-8 rounded shadow">
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-sm md:text-base">Nombre completo *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded text-sm md:text-base"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-semibold text-sm md:text-base">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm md:text-base"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-sm md:text-base">Teléfono *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded text-sm md:text-base"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-sm md:text-base">Cuéntanos sobre tu propiedad *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded text-sm md:text-base"
            rows="6"
            placeholder="Incluye detalles como: dirección, tipo de propiedad, superficie, cantidad de ambientes, estado, etc."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400 text-sm md:text-base"
        >
          {loading ? 'Enviando...' : 'Enviar consulta'}
        </button>
      </form>
    </div>
  )
}
