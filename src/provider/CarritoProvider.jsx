// src/provider/CarritoProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCarrito, guardarCarrito } from '../../api/getCarrito.js';

const CarritoContext = createContext();

export const useCarrito = () => {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return ctx;
};

export const CarritoProvider = ({ children }) => {
  const [verProductosCarrito, setVerProductosCarrito] = useState([]);

  // Cargar carrito al iniciar
  useEffect(() => {
    getCarrito(setVerProductosCarrito);
  }, []);

  // Guardar automáticamente cada vez que cambie
  useEffect(() => {
    guardarCarrito(verProductosCarrito);
  }, [verProductosCarrito]);

  const contadorCarrito = verProductosCarrito.reduce((t, p) => t + (p.cantidad || 1), 0);

  return (
    <CarritoContext.Provider value={{
      verProductosCarrito,
      setVerProductosCarrito,
      contadorCarrito,
    }}>
      {children}
    </CarritoContext.Provider>
  );
};