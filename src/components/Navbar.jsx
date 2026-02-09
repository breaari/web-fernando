import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'

export default function Navbar() {
  const nav = useNavigate()

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <FaHome />
          Inmobiliaria
        </Link>
        
        <ul className="flex gap-6 items-center">
          <li><Link to="/" className="hover:text-primary font-medium">Inicio</Link></li>
          <li><Link to="/comprar" className="hover:text-primary font-medium">Comprar</Link></li>
          <li><Link to="/alquiler" className="hover:text-primary font-medium">Alquiler</Link></li>
          <li><Link to="/alquiler-temporario" className="hover:text-primary font-medium">Alquiler Temporario</Link></li>
          <li><Link to="/vender" className="hover:text-primary font-medium">Vender</Link></li>
          <li><Link to="/contactanos" className="hover:text-primary font-medium">Contactanos</Link></li>
        </ul>
      </div>
    </nav>
  )
}
