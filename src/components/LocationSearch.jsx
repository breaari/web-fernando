import React, { useState, useEffect, useRef } from 'react'
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa'

export default function LocationSearch({ value, onChange, placeholder = "Ubicación..." }) {
  const [query, setQuery] = useState(value || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    setQuery(value || '')
  }, [value])

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(() => {
      searchLocation(query)
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  const searchLocation = async (searchQuery) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ', Argentina'
        )}&limit=5&addressdetails=1`
      )
      const data = await response.json()
      setSuggestions(data)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error searching location:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectSuggestion = (suggestion) => {
    const address = suggestion.address || {}
    const locationText = [
      address.city || address.town || address.village,
      address.state,
      address.country
    ].filter(Boolean).join(', ')
    
    setQuery(locationText)
    onChange({
      query: locationText,
      city: address.city || address.town || address.village || '',
      state: address.state || '',
      country: address.country || '',
      lat: suggestion.lat,
      lon: suggestion.lon
    })
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setQuery(newValue)
    if (!newValue) {
      onChange({ query: '', city: '', state: '', country: '', lat: null, lon: null })
      setSuggestions([])
    }
  }

  const handleClear = () => {
    setQuery('')
    onChange({ query: '', city: '', state: '', country: '', lat: null, lon: null })
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full p-3 pl-10 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, idx) => {
            const address = suggestion.address || {}
            const displayText = suggestion.display_name
            return (
              <button
                key={idx}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 flex items-start gap-2"
              >
                <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{displayText}</div>
                  {address.city && (
                    <div className="text-xs text-gray-500">
                      {[address.city, address.state, address.country].filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg p-3 text-center text-gray-500">
          Buscando ubicaciones...
        </div>
      )}
    </div>
  )
}
