import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { ProductLoader } from "./layout/ProductLoader";
import { useCarrito } from "../provider/CarritoProvider";
import { FaTshirt, FaStar, FaHeart, FaShare, FaSearch } from "react-icons/fa";
import "../styles/css/BuscarProductos.css";
import productosFalsosData from "../data/productosFalsos.json";
import axios from "axios";
import { toast } from "react-hot-toast";

export const BuscarProductos = () => {
  const { termino } = useParams();
  const navigate = useNavigate();
  const { actualizarCarrito } = useCarrito();
  const [productosEncontrados, setProductosEncontrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState(termino || "");

  // Estados para el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [imagenActiva, setImagenActiva] = useState(0);

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
    setTallaSeleccionada("");
    setCantidad(1);
    setImagenActiva(0);
  };

  const handleSeleccionarTalla = (talla) => {
    setTallaSeleccionada(talla);
  };

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
        style: {
          background: "#656a78",
          color: "white",
          fontFamily: "sans-serif",
        },
      });
      navigate("/login");
      return;
    }

    if (!tallaSeleccionada) {
      toast.error("Por favor selecciona una talla", {
        position: "top-center",
        style: {
          background: "#656a78",
          color: "white",
          fontFamily: "sans-serif",
        },
      });
      return;
    }

    try {
      let idReferencia;

      // Si el producto tiene SKU (producto real), usar la función original
      if (productoSeleccionado.sku) {
        idReferencia = await obtenerIdReferenciaPorProductoYTalla(
          productoSeleccionado.sku,
          tallaSeleccionada
        );
      } else {
        // Para productos falsos, generar un ID de referencia simulado
        idReferencia = `fake-ref-${
          productoSeleccionado.id
        }-${tallaSeleccionada}-${Date.now()}`;
      }

      if (idReferencia === null || idReferencia === undefined) {
        toast.error("Referencia no disponible", {
          position: "top-center",
          style: {
            background: "#656a78",
            color: "white",
            fontFamily: "sans-serif",
          },
        });
        return;
      }

      const userId = localStorage.getItem("id");

      // Para productos falsos, simular la adición al carrito
      if (!productoSeleccionado.sku) {
        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Guardar en localStorage para carrito falso
        const carritoFalso = JSON.parse(
          localStorage.getItem("carritoFalso") || "[]"
        );
        const productoCarrito = {
          carrito_id: `fake-${Date.now()}`,
          id_usuario: userId,
          cantidad: cantidad,
          nombre: productoSeleccionado.nombre,
          caracteristicas: productoSeleccionado.caracteristicas,
          precio: parseFloat(productoSeleccionado.precio.replace(/[.,]/g, "")),
          imagen: productoSeleccionado.imagen,
          referencia_id: idReferencia,
          nombre_talla: tallaSeleccionada,
          producto_id: productoSeleccionado.id,
        };

        // Verificar si ya existe el producto con la misma talla
        const existeProducto = carritoFalso.findIndex(
          (item) =>
            item.producto_id === productoSeleccionado.id &&
            item.nombre_talla === tallaSeleccionada
        );

        if (existeProducto !== -1) {
          // Si existe, aumentar cantidad
          carritoFalso[existeProducto].cantidad += cantidad;
        } else {
          // Si no existe, agregar nuevo
          carritoFalso.push(productoCarrito);
        }

        localStorage.setItem("carritoFalso", JSON.stringify(carritoFalso));

        // Actualizar el contexto del carrito
        actualizarCarrito();

        toast.success("Producto añadido al carrito exitosamente", {
          position: "top-center",
          style: {
            background: "#10b981",
            color: "white",
            fontFamily: "sans-serif",
          },
        });

        cerrarModal();
        return;
      }

      // Para productos reales, usar la API real
      const data = {
        id_usuario: userId,
        id_referencia: idReferencia,
      };

      await axios.post("http://127.0.0.1:3001/agregarProducto", data);

      // Actualizar el contexto del carrito
      actualizarCarrito();

      toast.success("Producto añadido al carrito exitosamente", {
        position: "top-center",
        style: {
          background: "#10b981",
          color: "white",
          fontFamily: "sans-serif",
        },
      });

      cerrarModal();
    } catch (error) {
      console.error(
        "No se pudo añadir el producto al carrito de compras",
        error
      );
      toast.error("Error al añadir el producto al carrito", {
        position: "top-center",
        style: {
          background: "#ef4444",
          color: "white",
          fontFamily: "sans-serif",
        },
      });
    }
  };

  // Función para obtener el ID de referencia basado en el SKU del producto y la talla seleccionada
  const obtenerIdReferenciaPorProductoYTalla = async (
    skuProducto,
    tallaSeleccionada
  ) => {
    try {
      const { data } = await axios.get(
        `http://127.0.0.1:3001/obtenerIdReferencia/${skuProducto}/${tallaSeleccionada}`
      );
      return data.id;
    } catch (error) {
      console.error("Error al obtener el ID de referencia", error);
      return null;
    }
  };

  // Función para buscar productos
  const buscarProductos = (termino) => {
    if (!termino || termino.trim() === "") {
      setProductosEncontrados([]);
      return;
    }

    const terminoLower = termino.toLowerCase();
    const todosLosProductos = [];

    // Recopilar todos los productos de todos los géneros
    Object.values(productosFalsosData).forEach((genero) => {
      todosLosProductos.push(...genero);
    });

    // Filtrar productos que coincidan con el término de búsqueda
    const productosCoincidentes = todosLosProductos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(terminoLower) ||
        producto.categoria.toLowerCase().includes(terminoLower) ||
        producto.caracteristicas.toLowerCase().includes(terminoLower) ||
        producto.genero.toLowerCase().includes(terminoLower) ||
        (producto.colores &&
          producto.colores.some((color) =>
            color.toLowerCase().includes(terminoLower)
          ))
    );

    setProductosEncontrados(productosCoincidentes);
  };

  // Nueva búsqueda desde el componente
  const handleNuevaBusqueda = (e) => {
    e.preventDefault();
    if (terminoBusqueda.trim()) {
      navigate(`/buscar/${encodeURIComponent(terminoBusqueda.trim())}`);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTerminoBusqueda(termino || "");

    // Simular tiempo de carga
    setTimeout(() => {
      buscarProductos(termino);
      setLoading(false);
    }, 800);
  }, [termino]);

  return (
    <div className="buscar-productos-container">
      <div className="header">
        <Header />
      </div>

      <div className="titulo-seccion">
        <h1>Resultados de Búsqueda</h1>
        <p>
          {termino
            ? `Buscando: "${termino}"`
            : "Ingresa un término para buscar"}
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
              ? "Buscando..."
              : productosEncontrados.length > 0
              ? `${productosEncontrados.length} producto${
                  productosEncontrados.length !== 1 ? "s" : ""
                } encontrado${productosEncontrados.length !== 1 ? "s" : ""}`
              : termino
              ? "No se encontraron productos"
              : "Ingresa un término para buscar"}
          </h2>
          {termino && !loading && (
            <p>
              {productosEncontrados.length > 0
                ? "Aquí están los productos que coinciden con tu búsqueda"
                : "Intenta con otros términos de búsqueda"}
            </p>
          )}
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
                          <button className="btn-favorito">
                            <FaHeart />
                          </button>
                          <button className="btn-compartir">
                            <FaShare />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="producto-info">
                      <span className="producto-categoria">
                        {producto.categoria}
                      </span>
                      <h3>{producto.nombre}</h3>
                      <div className="producto-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < Math.floor(producto.rating)
                                ? "star-filled"
                                : "star-empty"
                            }
                          />
                        ))}
                        <span className="rating-text">({producto.rating})</span>
                      </div>
                      <p className="producto-precio">${producto.precio}</p>
                      <button
                        className="btn-ver-detalle"
                        onClick={() => abrirModal(producto)}
                      >
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
                <p>Intenta buscar con otros términos como:</p>
                <div className="sugerencias">
                  <span>camiseta</span>
                  <span>pantalón</span>
                  <span>vestido</span>
                  <span>zapatos</span>
                </div>
              </div>
            ) : (
              <div className="no-productos">
                <FaSearch className="icono-vacio" />
                <h3>¿Qué estás buscando?</h3>
                <p>Usa el buscador para encontrar productos por:</p>
                <div className="sugerencias">
                  <span>Nombre</span>
                  <span>Categoría</span>
                  <span>Color</span>
                  <span>Género</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de producto */}
      {modalAbierto && productoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>
              ×
            </button>

            <div className="modal-imagenes">
              <div className="imagen-principal">
                <img
                  src={JSON.parse(productoSeleccionado.imagen)[imagenActiva]}
                  alt={productoSeleccionado.nombre}
                />
              </div>
            </div>

            <div className="modal-detalles">
              <h2>{productoSeleccionado.nombre}</h2>
              <div className="producto-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.floor(productoSeleccionado.rating)
                        ? "star-filled"
                        : "star-empty"
                    }
                  />
                ))}
                <span className="rating-text">
                  ({productoSeleccionado.rating})
                </span>
              </div>

              <p className="precio-modal">${productoSeleccionado.precio}</p>
              {productoSeleccionado.descuento > 0 && (
                <span className="descuento-badge">
                  {productoSeleccionado.descuento}% OFF
                </span>
              )}

              <p className="descripcion">
                {productoSeleccionado.caracteristicas}
              </p>

              <div className="categoria-info">
                <span>
                  <strong>Categoría:</strong> {productoSeleccionado.categoria}
                </span>
                <span>
                  <strong>Género:</strong> {productoSeleccionado.genero}
                </span>
                <span>
                  <strong>Stock:</strong> {productoSeleccionado.stock}{" "}
                  disponibles
                </span>
              </div>

              <div className="selector-tallas">
                <h4>Seleccionar Talla:</h4>
                <div className="tallas-grid">
                  {productoSeleccionado.tallas?.map((talla) => (
                    <button
                      key={talla}
                      className={`talla-btn ${
                        tallaSeleccionada === talla ? "seleccionada" : ""
                      }`}
                      onClick={() => handleSeleccionarTalla(talla)}
                    >
                      {talla}
                    </button>
                  ))}
                </div>
              </div>

              <div className="colores-disponibles">
                <h4>Colores disponibles:</h4>
                <div className="colores-lista">
                  {productoSeleccionado.colores?.map((color, index) => (
                    <span key={index} className="color-item">
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              <div className="selector-cantidad">
                <h4>Cantidad:</h4>
                <div className="cantidad-controles">
                  <button onClick={() => handleCambiarCantidad("decrementar")}>
                    -
                  </button>
                  <span>{cantidad}</span>
                  <button onClick={() => handleCambiarCantidad("incrementar")}>
                    +
                  </button>
                </div>
              </div>

              <button
                className="btn-añadir-carrito"
                onClick={handleAñadirCarrito}
              >
                Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <Footer />
      </div>
    </div>
  );
};
