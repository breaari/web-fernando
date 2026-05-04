import React from 'react'
import { Link } from 'react-router-dom'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaWhatsapp, FaFacebook } from 'react-icons/fa'
import logo from '../assets/logofondoblanco.png'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary border-t border-white/10 text-on-surface">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Marca */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <img
                src={logo}
                alt="Faleroni Propiedades"
                className="h-16 w-auto object-contain"
              />
            </Link>

            <p className="text-secondary text-[11px] tracking-[0.25em] uppercase font-bold mb-4">
              Faleroni Propiedades
            </p>

            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Negocios inmobiliarios con atención personalizada para comprar, vender o alquilar con seguridad.
            </p>

            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full text-white/50 hover:text-secondary hover:border-secondary transition"
              >
                <FaInstagram />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full text-white/50 hover:text-secondary hover:border-secondary transition"
              >
                <FaFacebook />
              </a>

              <a
                href="https://wa.me/5491148223456"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full text-white/50 hover:text-secondary hover:border-secondary transition"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-secondary text-[11px] tracking-[0.25em] uppercase font-bold mb-6">
              Navegación
            </h3>

            <ul className="space-y-3 text-sm text-on-surface-variant">
              <li><Link to="/" className="hover:text-secondary transition">Inicio</Link></li>
              <li><Link to="/comprar" className="hover:text-secondary transition">Comprar</Link></li>
              <li><Link to="/alquiler" className="hover:text-secondary transition">Alquiler</Link></li>
              <li><Link to="/alquiler-temporario" className="hover:text-secondary transition">Temporario</Link></li>
              <li><Link to="/vender" className="hover:text-secondary transition">Vender</Link></li>
              <li><Link to="/contactanos" className="hover:text-secondary transition">Contacto</Link></li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-secondary text-[11px] tracking-[0.25em] uppercase font-bold mb-6">
              Servicios
            </h3>

            <ul className="space-y-3 text-sm text-on-surface-variant">
              <li>Venta de propiedades</li>
              <li>Alquiler permanente</li>
              <li>Alquiler temporario</li>
              <li>Tasaciones</li>
              <li>Asesoramiento inmobiliario</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-secondary text-[11px] tracking-[0.25em] uppercase font-bold mb-6">
              Contacto
            </h3>

            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-secondary mt-1 flex-shrink-0" />
                <span>Mar del Plata, Buenos Aires<br />Argentina</span>
              </li>

              <li className="flex items-center gap-3">
                <FaPhone className="text-secondary" />
                <a href="tel:+5491148223456" className="hover:text-secondary transition">
                  (011) 4822-3456
                </a>
              </li>

              <li className="flex items-center gap-3">
                <FaEnvelope className="text-secondary" />
                <a href="mailto:info@faleronipropiedades.com" className="hover:text-secondary transition">
                  info@faleronipropiedades.com
                </a>
              </li>
            </ul>

            <div className="mt-6 text-xs text-white/40 leading-relaxed">
              <p>Horario de atención</p>
              <p>Lunes a viernes de 9:00 a 18:00</p>
              <p>Sábados de 10:00 a 14:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-14 pt-6 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/40">
          <p>
            © {currentYear} Faleroni Propiedades. Todos los derechos reservados.
          </p>

          <div className="flex gap-6">
            <Link to="/contactanos" className="hover:text-secondary transition">
              Privacidad
            </Link>
            <Link to="/contactanos" className="hover:text-secondary transition">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}