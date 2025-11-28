import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { ProductLoader } from "./layout/ProductLoader";
import { useCarrito } from "../provider/CarritoProvider";
import { FaTshirt } from "react-icons/fa";
import "../styles/css/ProductosCategoria.css";
import { toast } from "react-hot-toast";

export const ProductosCategoria = () => {
  const { id, categoria } = useParams();
  const navigate = useNavigate();
  const { actualizarCarrito, verProductosCarrito, setVerProductosCarrito } = useCarrito();

  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const tallasDisponibles = ["XS", "S", "M", "L", "XL"];

  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
    setTallaSeleccionada("");
    setCantidad(1);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
    setTallaSeleccionada("");
    setCantidad(1);
  };

  const handleSeleccionarTalla = (talla) => {
    setTallaSeleccionada(talla);
  };

  const handleCambiarCantidad = (operacion) => {
    if (operacion === "incrementar") setCantidad((prev) => prev + 1);
    else if (operacion === "decrementar" && cantidad > 1) setCantidad((prev) => prev - 1);
  };

  const handleAñadirCarrito = () => {
    // Validar talla
    if (!tallaSeleccionada) {
      toast.error("Por favor selecciona una talla", { position: "top-center" });
      return;
    }

    const isLoggedIn = !!localStorage.getItem("token");

    // USUARIO LOGUEADO → lógica para backend (mantiene compatibilidad)
    if (isLoggedIn) {
      const userId = localStorage.getItem("id");
      const carrito = JSON.parse(localStorage.getItem("carritoFalso") || "[]");

      const productoCarrito = {
        carrito_id: `fake-${Date.now()}`,
        id_usuario: userId,
        cantidad,
        nombre: productoSeleccionado.title,
        precio: productoSeleccionado.price,
        imagen: productoSeleccionado.image,
        nombre_talla: tallaSeleccionada,
        producto_id: productoSeleccionado.id,
      };

      const existeIndex = carrito.findIndex(
        (item) => item.producto_id === productoSeleccionado.id && item.nombre_talla === tallaSeleccionada
      );

      if (existeIndex !== -1) {
        carrito[existeIndex].cantidad += cantidad;
      } else {
        carrito.push(productoCarrito);
      }

      localStorage.setItem("carritoFalso", JSON.stringify(carrito));
      setVerProductosCarrito(carrito); // Sincroniza con Context
      actualizarCarrito();
      toast.success("¡Agregado al carrito!", { position: "top-center" });
      cerrarModal();
      return;
    }

    // USUARIO NO LOGUEADO → usa Context + localStorage
    const productoParaCarrito = {
      ...productoSeleccionado,
      carrito_id: Date.now() + Math.random(), // ID único
      cantidad,
      nombre_talla: tallaSeleccionada,
      title: productoSeleccionado.title,
      price: productoSeleccionado.price,
      image: productoSeleccionado.image,
    };

    const existe = verProductosCarrito.findIndex(
      (p) => p.id === productoSeleccionado.id && p.nombre_talla === tallaSeleccionada
    );

    let nuevoCarrito;
    if (existe !== -1) {
      nuevoCarrito = verProductosCarrito.map((p, i) =>
        i === existe ? { ...p, cantidad: p.cantidad + cantidad } : p
      );
    } else {
      nuevoCarrito = [...verProductosCarrito, productoParaCarrito];
    }

    setVerProductosCarrito(nuevoCarrito); // Actualiza Context → se guarda automáticamente
    toast.success("¡Agregado al carrito!", { position: "top-center" });
    cerrarModal();
  };

  const filtrarPorCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setProductosFiltrados(productos.filter((p) => p.category === categoria));
  };

  // Cargar categorías únicas
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        const categoriasUnicas = [...new Set(data.map((p) => p.category))];
        setCategorias(categoriasUnicas);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  // Cargar productos filtrados por categoría
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();

        if (!categoria) {
          setProductos([]);
          setProductosFiltrados([]);
          setLoading(false);
          return;
        }

        const filtrados = data.filter(
          (p) => p.category && p.category.toLowerCase() === categoria.toLowerCase()
        );

        setProductos(data);
        setProductosFiltrados(filtrados);
        setCategoriaSeleccionada(categoria);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [categoria]);

  return (
    <div className="productos-genero-container">
      <Header />

      <div className="titulo-seccion">
        <h1>{categoriaSeleccionada || "Productos"}</h1>
        <p>Explora los mejores productos de esta categoría</p>
      </div>

      <div className="productos-section">
        <div className="productos-header">
          <div className="filtros-inline">
            {categorias.map((cat, i) => (
              <button
                key={i}
                className={`filtro-btn ${categoriaSeleccionada === cat ? "activo" : ""}`}
                onClick={() => filtrarPorCategoria(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <ProductLoader />
        ) : (
          <div className="productos-grid">
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <div key={producto.id} className="producto-card" onClick={() => abrirModal(producto)}>
                  <div className="producto-imagen-container">
                    <img src={producto.image} alt={producto.title} />
                  </div>
                  <div className="producto-info">
                    <h3>{producto.title}</h3>
                    <p className="producto-precio">${producto.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-productos">
                <FaTshirt className="icono-vacio" />
                <h3>No hay productos disponibles</h3>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalAbierto && productoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="modal-cerrar" onClick={cerrarModal}>
              ×
            </button>

            <div className="modal-imagenes">
              <img src={productoSeleccionado.image} alt={productoSeleccionado.title} />
            </div>

            <div className="modal-detalles">
              <h2>{productoSeleccionado.title}</h2>
              <p>{productoSeleccionado.description}</p>
              <p className="precio-modal">${productoSeleccionado.price}</p>

              <div className="selector-tallas">
                <h4>Seleccionar Talla:</h4>
                <div className="tallas-grid">
                  {tallasDisponibles.map((talla) => (
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