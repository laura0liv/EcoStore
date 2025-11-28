// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../provider/CarritoProvider';
import { toast } from 'react-hot-toast';
import '../styles/css/Checkout.css';

export const Checkout = () => {
  const navigate = useNavigate();
  const { verProductosCarrito, setVerProductosCarrito, contadorCarrito } = useCarrito();
  const [cargando, setCargando] = useState(false);
  const [ordenConfirmada, setOrdenConfirmada] = useState(null);

  // CORREGIDO: Redirección segura dentro de useEffect
  useEffect(() => {
    if (verProductosCarrito.length === 0 && !ordenConfirmada) {
      toast.error('Tu carrito está vacío');
      navigate('/');
    }
  }, [verProductosCarrito, ordenConfirmada, navigate]);

  const total = verProductosCarrito
    .reduce((acc, p) => acc + (parseFloat(p.price || p.precio || 0) * (p.cantidad || 1)), 0)
    .toFixed(2);

  const handleFinalizarCompra = async () => {
    setCargando(true);

    const userId = localStorage.getItem('userId') || 1;

    const productosParaAPI = verProductosCarrito.map(p => ({
      productId: p.id || p.producto_id,
      quantity: p.cantidad || 1
    }));

    const payload = {
      userId: parseInt(userId),
      date: new Date().toISOString(),
      products: productosParaAPI
    };

    try {
      const res = await fetch('https://fakestoreapi.com/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error al procesar la compra');

      const nuevaOrden = await res.json();

      // Limpiar carrito
      setVerProductosCarrito([]);
      localStorage.removeItem('carritoFalso');

      setOrdenConfirmada(nuevaOrden);
      toast.success('¡Compra realizada con éxito!', { duration: 5000 });
    } catch (err) {
      toast.error('Error al procesar el pago');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  // Si ya hay orden confirmada → mostrar pantalla de éxito
  if (ordenConfirmada) {
    return (
      <div className="checkout-confirmacion">
        <div className="confirmacion-card">
          <h1>¡Gracias por tu compra!</h1>
          <p>Tu pedido ha sido procesado correctamente.</p>
          
          <div className="detalle-orden">
            <h3>Número de orden:</h3>
            <strong>#{ordenConfirmada.id}</strong>
          </div>

          <div className="resumen-compra">
            <p><strong>Productos:</strong> {contadorCarrito}</p>
            <p><strong>Total pagado:</strong> ${total}</p>
            <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
          </div>

          <button className="btn-seguir-comprando" onClick={() => navigate('/')}>
            Seguir comprando
          </button>
        </div>
      </div>
    );
  }

  // Pantalla normal del checkout
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Finalizar Compra</h1>

        <div className="resumen-carrito">
          <h2>Resumen de tu pedido ({contadorCarrito} productos)</h2>
          <ul>
            {verProductosCarrito.map(p => (
              <li key={p.carrito_id} className="item-resumen">
                <img 
                  src={p.image || p.imagen?.[0] || 'https://via.placeholder.com/60'} 
                  alt={p.title || p.nombre} 
                />
                <div>
                  <strong>{p.title || p.nombre}</strong>
                  {p.nombre_talla && <span> · Talla {p.nombre_talla}</span>}
                  <p>Cantidad: {p.cantidad || 1}</p>
                </div>
                <span>
                  ${(parseFloat(p.price || p.precio) * (p.cantidad || 1)).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="total-final">
            <strong>Total a pagar:</strong>
            <strong className="precio-grande">${total}</strong>
          </div>
        </div>

        <div className="botones-checkout">
          <button
            className="btn-cancelar"
            onClick={() => navigate(-1)}
            disabled={cargando}
          >
            Volver
          </button>

          <button
            className="btn-confirmar"
            onClick={handleFinalizarCompra}
            disabled={cargando}
          >
            {cargando ? 'Procesando compra...' : 'Confirmar y Pagar'}
          </button>
        </div>
      </div>
    </div>
  );
};