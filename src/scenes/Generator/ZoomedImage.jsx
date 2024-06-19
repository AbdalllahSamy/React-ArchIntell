import React from 'react'

export const ZoomedImage = ({ src, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="relative">
        <img src={src} alt="Zoomed" className="max-w-full max-h-full" />
        <button
          className="absolute top-0 right-0 m-4 text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  )
}
