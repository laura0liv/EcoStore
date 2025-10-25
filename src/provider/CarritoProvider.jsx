import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCarrito } from '../../api/getCarrito';

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de CarritoProvider');
  }
  return context;
};

export const CarritoProvider = ({ children }) => {
  const [verProductosCarrito, setVerProductosCarrito] = useState([]);
  const [contadorCarrito, setContadorCarrito] = useState(0);

  // Función para actualizar el carrito
  const actualizarCarrito = () => {
    getCarrito(setVerProductosCarrito);
  };

  // Calcular contador cuando cambian los productos
  useEffect(() => {
    const totalProductos = verProductosCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    setContadorCarrito(totalProductos);
  }, [verProductosCarrito]);

  // Cargar carrito inicial
  useEffect(() => {
    actualizarCarrito();
  }, []);

  const value = {
    verProductosCarrito,
    setVerProductosCarrito,
    contadorCarrito,
    actualizarCarrito
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};