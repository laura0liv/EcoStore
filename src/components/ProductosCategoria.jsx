import React, { useEffect, useState } from 'react'
import { getProductosCategoria } from '../../api/getProductosCategoria';
import { Link, useParams } from 'react-router-dom';
import { Header } from './layout/Header';
import { FaTshirt, FaShoppingCart, FaTimes, FaPlus, FaMinus, FaHeart, FaShare, FaStar } from 'react-icons/fa';
import '../styles/css/productosCategoria.css';

export const ProductosCategoria = () => {

  const {id} = useParams();
  const [productos, setProductos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [imagenActiva, setImagenActiva] = useState(0);

  // Tallas de ejemplo para el frontend
  const tallasDisponibles = [
    { id: 1, nombre: 'XS' },
    { id: 2, nombre: 'S' },
    { id: 3, nombre: 'M' },
    { id: 4, nombre: 'L' },
    { id: 5, nombre: 'XL' },
    { id: 6, nombre: 'XXL' }
  ];

  useEffect(() => {
    getProductosCategoria(id, setProductos);
  }, [id]);

  const abrirModal = (producto) => {
    setModalAbierto(true);
    setProductoSeleccionado(producto);
    setTallaSeleccionada(null);
    setCantidad(1);
    setImagenActiva(0);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
    setTallaSeleccionada(null);
    setCantidad(1);
    setImagenActiva(0);
  };

  const handleSeleccionTalla = (tallaId) => {
    setTallaSeleccionada(tallaId);
  };

  const incrementarCantidad = () => {
    setCantidad(prev => prev + 1);
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(prev => prev - 1);
    }
  };

  const handleAñadirCarrito = () => {
    if (tallaSeleccionada === null) {
      alert('Por favor selecciona una talla');
      return;
    }

    // Simulación de agregar al carrito (solo frontend)
    const tallaSeleccionadaNombre = tallasDisponibles.find(t => t.id === tallaSeleccionada)?.nombre;
    
    alert(`¡Producto agregado al carrito!
    
Producto: ${productoSeleccionado.nombre}
Talla: ${tallaSeleccionadaNombre}
Cantidad: ${cantidad}
Precio total: ${(productoSeleccionado.precio * cantidad).toLocaleString()}`);

    cerrarModal();
  };

  return (
    <div className='productos-categoria-container'>
      <div className='header'>
        <Header/>
        <div className='titulo-seccion'>
          <h1>Productos para Hombres</h1>
          <p>Descubre nuestra colección exclusiva</p>
        </div>
      </div>

      <div className='productos-grid'>
        {productos.length > 0 ? (
          productos.map((producto) => {
            const imagen = 'http://127.0.0.1:3001/' + JSON.parse(producto.imagen)[0];
            return (
              <div key={producto.id} className='producto-card'>
                <div className='producto-imagen-container'>
                  <img src={imagen} alt={producto.nombre} />
                  <div className='producto-overlay'>
                    <button 
                      className='btn-vista-rapida'
                      onClick={() => abrirModal(producto)}
                    >
                      Vista Rápida
                    </button>
                    <div className='acciones-producto'>
                      <button className='btn-favorito'>
                        <FaHeart />
                      </button>
                      <button className='btn-compartir'>
                        <FaShare />
                      </button>
                    </div>
                  </div>
                </div>
                <div className='producto-info'>
                  <h3>{producto.nombre}</h3>
                  <div className='producto-rating'>
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < 4 ? 'star-filled' : 'star-empty'} />
                    ))}
                    <span className='rating-text'>(4.0)</span>
                  </div>
                  <p className='producto-precio'>${producto.precio}</p>
                  <Link className='btn-ver-detalle' to={`/producto/${producto.id}`}>
                    Ver Detalles
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className='no-productos'>
            <FaTshirt className='icono-vacio' />
            <h3>No hay productos disponibles</h3>
            <p>Vuelve pronto para ver nuevos productos</p>
          </div>
        )}
      </div>

      {/* Modal de Producto */}
      {modalAbierto && productoSeleccionado && (
        <div className='modal-overlay' onClick={cerrarModal}>
          <div className='modal-producto' onClick={(e) => e.stopPropagation()}>
            <button className='btn-cerrar-modal' onClick={cerrarModal}>
              <FaTimes />
            </button>

            <div className='modal-contenido'>
              <div className='modal-imagenes'>
                <div className='imagen-principal'>
                  <img 
                    src={`http://127.0.0.1:3001/${JSON.parse(productoSeleccionado.imagen || '[]')[imagenActiva] || JSON.parse(productoSeleccionado.imagen || '[]')[0]}`}
                    alt={productoSeleccionado.nombre}
                  />
                </div>
                {JSON.parse(productoSeleccionado.imagen || '[]').length > 1 && (
                  <div className='imagenes-miniatura'>
                    {JSON.parse(productoSeleccionado.imagen || '[]').map((imagen, index) => (
                      <img
                        key={index}
                        src={`http://127.0.0.1:3001/${imagen}`}
                        alt={`${productoSeleccionado.nombre} ${index + 1}`}
                        className={imagenActiva === index ? 'activa' : ''}
                        onClick={() => setImagenActiva(index)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className='modal-detalles'>
                <div className='producto-header'>
                  <h2>{productoSeleccionado.nombre}</h2>
                  <div className='producto-rating'>
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < 4 ? 'star-filled' : 'star-empty'} />
                    ))}
                    <span className='rating-text'>(4.0) • 127 reseñas</span>
                  </div>
                </div>

                <p className='producto-descripcion'>
                  {productoSeleccionado.caracteristicas}
                </p>

                <div className='precio-container'>
                  <span className='precio-actual'>${productoSeleccionado.precio}</span>
                  <span className='precio-anterior'>${(productoSeleccionado.precio * 1.2).toFixed(0)}</span>
                  <span className='descuento'>20% OFF</span>
                </div>

                <div className='seleccion-talla'>
                  <h4>Selecciona tu talla:</h4>
                  <div className='tallas-grid'>
                    {tallasDisponibles.map((talla) => (
                      <button
                        key={talla.id}
                        className={`talla-btn ${tallaSeleccionada === talla.id ? 'seleccionada' : ''}`}
                        onClick={() => handleSeleccionTalla(talla.id)}
                      >
                        {talla.nombre}
                      </button>
                    ))}
                  </div>
                </div>

                <div className='seleccion-cantidad'>
                  <h4>Cantidad:</h4>
                  <div className='cantidad-controls'>
                    <button 
                      className='btn-cantidad'
                      onClick={decrementarCantidad}
                      disabled={cantidad <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className='cantidad-display'>{cantidad}</span>
                    <button 
                      className='btn-cantidad'
                      onClick={incrementarCantidad}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <div className='modal-acciones'>
                  <button 
                    className='btn-agregar-carrito'
                    onClick={handleAñadirCarrito}
                  >
                    <FaShoppingCart />
                    Agregar al Carrito
                  </button>
                  <button className='btn-favorito-modal'>
                    <FaHeart />
                  </button>
                </div>

                <div className='producto-extras'>
                  <div className='extra-item'>
                    <strong>SKU:</strong> {productoSeleccionado.sku}
                  </div>
                  <div className='extra-item'>
                    <strong>Envío:</strong> Gratis en compras mayores a $100.000
                  </div>
                  <div className='extra-item'>
                    <strong>Devoluciones:</strong> 30 días para cambios
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
