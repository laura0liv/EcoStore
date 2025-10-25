import React from 'react'

export const Loading = () => {
  return (
    <div className='app-loading'>
      <div className="loading-content">
        <div className="loader-container">
          <span className="loader"></span>
          <div className="loader-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="loading-text">
          <h2>Cargando EcoStore</h2>
          <p>Preparando tu experiencia de compra...</p>
        </div>
      </div>
    </div>
  )
}
