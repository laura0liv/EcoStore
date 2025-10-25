import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getCarrito } from '../../../api/getCarrito';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Header } from '../layout/Header';

export const Cart = () => {
    const [verProductosCarrito, setVerProductosCarrito] = useState([]);
  
    useEffect(() => {
      getCarrito( setVerProductosCarrito);
    }, []);
  
    const handleEliminarProducto = async (productoId) =>{
      try {
        await axios.delete(`http://127.0.0.1:3001/eliminarProducto/${productoId}`)
        const nuevoCarrito = verProductosCarrito.filter((producto) => producto.carrito_id !== productoId);
        setVerProductosCarrito(nuevoCarrito)
  
      } catch (error) {
        console.error('Error al eliminar el producto del carrito', error);
      }
    }
    
    const handleActualizarCantidad = async (carritoId, nuevaCantidad) => {
      try {
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
        <div className="carritoCompras">
          <Header/>
          <div className='titulo'>
            <h1>Carrito de compras</h1>
          </div>
          {verProductosCarrito.length > 0 ? (
          <table className="tabla-productos">
            <thead>
              <tr>
                <th></th>
                <th>Producto</th>
                <th>Talla</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {verProductosCarrito.map((producto) => (
                <tr key={producto.carrito_id}>
                  <td className='imagen'>
                    {producto.imagen && (
                      <img src={`http://127.0.0.1:3001/${JSON.parse(producto.imagen)[0]}`} width={50} alt={producto.nombre} />
                    )}
                  </td>
                  <td>
                    <strong>{producto.nombre}</strong>
                  </td>
                  <td>
                    <p>{producto.nombre_talla}</p>
                  </td>
                  <td className='cantidad'>
                    <div className='botones'>
                      <button onClick={() => handleIncrement(producto.carrito_id)}>+</button>
                      <p>{producto.cantidad}</p>
                      <button onClick={() => handleDecrement(producto.carrito_id)}>-</button>
                    </div>
                  </td>
                  <td>
                    <p>${producto.precio}</p>
                  </td>
                  <td>
                    <button><FaTrash onClick={() => handleEliminarProducto(producto.carrito_id)} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           ) : (
            <div className='noProductos'>
              <p>Tu carrito de compras esta vacío</p>
             <Link to='/'>
                <button className='btn'>Volver a pagina principal</button>
              </Link>
            </div>
          )}
          {verProductosCarrito.length > 0 && (
          <div className='resumen'>
            <h3 >Resumen de compra</h3>
            <div className='total'>
          <p>Subtotal:</p>
          <p>{subtotal}</p>
        </div>
        <div className='total'>
          <h3>Total:</h3>
          <h3>{total}</h3>
        </div>
            <Link to='/checkout/profile'>
              <button className='btn'>Pago seguro</button>
            </Link>
          </div>
           )}
        </div>
      );
    };