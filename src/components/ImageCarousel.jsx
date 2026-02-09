import React, { useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaHome } from 'react-icons/fa'

export default function ImageCarousel({ images, alt = 'Property' }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
        <FaHome className="text-4xl" />
      </div>
    )
  }

  const normalizeImageUrl = (img) => {
    if(!img) return img
    if (img.startsWith('http') || img.startsWith('//')) return img
    let v = img.replace(/\\/g, '/')
    if (!v.startsWith('/')) v = '/' + v
    const base = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    return base.replace(/\/$/, '') + v
  }

  const goToPrevious = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = (e) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full h-full group">
      <img
        src={normalizeImageUrl(images[currentIndex].image_url)}
        alt={alt}
        className="w-full h-full object-cover"
      />
      
      {images.length > 1 && (
        <>
          {/* Botón anterior */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <FaChevronLeft />
          </button>

          {/* Botón siguiente */}
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <FaChevronRight />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(idx)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
