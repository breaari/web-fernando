import React, { useState } from 'react'
import api from '../utils/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export default function Contact() {
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
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    try {
      await api.post('/contact', formData)
      toast.success('Mensaje enviado correctamente. Nos pondremos en contacto pronto.')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      toast.error('Error al enviar el mensaje: ' + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-12 text-center">Contactanos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Información de contacto demo */}
        <div className="bg-white p-6 rounded shadow text-center">
          <FaPhone className="text-3xl text-blue-500 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">Teléfono</h3>
          <p className="text-gray-600">(011) 4822-3456</p>
          <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <FaEnvelope className="text-3xl text-blue-500 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">Email</h3>
          <p className="text-gray-600">info@inmobiliaria.com</p>
          <p className="text-gray-600">Respuesta en 24hs</p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <FaMapMarkerAlt className="text-3xl text-blue-500 mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">Oficina</h3>
          <p className="text-gray-600">Av. Corrientes 1234</p>
          <p className="text-gray-600">Buenos Aires, Argentina</p>
        </div>
      </div>

      {/* Formulario de contacto */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Nombre *</label>
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
              <label className="block mb-2 font-semibold">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-semibold">Mensaje *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="5"
              placeholder="Cuéntanos en qué podemos ayudarte"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}
