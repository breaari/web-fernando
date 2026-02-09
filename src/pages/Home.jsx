import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import api from '../utils/api'
import { fetchFeaturedProperties } from '../store/slices/propertiesSlice'
import { FaRulerCombined, FaBed, FaBath } from 'react-icons/fa'
import ImageCarousel from '../components/ImageCarousel'

export default function Home() {
  const nav = useNavigate()
  const dispatch = useDispatch()
  const featured = useSelector(s => s.properties.featured)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [operationType, setOperationType] = useState('')
  const [propertyTypes, setPropertyTypes] = useState([])
  const [operationTypes, setOperationTypes] = useState([])

  useEffect(() => {
    dispatch(fetchFeaturedProperties())
  }, [dispatch])

  useEffect(() => {
    api.get('/catalog/property-types').then(r => setPropertyTypes(r.data.data?.property_types || [])).catch(() => {})
    api.get('/catalog/operation-types').then(r => setOperationTypes(r.data.data?.operation_types || [])).catch(() => {})
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.append('q', searchTerm)
    if (propertyType) params.append('property_type_id', propertyType)
    if (operationType) params.append('operation_type_id', operationType)
    nav(`/comprar?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero con búsqueda */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Encuentra tu propiedad ideal</h1>
          <p className="text-lg mb-8 opacity-90">Busca entre cientos de propiedades para comprar, alquilar o vender</p>
          
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                placeholder="Buscar por ubicación o palabras clave"
                className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={propertyType}
                onChange={e => setPropertyType(e.target.value)}
                className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tipo de propiedad</option>
                {propertyTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <select
                value={operationType}
                onChange={e => setOperationType(e.target.value)}
                className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tipo de operación</option>
                {operationTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white p-3 rounded font-semibold hover:bg-blue-600"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Propiedades Destacadas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Propiedades Destacadas</h2>
          <p className="text-center text-gray-600 mb-12">Las mejores oportunidades en el mercado inmobiliario</p>
          
          {featured && featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map(p => (
                <Link 
                  key={p.id} 
                  to={`/propiedad/${p.id}`}
                  className="bg-white rounded shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <div className="h-48 overflow-hidden">
                    <ImageCarousel images={p.images} alt={p.title} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 truncate hover:text-blue-600 transition">{p.title}</h3>
                    <p className="text-primary font-bold text-xl mb-2">${parseFloat(p.price).toLocaleString()} {p.currency}</p>
                    <p className="text-sm text-gray-600 mb-3">{[p.street, p.street_number, p.city].filter(Boolean).join(', ')}</p>
                    <div className="flex gap-3 text-xs text-gray-700">
                      {p.bedrooms && <div className="flex items-center gap-1"><FaBed/>{p.bedrooms}</div>}
                      {p.bathrooms && <div className="flex items-center gap-1"><FaBath/>{p.bathrooms}</div>}
                      {p.surface_total && <div className="flex items-center gap-1"><FaRulerCombined/>{p.surface_total} m²</div>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No hay propiedades destacadas en este momento</p>
          )}
        </div>
      </section>
    </div>
  )
}
