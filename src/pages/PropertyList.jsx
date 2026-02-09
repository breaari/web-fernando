import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { FaRulerCombined, FaBed, FaBath, FaCar } from 'react-icons/fa'
import ImageCarousel from '../components/ImageCarousel'
import LocationSearch from '../components/LocationSearch'

export default function PropertyList({ operationType }) {
  const [properties, setProperties] = useState([])
  const [allProperties, setAllProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [operationTypes, setOperationTypes] = useState([])
  const [propertyTypes, setPropertyTypes] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  // Filtros
  const [location, setLocation] = useState({ query: '', city: '', state: '', country: '' })
  const [selectedPropertyType, setSelectedPropertyType] = useState('')
  const [selectedOperationType, setSelectedOperationType] = useState('')
  const [currency, setCurrency] = useState('ARS')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('relevant')

  // Cargar catálogos
  useEffect(() => {
    api.get('/catalog/operation-types')
      .then(r => setOperationTypes(r.data.data?.operation_types || []))
      .catch(() => {})
    api.get('/catalog/property-types')
      .then(r => setPropertyTypes(r.data.data?.property_types || []))
      .catch(() => {})
  }, [])

  // Pre-seleccionar el tipo de operación según la ruta
  useEffect(() => {
    if (!operationType || !operationTypes.length) {
      setSelectedOperationType('')
      return
    }

    let matchedOp = null
    if (operationType === 'buy') {
      matchedOp = operationTypes.find(o => 
        o.name?.toLowerCase().includes('compra') || 
        o.name?.toLowerCase().includes('venta') ||
        o.name?.toLowerCase().includes('buy')
      )
    } else if (operationType === 'rent') {
      matchedOp = operationTypes.find(o => 
        o.name?.toLowerCase().includes('alquil') &&
        !o.name?.toLowerCase().includes('temporario')
      )
    } else if (operationType === 'short-rent') {
      matchedOp = operationTypes.find(o => 
        o.name?.toLowerCase().includes('temporario') ||
        o.name?.toLowerCase().includes('temporary')
      )
    }

    if (matchedOp) {
      setSelectedOperationType(String(matchedOp.id))
    }
  }, [operationType, operationTypes])

  // Cargar propiedades
  useEffect(() => {
    setLoading(true)
    const filters = {}
    
    // Mapear operationType de la ruta a operation_type_id
    if (operationType === 'buy' && operationTypes.length) {
      const buyOp = operationTypes.find(o => 
        o.name?.toLowerCase().includes('compra') || 
        o.name?.toLowerCase().includes('venta') ||
        o.name?.toLowerCase().includes('buy')
      )
      if (buyOp) filters.operation_type_id = buyOp.id
    } else if (operationType === 'rent' && operationTypes.length) {
      const rentOp = operationTypes.find(o => 
        o.name?.toLowerCase().includes('alquil') &&
        !o.name?.toLowerCase().includes('temporario')
      )
      if (rentOp) filters.operation_type_id = rentOp.id
    } else if (operationType === 'short-rent' && operationTypes.length) {
      const shortRentOp = operationTypes.find(o => 
        o.name?.toLowerCase().includes('temporario') ||
        o.name?.toLowerCase().includes('temporary')
      )
      if (shortRentOp) filters.operation_type_id = shortRentOp.id
    }
    
    filters.page = page
    filters.limit = 50 // Cargar más para filtrar localmente
    
    api.get('/properties', { params: filters })
      .then(r => {
        const data = r.data.data
        const props = data.data || []
        setAllProperties(props)
        setTotal(props.length)
      })
      .catch(err => {
        console.error('Error loading properties:', err)
        setAllProperties([])
      })
      .finally(() => setLoading(false))
  }, [operationType, operationTypes, page])

  // Aplicar filtros locales
  useEffect(() => {
    let filtered = [...allProperties]

    // Búsqueda por ubicación
    if (location.query.trim()) {
      const q = location.query.toLowerCase()
      
      // Si tenemos ciudad específica del selector, filtrar por ciudad exacta o parcial
      if (location.city) {
        const cityToMatch = location.city.toLowerCase()
        filtered = filtered.filter(p => {
          return p.city?.toLowerCase().includes(cityToMatch) ||
                 p.neighborhood?.toLowerCase().includes(cityToMatch) ||
                 p.province?.toLowerCase().includes(cityToMatch)
        })
      } else {
        // Si solo hay texto de búsqueda, buscar en todos los campos
        filtered = filtered.filter(p => {
          const locationMatch = 
            p.city?.toLowerCase().includes(q) ||
            p.neighborhood?.toLowerCase().includes(q) ||
            p.province?.toLowerCase().includes(q) ||
            p.street?.toLowerCase().includes(q) ||
            p.country?.toLowerCase().includes(q)
          
          const titleMatch = 
            p.title?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
          
          return locationMatch || titleMatch
        })
      }
    }

    // Filtro por tipo de propiedad
    if (selectedPropertyType) {
      filtered = filtered.filter(p => String(p.property_type_id) === selectedPropertyType)
    }

    // Filtro por tipo de operación (adicional al de la ruta)
    if (selectedOperationType) {
      filtered = filtered.filter(p => String(p.operation_type_id) === selectedOperationType)
    }

    // Filtro por precio
    if (minPrice || maxPrice) {
      filtered = filtered.filter(p => {
        // Solo filtrar por propiedades de la misma moneda
        if (p.currency !== currency) return false
        
        const price = parseFloat(p.price)
        if (isNaN(price)) return false
        
        const min = minPrice ? parseFloat(minPrice) : 0
        const max = maxPrice ? parseFloat(maxPrice) : Infinity
        
        return price >= min && price <= max
      })
    }

    // Ordenamiento
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => {
        // Ordenar solo propiedades de la misma moneda, priorizando la seleccionada
        if (a.currency !== b.currency) {
          if (a.currency === currency) return -1
          if (b.currency === currency) return 1
          return 0
        }
        return parseFloat(a.price) - parseFloat(b.price)
      })
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => {
        if (a.currency !== b.currency) {
          if (a.currency === currency) return -1
          if (b.currency === currency) return 1
          return 0
        }
        return parseFloat(b.price) - parseFloat(a.price)
      })
    }

    setProperties(filtered)
  }, [allProperties, location, selectedPropertyType, selectedOperationType, currency, minPrice, maxPrice, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Búsqueda por ubicación */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-2">Ubicación</label>
            <LocationSearch 
              value={location.query}
              onChange={setLocation}
              placeholder="Buscar por ciudad, barrio, dirección..."
            />
          </div>

          {/* Tipo de propiedad */}
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de propiedad</label>
            <select
              value={selectedPropertyType}
              onChange={(e) => setSelectedPropertyType(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {propertyTypes.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Tipo de operación */}
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de operación</label>
            <select
              value={selectedOperationType}
              onChange={(e) => setSelectedOperationType(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {operationTypes.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Precio */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Moneda</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ARS">ARS ($)</option>
              <option value="USD">USD (US$)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Precio mínimo</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              min="0"
              step="1000"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Precio máximo</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Sin límite"
              min="0"
              step="1000"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setLocation({ query: '', city: '', state: '', country: '' })
                setSelectedPropertyType('')
                setSelectedOperationType('')
                setMinPrice('')
                setMaxPrice('')
                setCurrency('ARS')
              }}
              className="w-full p-3 border rounded hover:bg-gray-50 transition"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Contador y ordenamiento */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">
          {loading ? 'Cargando...' : `${properties.length} ${properties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="relevant">Más relevantes</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
          </select>
        </div>
      </div>
      
      {/* Listado */}
      {loading ? (
        <div className="text-center py-12">Cargando propiedades...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No hay propiedades que coincidan con los filtros</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {properties.map(p => (
            <div key={p.id} className="flex border rounded-lg overflow-hidden shadow bg-white hover:shadow-xl transition">
              <Link to={`/propiedad/${p.id}`} className="w-64 h-48 flex-shrink-0">
                <ImageCarousel images={p.images} alt={p.title} />
              </Link>
              <div className="p-5 flex-1">
                <Link to={`/propiedad/${p.id}`}>
                  <h3 className="font-bold text-xl mb-2 hover:text-blue-600 transition">{p.title}</h3>
                </Link>
                <p className="text-blue-600 font-bold text-2xl mb-3">${parseFloat(p.price).toLocaleString()} {p.currency}</p>
                <p className="text-sm text-gray-600 mb-4">
                  {[p.street, p.street_number, p.neighborhood, p.city].filter(Boolean).join(', ')}
                </p>
                {p.description && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{p.description}</p>
                )}
                <div className="flex gap-6 text-sm text-gray-700">
                  {p.surface_total && <div className="flex items-center gap-2"><FaRulerCombined className="text-blue-500"/><span>{p.surface_total} m²</span></div>}
                  {p.bedrooms && <div className="flex items-center gap-2"><FaBed className="text-blue-500"/><span>{p.bedrooms} {p.bedrooms === 1 ? 'dormitorio' : 'dormitorios'}</span></div>}
                  {p.bathrooms && <div className="flex items-center gap-2"><FaBath className="text-blue-500"/><span>{p.bathrooms} {p.bathrooms === 1 ? 'baño' : 'baños'}</span></div>}
                  {p.garages !== undefined && p.garages !== null && <div className="flex items-center gap-2"><FaCar className="text-blue-500"/><span>{p.garages || 0} {p.garages === 1 ? 'cochera' : 'cocheras'}</span></div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
