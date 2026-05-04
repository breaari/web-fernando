import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import { FaRulerCombined, FaBed, FaBath, FaCar, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import ImageCarousel from '../components/ImageCarousel'
import GoogleLocationInput from '../components/GoogleLocationInput'

export default function PropertyList({ operationType }) {
  const [searchParams] = useSearchParams()

  const [properties, setProperties] = useState([])
  const [allProperties, setAllProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [operationTypes, setOperationTypes] = useState([])
  const [propertyTypes, setPropertyTypes] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [location, setLocation] = useState({ query: '', city: '', state: '', country: '', lat: null, lng: null })
  const [selectedPropertyType, setSelectedPropertyType] = useState('')
  const [selectedOperationType, setSelectedOperationType] = useState('')
  const [currency, setCurrency] = useState('ARS')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('relevant')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    api.get('/catalog/operation-types')
      .then(r => setOperationTypes(r.data.data?.operation_types || []))
      .catch(() => {})

    api.get('/catalog/property-types')
      .then(r => setPropertyTypes(r.data.data?.property_types || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const q = searchParams.get('q') || ''
    const propertyTypeId = searchParams.get('property_type_id') || ''
    const operationTypeId = searchParams.get('operation_type_id') || ''

    setLocation({
      query: q,
      city: '',
      state: '',
      country: '',
      lat: null,
      lng: null,
    })

    setSelectedPropertyType(propertyTypeId)
    setSelectedOperationType(operationTypeId)
  }, [searchParams])

  useEffect(() => {
    const operationTypeIdFromUrl = searchParams.get('operation_type_id')
    if (operationTypeIdFromUrl) return

    if (!operationType || !operationTypes.length) return

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
  }, [operationType, operationTypes, searchParams])

  useEffect(() => {
    setLoading(true)

    api.get('/properties', {
      params: {
        page,
        limit: 50,
      },
    })
      .then(r => {
        const data = r.data.data
        const props = data.data || data.properties || []
        setAllProperties(props)
        setTotal(props.length)
      })
      .catch(err => {
        console.error('Error loading properties:', err)
        setAllProperties([])
      })
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => {
    let filtered = [...allProperties]

    if (location.query.trim()) {
      const q = location.query.toLowerCase()

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

    if (selectedPropertyType) {
      filtered = filtered.filter(p => String(p.property_type_id) === String(selectedPropertyType))
    }

    if (selectedOperationType) {
      filtered = filtered.filter(p => String(p.operation_type_id) === String(selectedOperationType))
    }

    if (minPrice || maxPrice) {
      filtered = filtered.filter(p => {
        if (p.currency !== currency) return false

        const price = parseFloat(p.price)
        if (isNaN(price)) return false

        const min = minPrice ? parseFloat(minPrice) : 0
        const max = maxPrice ? parseFloat(maxPrice) : Infinity

        return price >= min && price <= max
      })
    }

    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    }

    setProperties(filtered)
  }, [
    allProperties,
    location,
    selectedPropertyType,
    selectedOperationType,
    currency,
    minPrice,
    maxPrice,
    sortBy,
  ])

  const clearFilters = () => {
    setLocation({ query: '', city: '', state: '', country: '', lat: null, lng: null })
    setSelectedPropertyType('')
    setSelectedOperationType('')
    setMinPrice('')
    setMaxPrice('')
    setCurrency('ARS')
  }

  return (
    <div className="bg-surface min-h-screen pt-28 pb-20 text-on-surface">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="mb-10">
          <span className="text-secondary tracking-[0.25em] text-xs uppercase block mb-3">
            Catálogo inmobiliario
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Propiedades disponibles
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Explorá oportunidades de compra, alquiler y alquiler temporario según tus necesidades.
          </p>
        </div>

        <div className="bg-primary/60 backdrop-blur-xl p-6 md:p-8 border border-white/10 rounded-xl shadow-2xl mb-8">
          <div className="space-y-5">
            <div>
              <label className="text-secondary/70 text-[10px] tracking-widest uppercase font-bold block mb-2">
                Ubicación
              </label>
              <GoogleLocationInput
                value={location.query}
                onChange={(value) => {
                  setLocation(prev => ({
                    ...prev,
                    query: value,
                  }))
                }}
                onSelect={(place) => {
                  setLocation({
                    query: place.query || '',
                    city: place.city || '',
                    state: place.state || '',
                    country: place.country || '',
                    lat: place.lat || null,
                    lng: place.lng || null,
                  })
                }}
                placeholder="Ciudad, barrio o dirección"
                className="w-full bg-transparent border-0 border-b border-white/20 focus:border-secondary focus:ring-0 px-0 py-3 text-white placeholder:text-white/40 outline-none font-semibold"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full flex items-center justify-between px-4 py-3 border border-secondary/40 text-secondary rounded-sm hover:bg-secondary hover:text-primary transition text-sm"
            >
              <span className="flex items-center gap-2">
                <FaFilter />
                Más filtros
              </span>
              {showFilters ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            <div className={`space-y-5 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-secondary/70 text-[10px] tracking-widest uppercase font-bold block mb-2">
                    Tipo de propiedad
                  </label>
                  <select
                    value={selectedPropertyType}
                    onChange={e => setSelectedPropertyType(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-white/20 focus:border-secondary focus:ring-0 px-0 py-3 text-white outline-none"
                  >
                    <option className="bg-primary" value="">Todos</option>
                    {propertyTypes.map(t => (
                      <option className="bg-primary" key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-secondary/70 text-[10px] tracking-widest uppercase font-bold block mb-2">
                    Tipo de operación
                  </label>
                  <select
                    value={selectedOperationType}
                    onChange={e => setSelectedOperationType(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-white/20 focus:border-secondary focus:ring-0 px-0 py-3 text-white outline-none"
                  >
                    <option className="bg-primary" value="">Todos</option>
                    {operationTypes.map(t => (
                      <option className="bg-primary" key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div>
                  <label className="text-secondary/70 text-[10px] tracking-widest uppercase font-bold block mb-2">
                    Moneda
                  </label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-white/20 focus:border-secondary focus:ring-0 px-0 py-3 text-white outline-none"
                  >
                    <option className="bg-primary" value="ARS">ARS</option>
                    <option className="bg-primary" value="USD">USD</option>
                  </select>
                </div>

                <div>
                  <label className="text-secondary/70 text-[10px] tracking-widest uppercase font-bold block mb-2">
                    Mín.
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="1000"
                    inputMode='numeric'
                    className="appearance-none w-full bg-transparent border-0 border-b border-white/20 focus:border-secondary focus:ring-0 px-0 py-3 text-white placeholder:text-white/40 outline-none"
                  />
                </div>

                <div>
                  <label className="text-secondary/70 text-[10px] tracking-widest uppercase font-bold block mb-2">
                    Máx.
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    placeholder="Sin límite"
                    min="0"
                    step="1000"
                    inputMode='numeric'
                    className=" appearance-none w-full bg-transparent border-0 border-b border-white/20 focus:border-secondary focus:ring-0 px-0 py-3 text-white placeholder:text-white/40 outline-none"
                  />
                </div>

                <div className="flex items-end col-span-2 md:col-span-1">
                  <button
                    onClick={clearFilters}
                    className="w-full h-12 border border-secondary/50 text-secondary text-[11px] tracking-widest uppercase font-bold hover:bg-secondary hover:text-primary transition rounded-sm"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <p className="text-secondary text-xs uppercase tracking-[0.2em] mb-1">
              Resultados
            </p>
            <p className="text-on-surface-variant text-sm">
              {loading
                ? 'Cargando propiedades...'
                : `${properties.length} ${properties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-secondary/70 text-[10px] tracking-widest uppercase font-bold">
              Ordenar
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-primary/60 border border-white/10 rounded-sm px-4 py-2 text-sm text-white focus:border-secondary focus:ring-0 outline-none"
            >
              <option className="bg-primary" value="relevant">Más relevantes</option>
              <option className="bg-primary" value="price-asc">Menor precio</option>
              <option className="bg-primary" value="price-desc">Mayor precio</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 border border-white/10 bg-primary/20 rounded-xl text-on-surface-variant">
            Cargando propiedades...
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 border border-white/10 bg-primary/20 rounded-xl">
            <p className="text-white font-semibold mb-2">
              No hay propiedades que coincidan con los filtros
            </p>
            <p className="text-on-surface-variant text-sm">
              Probá ajustar la ubicación, el tipo de operación o el rango de precio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {properties.map(p => (
              <div
                key={p.id}
                className="group flex flex-col md:flex-row bg-primary/40 border border-white/10 rounded-xl overflow-hidden hover:border-secondary/70 hover:bg-primary/60 transition shadow-2xl"
              >
                <Link
                  to={`/propiedad/${p.id}`}
                  className="w-full md:w-[320px] h-56 md:h-64 flex-shrink-0 overflow-hidden"
                >
                  <ImageCarousel images={p.images} alt={p.title} />
                </Link>

                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/propiedad/${p.id}`}>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-secondary transition">
                        {p.title}
                      </h3>
                    </Link>

                    <p className="text-secondary text-2xl md:text-3xl font-bold mb-3">
                      ${parseFloat(p.price).toLocaleString()} {p.currency}
                    </p>

                    <p className="text-sm text-on-surface-variant mb-5">
                      {[p.street, p.street_number, p.neighborhood, p.city].filter(Boolean).join(', ')}
                    </p>

                    {p.description && (
                      <p className="text-sm text-white/65 mb-6 line-clamp-2 hidden sm:block leading-relaxed">
                        {p.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 md:gap-4 text-sm">
                    {p.surface_total && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/80">
                        <FaRulerCombined className="text-secondary" />
                        <span>{p.surface_total} m²</span>
                      </div>
                    )}

                    {p.bedrooms && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/80">
                        <FaBed className="text-secondary" />
                        <span>{p.bedrooms} dorm.</span>
                      </div>
                    )}

                    {p.bathrooms && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/80">
                        <FaBath className="text-secondary" />
                        <span>{p.bathrooms} baño</span>
                      </div>
                    )}

                    {p.garages !== undefined && p.garages !== null && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/80">
                        <FaCar className="text-secondary" />
                        <span>{p.garages || 0} coch.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}