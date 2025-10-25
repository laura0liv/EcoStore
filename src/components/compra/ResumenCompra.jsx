import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getCarrito } from '../../../api/getCarrito';

export const ResumenCompra = () => {
    const [verProductosCarrito, setVerProductosCarrito] = useState([]);
  
    useEffect(() => {
      getCarrito( setVerProductosCarrito);
    }, []);
    const subtotal = Array.isArray(verProductosCarrito)
    ? verProductosCarrito.reduce((total, producto) => total + producto.cantidad * producto.precio, 0)
    : 0;
  
    const total = subtotal;
  
  return (
    <div className='resumen-compra'>
    <div className='title'>
      <h1>Resumen compra</h1>
      <Link to='/checkout/cart'>
        <p>Ir al carrito</p>
      </Link>
    </div>
    <div className='productos'>
        <table>
          <thead>
            <tr>
              <th>productos</th>
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
                    <div className='caracteristicas'>
                    <p>{producto.nombre_talla}</p>
                    </div>
                  </td>
                  <td>
                    <div className='cantidad'>
            
                      <p>{producto.cantidad}</p>
                    </div>
                  </td>
                  <td>
                    <div className='caracteristicas'>

                      <p>${producto.precio}</p>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
    </div>
    <div className='total'>
          <p>Subtotal:</p>
          <p>{subtotal}</p>
    </div>
    <div className='total'>
          <h3>Total:</h3>
          <h3>{total}</h3>
    </div>
  
   

  </div>
  )
}
