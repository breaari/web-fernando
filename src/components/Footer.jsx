import React from 'react'
import { Link } from 'react-router-dom'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre nosotros */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Inmobiliaria Fernando</h3>
            <p className="text-sm mb-4">
              Tu aliado de confianza en el mercado inmobiliario. Más de 10 años ayudando a las personas a encontrar su hogar ideal.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
                <FaFacebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">
                <FaInstagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
                <FaTwitter size={20} />
              </a>
              <a href="https://wa.me/5491148223456" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition">
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">Inicio</Link>
              </li>
              <li>
                <Link to="/comprar" className="hover:text-white transition">Comprar</Link>
              </li>
              <li>
                <Link to="/alquiler" className="hover:text-white transition">Alquiler</Link>
              </li>
              <li>
                <Link to="/alquiler-temporario" className="hover:text-white transition">Alquiler Temporario</Link>
              </li>
              <li>
                <Link to="/vender" className="hover:text-white transition">Vender tu Propiedad</Link>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Servicios</h3>
            <ul className="space-y-2 text-sm">
              <li>Compra y venta de propiedades</li>
              <li>Alquiler temporal y permanente</li>
              <li>Tasaciones</li>
              <li>Asesoramiento legal</li>
              <li>Administración de propiedades</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                <span>Av. Corrientes 1234<br />Buenos Aires, Argentina</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone />
                <a href="tel:+5491148223456" className="hover:text-white transition">
                  (011) 4822-3456
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope />
                <a href="mailto:info@inmobiliaria.com" className="hover:text-white transition">
                  info@inmobiliaria.com
                </a>
              </li>
            </ul>
            <div className="mt-4 text-xs">
              <p className="text-gray-400">Horario de atención:</p>
              <p>Lunes a Viernes: 9:00 - 18:00</p>
              <p>Sábados: 10:00 - 14:00</p>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© {currentYear} Inmobiliaria Fernando. Todos los derechos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="/contactanos" className="hover:text-white transition">Políticas de Privacidad</Link>
              <Link to="/contactanos" className="hover:text-white transition">Términos y Condiciones</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
