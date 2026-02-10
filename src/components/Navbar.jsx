import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaHome, FaBars, FaTimes } from 'react-icons/fa'

export default function Navbar() {
  const nav = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-primary">
            <FaHome />
            <span className="hidden sm:inline">Inmobiliaria</span>
          </Link>
          
          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-6 items-center">
            <li><Link to="/" className="hover:text-primary font-medium">Inicio</Link></li>
            <li><Link to="/comprar" className="hover:text-primary font-medium">Comprar</Link></li>
            <li><Link to="/alquiler" className="hover:text-primary font-medium">Alquiler</Link></li>
            <li><Link to="/alquiler-temporario" className="hover:text-primary font-medium">Temporario</Link></li>
            <li><Link to="/vender" className="hover:text-primary font-medium">Vender</Link></li>
            <li><Link to="/contactanos" className="hover:text-primary font-medium">Contacto</Link></li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl text-gray-700 hover:text-primary"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <ul className="md:hidden mt-4 space-y-2 pb-4">
            <li><Link to="/" onClick={() => setIsOpen(false)} className="block py-2 hover:text-primary font-medium">Inicio</Link></li>
            <li><Link to="/comprar" onClick={() => setIsOpen(false)} className="block py-2 hover:text-primary font-medium">Comprar</Link></li>
            <li><Link to="/alquiler" onClick={() => setIsOpen(false)} className="block py-2 hover:text-primary font-medium">Alquiler</Link></li>
            <li><Link to="/alquiler-temporario" onClick={() => setIsOpen(false)} className="block py-2 hover:text-primary font-medium">Alquiler Temporario</Link></li>
            <li><Link to="/vender" onClick={() => setIsOpen(false)} className="block py-2 hover:text-primary font-medium">Vender</Link></li>
            <li><Link to="/contactanos" onClick={() => setIsOpen(false)} className="block py-2 hover:text-primary font-medium">Contactanos</Link></li>
          </ul>
        )}
      </div>
    </nav>
  )
}
