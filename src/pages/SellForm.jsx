import React, { useState } from 'react'
import api from '../utils/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function SellForm() {
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
      toast.error('Por favor completa todos los campos obligatorios')
      return
    }

    setLoading(true)
    try {
      await api.post('/inquiries', formData)
      toast.success('Consulta enviada correctamente. Nos pondremos en contacto pronto.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })
    } catch (err) {
      toast.error('Error al enviar la consulta: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Vender tu propiedad</h1>
      <p className="text-gray-600 mb-8">Completa el formulario y nos pondremos en contacto para asesorarte</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow">
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Nombre completo *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-semibold">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Teléfono *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold">Cuéntanos sobre tu propiedad *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="6"
            placeholder="Incluye detalles como: dirección, tipo de propiedad, superficie, cantidad de ambientes, estado, etc."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Enviando...' : 'Enviar consulta'}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
