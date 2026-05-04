import React, { useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaHome } from 'react-icons/fa'

const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'https://permuok.com/back-fernando/public'

function resolveImageUrl(image) {
  const rawUrl = image?.image_url || image?.url || image

  if (!rawUrl) return ''

  if (rawUrl.startsWith('http')) return rawUrl

  const cleanPath = rawUrl.replace(/^\/+/, '')

  return `${UPLOADS_URL}/${cleanPath}`
}

export default function ImageCarousel({ images, alt = 'Property' }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary/40 text-secondary border border-white/10">
        <FaHome className="text-4xl" />
      </div>
    )
  }

  const imageUrl = resolveImageUrl(images[currentIndex])

  const goToPrevious = e => {
    e.stopPropagation()
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = e => {
    e.stopPropagation()
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full h-full group bg-primary/40">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
        onError={e => {
          e.currentTarget.style.display = 'none'
        }}
      />

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-primary/80 border border-white/10 text-secondary p-3 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-secondary hover:text-primary"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary/80 border border-white/10 text-secondary p-3 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-secondary hover:text-primary"
          >
            <FaChevronRight />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={e => {
                  e.stopPropagation()
                  setCurrentIndex(idx)
                }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-secondary w-6'
                    : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}