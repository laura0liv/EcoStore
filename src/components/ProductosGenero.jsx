import React, { useEffect, useState } from "react";
import { getProductosGenero } from "../../api/getProductosGenero";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { ProductLoader } from "./layout/ProductLoader";
import { useCarrito } from "../provider/CarritoProvider";
import { FaTshirt, FaStar, FaHeart, FaShare } from "react-icons/fa";
import "../styles/css/ProductosGenero.css";
import productosFalsosData from "../data/productosFalsos.json";
import axios from "axios";
import { toast } from "react-hot-toast";

export const ProductosGenero = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actualizarCarrito } = useCarrito(); // Extraer actualizarCarrito del contexto
  const [productosPorGenero, setProductosPorGenero] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [loading, setLoading] = useState(true);

  // Estados para el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [imagenActiva, setImagenActiva] = useState(0);

  // Tallas disponibles para el modal
  const tallasDisponibles = ["XS", "S", "M", "L", "XL", "XXL"];

  // Títulos dinámicos según el género
  const titulosGenero = {
    1: {
      titulo: "Productos para Hombres",
      subtitulo: "Descubre nuestra colección masculina",
    },
    2: {
      titulo: "Productos para Mujeres",
      subtitulo: "Encuentra tu estilo femenino",
    },
    3: {
      titulo: "Productos para Niños",
      subtitulo: "Ropa cómoda y divertida para los pequeños",
    },
  };

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

  useEffect(() => {
    // Intentar cargar productos reales primero
    const cargarProductos = async () => {
      setLoading(true);
      try {
        await getProductosGenero(id, (productosReales) => {
          if (productosReales && productosReales.length > 0) {
            setProductosPorGenero(productosReales);
            setProductosFiltrados(productosReales);
          } else {
            // Si no hay productos reales, usar productos falsos
            const productosFalsosParaGenero = productosFalsosData[id] || [];
            setProductosPorGenero(productosFalsosParaGenero);
            setProductosFiltrados(productosFalsosParaGenero);
          }
        });
      } catch (error) {
        // Si hay error en la API, usar productos falsos
        console.log(
          "Error al cargar productos de la API, usando productos falsos"
        );
        const productosFalsosParaGenero = productosFalsosData[id] || [];
        setProductosPorGenero(productosFalsosParaGenero);
        setProductosFiltrados(productosFalsosParaGenero);
      } finally {
        // Simular un tiempo mínimo de carga para mostrar el Loading
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    cargarProductos();
  }, [id]);

  // Función para filtrar productos por categoría
  const filtrarPorCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    if (categoria === "todas") {
      setProductosFiltrados(productosPorGenero);
    } else {
      const productosFiltrados = productosPorGenero.filter(
        (producto) =>
          producto.categoria.toLowerCase() === categoria.toLowerCase()
      );
      setProductosFiltrados(productosFiltrados);
    }
  };

  // Obtener categorías únicas
  const obtenerCategoriasUnicas = () => {
    const categorias = [
      ...new Set(productosPorGenero.map((producto) => producto.categoria)),
    ];
    return categorias;
  };

  const generoActual = titulosGenero[id] || {
    titulo: "Productos",
    subtitulo: "Descubre nuestra colección",
  };

  return (
    <div className="productos-genero-container">
      <div className="header">
        <Header />
      </div>

      <div className="titulo-seccion">
        <h1>{generoActual.titulo}</h1>
        <p>{generoActual.subtitulo}</p>
      </div>

      <div className="productos-section">
        <div className="productos-header">
          <h2>
            {categoriaSeleccionada === "todas"
              ? "Todos los Productos"
              : `Productos de ${categoriaSeleccionada}`}
          </h2>
          <p>
            {categoriaSeleccionada === "todas"
              ? "Encuentra el estilo perfecto para ti"
              : `Explora nuestra selección de ${categoriaSeleccionada.toLowerCase()}`}
          </p>

          {/* Filtros integrados debajo del texto */}
          <div className="filtros-inline">
            <div className="filtros-botones">
              <button
                className={`filtro-btn ${
                  categoriaSeleccionada === "todas" ? "activo" : ""
                }`}
                onClick={() => filtrarPorCategoria("todas")}
              >
                Todas las categorías
              </button>
              {obtenerCategoriasUnicas().map((categoria, index) => (
                <button
                  key={index}
                  className={`filtro-btn ${
                    categoriaSeleccionada === categoria ? "activo" : ""
                  }`}
                  onClick={() => filtrarPorCategoria(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <ProductLoader />
        ) : (
          <div className="productos-grid">
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => {
                const imagen = JSON.parse(producto.imagen)[0];
                return (
                  <div
                    key={producto.id}
                    className="producto-card"
                    onClick={() => abrirModal(producto)}
                  >
                    <div className="producto-imagen-container">
                      <img src={imagen} alt={producto.nombre} />
                      <div className="producto-overlay"></div>
                    </div>
                    <div className="producto-info">
                      <h3>{producto.nombre}</h3>
                      <div className="producto-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < 4 ? "star-filled" : "star-empty"}
                          />
                        ))}
                        <span className="rating-text">(4.0)</span>
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
            ) : (
              <div className="no-productos">
                <FaTshirt className="icono-vacio" />
                <h3>No hay productos disponibles</h3>
                <p>Vuelve pronto para ver nuevos productos</p>
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
