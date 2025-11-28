import React from 'react';
import { FaTimes, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCarrito } from '../provider/CarritoProvider';
import '../styles/css/Carrito.css';

export const Carrito = ({ onCerrarCarrito, mostrarCarrito }) => {
  const { verProductosCarrito, setVerProductosCarrito, contadorCarrito } = useCarrito();

  // Función central para sincronizar carrito
  const sincronizarCarrito = (nuevoCarrito) => {
    setVerProductosCarrito(nuevoCarrito);
  };

  const eliminarProducto = (carrito_id) => {
    const nuevo = verProductosCarrito.filter(p => p.carrito_id !== carrito_id);
    sincronizarCarrito(nuevo);
  };

  const incrementar = (carrito_id) => {
    const nuevo = verProductosCarrito.map(p =>
      p.carrito_id === carrito_id ? { ...p, cantidad: p.cantidad + 1 } : p
    );
    sincronizarCarrito(nuevo);
  };

  const decrementar = (carrito_id) => {
    const producto = verProductosCarrito.find(p => p.carrito_id === carrito_id);
    if (producto && producto.cantidad > 1) {
      const nuevo = verProductosCarrito.map(p =>
        p.carrito_id === carrito_id ? { ...p, cantidad: p.cantidad - 1 } : p
      );
      sincronizarCarrito(nuevo);
    } else {
      eliminarProducto(carrito_id);
    }
  };

  // CORREGIDO: Cálculo del total (usando price o precio)
  const total = verProductosCarrito
    .reduce((acc, p) => {
      const precio = parseFloat(p.price || p.precio || 0);
      const cantidad = p.cantidad || 1;
      return acc + (precio * cantidad);
    }, 0)
    .toFixed(2);

  return (
    <div className={`carrito-sidebar ${mostrarCarrito ? 'carrito-abierto' : ''}`}>
      {mostrarCarrito && <div className="carrito-overlay" onClick={onCerrarCarrito} />}

      <div className="carrito-contenido" onClick={e => e.stopPropagation()}>
        <div className="carrito-header">
          <h2>Mi Carrito ({contadorCarrito})</h2>
          <button className="btn-cerrar" onClick={onCerrarCarrito}>
            <FaTimes />
          </button>
        </div>

        <div className="carrito-productos">
          {verProductosCarrito.length === 0 ? (
            <div className="carrito-vacio">
              <FaShoppingCart size={60} />
              <h3>Tu carrito está vacío</h3>
              <p>¡Agrega productos increíbles!</p>
              <Link to="/" onClick={onCerrarCarrito}>
                <button className="btn-explorar">Explorar tienda</button>
              </Link>
            </div>
          ) : (
            <ul>
              {verProductosCarrito.map(producto => {
                const imagen = producto.image || producto.imagen?.[0] || 'https://via.placeholder.com/80';

                return (
                  <li key={producto.carrito_id} className="producto-item">
                    <div className="producto-imagen">
                      <img
                        src={imagen}
                        alt={producto.title || producto.nombre}
                        onError={e => e.target.src = 'https://via.placeholder.com/80'}
                      />
                    </div>

                    <div className="producto-info">
                      <h4>{producto.title || producto.nombre}</h4>
                      {producto.nombre_talla && (
                        <span className="talla">Talla: {producto.nombre_talla}</span>
                      )}

                      <div className="cantidad-controles">
                        <button onClick={() => decrementar(producto.carrito_id)}>-</button>
                        <span>{producto.cantidad || 1}</span>
                        <button onClick={() => incrementar(producto.carrito_id)}>+</button>
                      </div>

                      <span className="precio">
                        ${(parseFloat(producto.price || producto.precio || 0) * (producto.cantidad || 1)).toFixed(2)}
                      </span>
                    </div>

                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarProducto(producto.carrito_id)}
                    >
                      <FaTrash />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer con total y botón de checkout */}
        {verProductosCarrito.length > 0 && (
          <div className="carrito-footer">
            <div className="resumen-total">
              <div className="linea-total total-final">
                <span>Total:</span>
                <span className="precio-total">${total}</span>
              </div>
            </div>

            <Link to="/checkout" onClick={onCerrarCarrito}>
              <button className="btn-pagar">Ir al Checkout</button>
            </Link>

            {/* BOTÓN "SEGUIR COMPRANDO" ELIMINADO (como pediste) */}
            {/* Si en el futuro lo quieres de vuelta, descomenta esta línea: */}
            {/* <button className="btn-seguir-comprando" onClick={onCerrarCarrito}>
              Seguir comprando
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};