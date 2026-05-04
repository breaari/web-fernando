import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import logo from '../assets/logofondoblanco.png'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-primary/95 backdrop-blur-md border-b border-secondary/10">
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="logo" className="h-12 md:h-14 object-contain" />
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-10 font-label-caps text-[11px] tracking-widest uppercase">
          <li><Link to="/" className="text-secondary border-b-2 border-secondary pb-1">Inicio</Link></li>
          <li><Link to="/comprar" className="text-on-surface/70 hover:text-secondary transition">Comprar</Link></li>
          <li><Link to="/alquiler" className="text-on-surface/70 hover:text-secondary transition">Alquiler</Link></li>
          <li><Link to="/alquiler-temporario" className="text-on-surface/70 hover:text-secondary transition">Temporario</Link></li>
          <li><Link to="/vender" className="text-on-surface/70 hover:text-secondary transition">Vender</Link></li>
        </ul>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            to="/contactanos"
            className="border border-secondary/60 text-secondary px-6 py-2 text-[11px] tracking-widest uppercase hover:bg-secondary hover:text-primary transition"
          >
            Contacto
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-xl text-white"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary border-t border-white/10 px-6 py-4 space-y-4">
          <Link to="/" onClick={()=>setIsOpen(false)} className="block text-white/80 hover:text-secondary">Inicio</Link>
          <Link to="/comprar" onClick={()=>setIsOpen(false)} className="block text-white/80 hover:text-secondary">Comprar</Link>
          <Link to="/alquiler" onClick={()=>setIsOpen(false)} className="block text-white/80 hover:text-secondary">Alquiler</Link>
          <Link to="/alquiler-temporario" onClick={()=>setIsOpen(false)} className="block text-white/80 hover:text-secondary">Temporario</Link>
          <Link to="/vender" onClick={()=>setIsOpen(false)} className="block text-white/80 hover:text-secondary">Vender</Link>

          <Link
            to="/contactanos"
            onClick={()=>setIsOpen(false)}
            className="block border border-secondary text-secondary text-center py-2 mt-4"
          >
            Contacto
          </Link>
        </div>
      )}
    </nav>
  )
}