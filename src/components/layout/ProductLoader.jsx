import React from 'react'
import '../../styles/css/ProductLoader.css'

export const ProductLoader = () => {
  return (
    <div className='product-loader-container'>
      <div className="product-loader-content">
        <div className="product-loader-grid">
          {/* Simulación de cards de productos cargando */}
          {[...Array(6)].map((_, index) => (
            <div key={index} className="product-skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-price"></div>
                <div className="skeleton-rating">
                  <div className="skeleton-stars"></div>
                </div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="loader-text">
          <div className="spinner"></div>
          <h3>Cargando productos...</h3>
          <p>Encontrando los mejores productos para ti</p>
        </div>
      </div>
    </div>
  )
}