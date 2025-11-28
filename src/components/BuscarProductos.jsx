import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { ProductLoader } from "./layout/ProductLoader";
import { useCarrito } from "../provider/CarritoProvider";
import { FaTshirt, FaStar, FaHeart, FaShare, FaSearch } from "react-icons/fa";
import "../styles/css/BuscarProductos.css";
import axios from "axios";
import { toast } from "react-hot-toast";

export const BuscarProductos = () => {
  const { termino } = useParams();
  const navigate = useNavigate();
  const { actualizarCarrito } = useCarrito();

  const [productosEncontrados, setProductosEncontrados] = useState([]);
  const [todosLosProductos, setTodosLosProductos] = useState([]); // Todos los productos de la API
  const [loading, setLoading] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState(termino || "");

  // Estados para el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [imagenActiva, setImagenActiva] = useState(0);

  // Cargar todos los productos desde Fake Store API una sola vez
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://fakestoreapi.com/products");
        const productos = response.data.map((p) => ({
          id: p.id,
          nombre: p.title,
          precio: `$${p.price.toFixed(2)}`,
          imagen: JSON.stringify([p.image]), // Solo una imagen, la convertimos a string como antes
          categoria: p.category,
          caracteristicas: p.description,
          rating: parseFloat(p.rating.rate.toFixed(1)),
          stock: Math.floor(p.rating.count / 5) + 10, // Simulamos stock
          colores: ["Negro", "Blanco", "Gris", "Azul"], // Simulados
          tallas: ["XS", "S", "M", "L", "XL"], // Simuladas (ropa)
          genero: p.category.includes("men") ? "Hombre" : p.category.includes("women") ? "Mujer" : "Unisex",
          descuento: Math.random() > 0.7 ? 20 : 0, // 30% chance de descuento
        }));
        setTodosLosProductos(productos);
      } catch (error) {
        console.error("Error cargando productos de Fake Store API", error);
        toast.error("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  // Filtrar productos cuando cambie el término de búsqueda
  useEffect(() => {
    if (!termino || !todosLosProductos.length) {
      setProductosEncontrados([]);
      return;
    }

    const terminoLower = termino.toLowerCase().trim();
    const filtrados = todosLosProductos.filter((producto) =>
      producto.nombre.toLowerCase().includes(terminoLower) ||
      producto.categoria.toLowerCase().includes(terminoLower) ||
      producto.caracteristicas.toLowerCase().includes(terminoLower) ||
      producto.genero.toLowerCase().includes(terminoLower) ||
      producto.colores.some((c) => c.toLowerCase().includes(terminoLower))
    );

    setProductosEncontrados(filtrados);
  }, [termino, todosLosProductos]);

  // Funciones del modal
  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
    setTallaSeleccionada("");
    setCantidad(1);
    setImagenActiva(0);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
  };

  const handleSeleccionarTalla = (talla) => setTallaSeleccionada(talla);

  const handleCambiarCantidad = (operacion) => {
    if (operacion === "incrementar") {
      setCantidad((prev) => prev + 1);
    } else if (operacion === "decrementar" && cantidad > 1) {
      setCantidad((prev) => prev - 1);
    }
  };

  const handleAñadirCarrito = async () => {
    const isLoggedIn = !!localStorage.getItem("token");

    if (!isLoggedIn) {
      toast.error("Debes iniciar sesión para agregar productos al carrito", {
        position: "top-center",
        style: { background: "#656a78", color: "white" },
      });
      navigate("/login");
      return;
    }

    if (!tallaSeleccionada) {
      toast.error("Por favor selecciona una talla");
      return;
    }

    try {
      // Simulamos referencia porque es Fake Store API (no hay tallas ni referencias reales)
      const idReferencia = `fake-ref-${productoSeleccionado.id}-${tallaSeleccionada}-${Date.now()}`;

      const userId = localStorage.getItem("id");

      // Guardar en carrito falso (simulado como antes)
      const carritoFalso = JSON.parse(localStorage.getItem("carritoFalso") || "[]");
      const productoCarrito = {
        carrito_id: `fake-${Date.now()}`,
        id_usuario: userId,
        cantidad: cantidad,
        nombre: productoSeleccionado.nombre,
        caracteristicas: productoSeleccionado.caracteristicas,
        precio: parseFloat(productoSeleccionado.precio.replace("$", "")),
        imagen: JSON.parse(productoSeleccionado.imagen)[0],
        referencia_id: idReferencia,
        nombre_talla: tallaSeleccionada,
        producto_id: productoSeleccionado.id,
      };

      const existeIndex = carritoFalso.findIndex(
        (item) =>
          item.producto_id === productoSeleccionado.id &&
          item.nombre_talla === tallaSeleccionada
      );

      if (existeIndex !== -1) {
        carritoFalso[existeIndex].cantidad += cantidad;
      } else {
        carritoFalso.push(productoCarrito);
      }

      localStorage.setItem("carritoFalso", JSON.stringify(carritoFalso));
      actualizarCarrito();

      toast.success("Producto añadido al carrito", {
        style: { background: "#10b981", color: "white" },
      });

      cerrarModal();
    } catch (error) {
      toast.error("Error al añadir al carrito");
      console.error(error);
    }
  };

  const handleNuevaBusqueda = (e) => {
    e.preventDefault();
    if (terminoBusqueda.trim()) {
      navigate(`/buscar/${encodeURIComponent(terminoBusqueda.trim())}`);
    }
  };

  return (
    <div className="buscar-productos-container">
      <div className="header">
        <Header />
      </div>

      <div className="titulo-seccion">
        <h1>Resultados de Búsqueda</h1>
        <p>
          {termino ? `Buscando: "${termino}"` : "Ingresa un término para buscar"}
        </p>
      </div>

      <div className="busqueda-section">
        <div className="nueva-busqueda">
          <form onSubmit={handleNuevaBusqueda} className="search-form-page">
            <div className="search-container-page">
              <FaSearch className="search-icon-page" />
              <input
                type="text"
                placeholder="Buscar productos, categorías, colores..."
                className="search-input-page"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
              <button type="submit" className="search-btn-page">
                Buscar
              </button>
            </div>
          </form>
        </div>

        <div className="resultados-header">
          <h2>
            {loading
              ? "Cargando productos..."
              : productosEncontrados.length > 0
              ? `${productosEncontrados.length} producto${productosEncontrados.length !== 1 ? "s" : ""} encontrado${productosEncontrados.length !== 1 ? "s" : ""}`
              : termino
              ? "No se encontraron productos"
              : "Busca algo para comenzar"}
          </h2>
        </div>

        {loading ? (
          <ProductLoader />
        ) : (
          <div className="productos-grid">
            {productosEncontrados.length > 0 ? (
              productosEncontrados.map((producto) => {
                const imagen = JSON.parse(producto.imagen)[0];
                return (
                  <div key={producto.id} className="producto-card">
                    <div className="producto-imagen-container">
                      <img src={imagen} alt={producto.nombre} />
                      <div className="producto-overlay">
                        <div className="acciones-producto">
                          <button className="btn-favorito"><FaHeart /></button>
                          <button className="btn-compartir"><FaShare /></button>
                        </div>
                      </div>
                    </div>
                    <div className="producto-info">
                      <span className="producto-categoria">{producto.categoria}</span>
                      <h3>{producto.nombre.length > 50 ? producto.nombre.substring(0, 50) + "..." : producto.nombre}</h3>
                      <div className="producto-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < Math.floor(producto.rating) ? "star-filled" : "star-empty"}
                          />
                        ))}
                        <span className="rating-text">({producto.rating})</span>
                      </div>
                      <p className="producto-precio">{producto.precio}</p>
                      {producto.descuento > 0 && (
                        <span className="descuento-badge">{producto.descuento}% OFF</span>
                      )}
                      <button className="btn-ver-detalle" onClick={() => abrirModal(producto)}>
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                );
              })
            ) : termino ? (
              <div className="no-productos">
                <FaSearch className="icono-vacio" />
                <h3>No se encontraron productos</h3>
                <p>Prueba con: camiseta, electronics, jewelery, shoes...</p>
              </div>
            ) : (
              <div className="no-productos">
                <FaSearch className="icono-vacio" />
                <h3>¿Qué estás buscando hoy?</h3>
                <p>Explora nuestra tienda con miles de productos</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal - igual que antes */}
      {modalAbierto && productoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>×</button>

            <div className="modal-imagenes">
              <div className="imagen-principal">
                <img src={JSON.parse(productoSeleccionado.imagen)[0]} alt={productoSeleccionado.nombre} />
              </div>
            </div>

            <div className="modal-detalles">
              <h2>{productoSeleccionado.nombre}</h2>
              <div className="producto-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(productoSeleccionado.rating) ? "star-filled" : "star-empty"} />
                ))}
                <span className="rating-text">({productoSeleccionado.rating})</span>
              </div>

              <p className="precio-modal">{productoSeleccionado.precio}</p>
              {productoSeleccionado.descuento > 0 && (
                <span className="descuento-badge">{productoSeleccionado.descuento}% OFF</span>
              )}

              <p className="descripcion">{productoSeleccionado.caracteristicas}</p>

              <div className="categoria-info">
                <span><strong>Categoría:</strong> {productoSeleccionado.categoria}</span>
                <span><strong>Género:</strong> {productoSeleccionado.genero}</span>
                <span><strong>Stock:</strong> {productoSeleccionado.stock} disponibles</span>
              </div>

              <div className="selector-tallas">
                <h4>Seleccionar Talla:</h4>
                <div className="tallas-grid">
                  {productoSeleccionado.tallas.map((talla) => (
                    <button
                      key={talla}
                      className={`talla-btn ${tallaSeleccionada === talla ? "seleccionada" : ""}`}
                      onClick={() => handleSeleccionarTalla(talla)}
                    >
                      {talla}
                    </button>
                  ))}
                </div>
              </div>

              <div className="colores-disponibles">
                <h4>Colores:</h4>
                <div className="colores-lista">
                  {productoSeleccionado.colores.map((color, i) => (
                    <span key={i} className="color-item">{color}</span>
                  ))}
                </div>
              </div>

              <div className="selector-cantidad">
                <h4>Cantidad:</h4>
                <div className="cantidad-controles">
                  <button onClick={() => handleCambiarCantidad("decrementar")}>-</button>
                  <span>{cantidad}</span>
                  <button onClick={() => handleCambiarCantidad("incrementar")}>+</button>
                </div>
              </div>

              <button className="btn-añadir-carrito" onClick={handleAñadirCarrito}>
                Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};