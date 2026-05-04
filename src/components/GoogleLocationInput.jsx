import React, { useRef } from 'react'
import { Autocomplete, useLoadScript } from '@react-google-maps/api'

const libraries = ['places']

export default function GoogleLocationInput({ value, onChange, onSelect, className, placeholder }) {
  const ref = useRef(null)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const handlePlace = () => {
    const place = ref.current?.getPlace()
    if (!place) return

    const text = place.formatted_address || place.name || ''

    onChange(text)

    onSelect?.({
      query: text,
      lat: place.geometry?.location?.lat?.(),
      lng: place.geometry?.location?.lng?.(),
    })
  }

  if (!isLoaded) {
    return (
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    )
  }

  return (
    <Autocomplete
      onLoad={(a) => (ref.current = a)}
      onPlaceChanged={handlePlace}
      options={{
        componentRestrictions: { country: 'ar' },
      }}
    >
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    </Autocomplete>
  )
}