import React, { useEffect, useState } from 'react';
import { FaTimes, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { getCarrito } from '../../api/getCarrito';
import { Link, useParams } from 'react-router-dom';
import { useCarrito } from '../provider/CarritoProvider';
import axios from 'axios';
import '../styles/css/Carrito.css';

export const Carrito = ({ onCerrarCarrito, mostrarCarrito }) => {

  // Usar el contexto del carrito
  const { verProductosCarrito, setVerProductosCarrito, actualizarCarrito } = useCarrito();
  
  useEffect(() => {
    actualizarCarrito();
  }, [actualizarCarrito]);

  const handleEliminarProducto = async (productoId) => {
    try {
      // Si es un producto falso (ID empieza con 'fake-')
      if (productoId.toString().startsWith('fake-')) {
        const carritoFalso = JSON.parse(localStorage.getItem('carritoFalso') || '[]');
        const nuevoCarritoFalso = carritoFalso.filter((producto) => producto.carrito_id !== productoId);
        localStorage.setItem('carritoFalso', JSON.stringify(nuevoCarritoFalso));
        
        const nuevoCarrito = verProductosCarrito.filter((producto) => producto.carrito_id !== productoId);
        setVerProductosCarrito(nuevoCarrito);
      } else {
        // Producto real - usar API
        await axios.delete(`http://127.0.0.1:3001/eliminarProducto/${productoId}`);
        const nuevoCarrito = verProductosCarrito.filter((producto) => producto.carrito_id !== productoId);
        setVerProductosCarrito(nuevoCarrito);
      }
    } catch (error) {
      console.error('Error al eliminar el producto del carrito', error);
    }
  }
  
  const handleActualizarCantidad = async (carritoId, nuevaCantidad) => {
    try {
      // Si es un producto falso (ID empieza con 'fake-')
      if (carritoId.toString().startsWith('fake-')) {
        const carritoFalso = JSON.parse(localStorage.getItem('carritoFalso') || '[]');
        const index = carritoFalso.findIndex((producto) => producto.carrito_id === carritoId);
        
        if (index !== -1) {
          carritoFalso[index].cantidad = nuevaCantidad;
          localStorage.setItem('carritoFalso', JSON.stringify(carritoFalso));
          
          const nuevoCarrito = [...verProductosCarrito];
          const carritoIndex = nuevoCarrito.findIndex((producto) => producto.carrito_id === carritoId);
          if (carritoIndex !== -1) {
            nuevoCarrito[carritoIndex].cantidad = nuevaCantidad;
            setVerProductosCarrito(nuevoCarrito);
          }
        }
      } else {
        // Producto real - usar API
        await axios.post('http://127.0.0.1:3001/actualizarCantidad', {
            id: carritoId,
          cantidad: nuevaCantidad
        });

        const nuevoCarrito = [...verProductosCarrito];
        const index = nuevoCarrito.findIndex((producto) => producto.carrito_id === carritoId);

        if (index !== -1) {
          nuevoCarrito[index].cantidad = nuevaCantidad;
          setVerProductosCarrito(nuevoCarrito);
        }
      }
    } catch (error) {
      console.error('Error al actualizar el carrito', error);
    }
  };

  const handleIncrement = (productoId) => {
    const nuevoCarrito = [...verProductosCarrito];
    const index = nuevoCarrito.findIndex((producto) => producto.carrito_id === productoId);

    if (index !== -1) {
      const nuevaCantidad = nuevoCarrito[index].cantidad + 1;
      handleActualizarCantidad(productoId, nuevaCantidad);
    }
  };

  const handleDecrement = (productoId) => {
    const nuevoCarrito = [...verProductosCarrito];
    const index = nuevoCarrito.findIndex((producto) => producto.carrito_id === productoId);

    if (index !== -1) {
      const nuevaCantidad = nuevoCarrito[index].cantidad - 1;
  
      if (nuevaCantidad > 0) {
        
        handleActualizarCantidad(productoId, nuevaCantidad);
      } else {
        handleEliminarProducto(productoId);
      }
    }
  };

 
  const subtotal = Array.isArray(verProductosCarrito)
  ? verProductosCarrito.reduce((total, producto) => total + producto.cantidad * producto.precio, 0)
  : 0;

  const total = subtotal;

  return (
    <div className={`carrito-sidebar ${mostrarCarrito ? 'carrito-abierto' : 'carrito-cerrado'}`}>
      {/* Overlay para cerrar el carrito */}
      {mostrarCarrito && (
        <div className="carrito-overlay" onClick={onCerrarCarrito}></div>
      )}
      
      {/* Contenedor del sidebar */}
      <div className="carrito-contenido" onClick={(e) => e.stopPropagation()}>
        {/* Header del carrito */}
        <div className='carrito-header'>
          <h2>Mi Carrito</h2>
          <button className='btn-cerrar' onClick={onCerrarCarrito}>
            <FaTimes />
          </button>
        </div>

        {/* Lista de productos */}
        <div className='carrito-productos'>
          {verProductosCarrito.length > 0 ? (
            <ul>
              {verProductosCarrito.map((producto) => {
                // Manejar diferentes formatos de imagen
                let imagen = '';
                if (producto.imagen) {
                  if (typeof producto.imagen === 'string') {
                    try {
                      const imagenArray = JSON.parse(producto.imagen);
                      if (Array.isArray(imagenArray) && imagenArray.length > 0) {
                        // Imagen de producto real
                        imagen = imagenArray[0].startsWith('http') ? imagenArray[0] : 'http://127.0.0.1:3001/' + imagenArray[0];
                      }
                    } catch (e) {
                      // Si no es JSON válido, usar directamente
                      imagen = producto.imagen.startsWith('http') ? producto.imagen : 'http://127.0.0.1:3001/' + producto.imagen;
                    }
                  } else if (Array.isArray(producto.imagen)) {
                    // Imagen ya es array
                    imagen = producto.imagen[0];
                  }
                }

                return (
                  <li key={producto.carrito_id} className="producto-item">
                    <div className='producto-imagen'>
                      {imagen && <img src={imagen} alt={producto.nombre} />}
                    </div>
                    <div className='producto-info'>
                      <h4>{producto.nombre}</h4>
                      <div className='producto-detalles'>
                        <span className='talla'>Talla: {producto.nombre_talla}</span>
                        <span className='precio'>${typeof producto.precio === 'number' ? producto.precio.toLocaleString() : producto.precio}</span>
                      </div>
                      <div className='cantidad-controles'>
                        <button onClick={() => handleDecrement(producto.carrito_id)}>-</button>
                        <span className='cantidad'>{producto.cantidad}</span>
                        <button onClick={() => handleIncrement(producto.carrito_id)}>+</button>
                      </div>
                    </div>
                    <button 
                      className='btn-eliminar' 
                      onClick={() => handleEliminarProducto(producto.carrito_id)}
                    >
                      <FaTrash />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className='carrito-vacio'>
              <div className='icono-vacio'>
                <FaShoppingCart />
              </div>
              <h3>Tu carrito está vacío</h3>
              <p>¡Descubre nuestros productos increíbles!</p>
              <Link to='/' onClick={onCerrarCarrito}>
                <button className='btn-explorar'>Explorar productos</button>
              </Link>
            </div>
          )}
        </div>

        {/* Footer del carrito */}
        {verProductosCarrito.length > 0 && (
          <div className='carrito-footer'>
            <div className='resumen-total'>
              <div className='linea-total'>
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className='linea-total total-final'>
                <span>Total:</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
            <Link to='/checkout/cart' onClick={onCerrarCarrito}>
              <button className='btn-pagar'>Proceder al pago</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
  