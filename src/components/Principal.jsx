import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "./layout/Header";
import "../styles/css/Principal.css";
import { Footer } from "./layout/Footer";
import {Testimonios} from "./layout/Testimonios"
import productosFalsos from "../data/productosFalsos.json";



export const Principal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Aquí podrías implementar lógica de búsqueda si es necesario
  };

    // 🔥 Cargar productos desde Fake Store API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();

        // Filtrar solo categorías que contengan la palabra "clothing"
        const productosClothing = data.filter((item) =>
          item.category.toLowerCase().includes("clothing")
        )
        .slice(0,4);

        setProductosDestacados(productosClothing);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    fetchProductos();
  }, []);

    useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();

        const categoriasMap = {};

        data.forEach((prod) => {
          if (!categoriasMap[prod.category]) {
            categoriasMap[prod.category] = prod.image; // guardar la primera imagen
          }
        });

        // Convertir en arreglo
      const categoriasConImagen = Object.entries(categoriasMap).map(([cat, img]) => ({
          category: cat,
          image: img,
        }));

      setCategorias(categoriasConImagen);

      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };

    fetchCategorias();
  }, []);


  return (
    <div className="pag-principal">
      <div className="header-container">
        <Header onSearch={handleSearch} />
      </div>

      <main className="main-content">
        {/* Hero Section Mejorada */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Descubre tu <span className="highlight">Estilo Único</span>
              </h1>
              <p className="hero-subtitle">
                Moda de calidad para toda la familia. Encuentra las últimas tendencias 
                con los mejores precios y envío gratis.
              </p>
              <div className="hero-buttons">
                <Link to="/buscar" className="btn-secondary">
                  Buscar Productos
                </Link>
              </div>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Clientes Felices</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Productos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Soporte</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop" 
              alt="Moda LauEco" 
              loading="lazy"
            />
          </div>
        </section>
        <section className="generos-section">
          <div className="section-header">
            <h2 className="section-title">Compra por Categoría</h2>
            <p className="section-subtitle">Encuentra exactamente lo que buscas</p>
          </div>
          <div className="generos-grid">
            {categorias.map((catObj, idx) => (
              <Link
                key={idx}
                to={`/productos/categoria/${catObj.category}`}
                className="genero-card-link"
              >
                <div className="genero-card">

                  {/* Imagen tomada directamente de un producto real */}
                  <div className="imagen-container">
                    <img src={catObj.image} alt={catObj.category} loading="lazy" />
                    <div className="overlay">
                      <span className="cta-text">Ver {catObj.category}</span>
                      <div className="arrow-icon">→</div>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3>{catObj.category.toUpperCase()}</h3>
                    <p className="card-description">
                      Descubre nuestra colección de {catObj.category}
                    </p>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Nueva Sección: Productos Destacados */}
        <section className="productos-destacados-section">
          <div className="section-header">
            <h2 className="section-title">Productos Destacados</h2>
            <p className="section-subtitle">Los más vendidos de la temporada</p>
          </div>
          <div className="productos-grid">
             {productosDestacados.map((producto) => ( 
              <div  key={producto.id}  className="producto-card">
                <div className="producto-imagen-container">
                 <img src={producto.image} 
                      alt={producto.title}
                      loading="lazy"
                  /> 
              
                  <div className="producto-overlay">
                    <Link  to={`/productos/categoria/${producto.category}`} className="btn-quick-view"> Vista Rápida </Link>
                  </div>
                </div>
                <div className="producto-info">
                  <span className="producto-categoria"> {producto.category}</span>
                  <h4 className="producto-nombre">  {producto.title} </h4>
                  <div className="producto-precio">
                    <span className="precio-actual">{producto.price}</span>
                  </div>
                  <Link  to={`/productos/categoria/${producto.category}`} className="btn-add-cart"> Ver Producto </Link>
                </div>
              </div>
            ))} 
          </div>
        </section>

        <Testimonios/>

        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">¿Por qué elegir EcoStore?</h2>
            <p className="section-subtitle">Beneficios que nos hacen únicos</p>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon-container">
                <div className="feature-icon">🚚</div>
              </div>
              <div className="feature-content">
                <div className="feature-text">
                  <h4>Envío Gratis</h4>
                  <p>En compras mayores a $50.000</p>
                  <span className="feature-detail">Entrega en 2-3 días hábiles</span>
                </div>
                <div className="feature-stats">
                  <span className="stat-highlight">98%</span>
                  <span className="stat-text">Entregas a tiempo</span>
                </div>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-container">
                <div className="feature-icon">🔄</div>
              </div>
              <div className="feature-content">
                <div className="feature-text">
                  <h4>Devoluciones</h4>
                  <p>30 días para cambios y devoluciones</p>
                  <span className="feature-detail">Sin preguntas, sin complicaciones</span>
                </div>
                <div className="feature-stats">
                  <span className="stat-highlight">100%</span>
                  <span className="stat-text">Garantía de satisfacción</span>
                </div>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-container">
                <div className="feature-icon">💳</div>
              </div>
              <div className="feature-content">
                <div className="feature-text">
                  <h4>Pago Seguro</h4>
                  <p>Múltiples métodos de pago</p>
                  <span className="feature-detail">Protección SSL garantizada</span>
                </div>
                <div className="feature-stats">
                  <span className="stat-highlight">256-bit</span>
                  <span className="stat-text">Encriptación SSL</span>
                </div>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-container">
                <div className="feature-icon">📞</div>
              </div>
              <div className="feature-content">
                <div className="feature-text">
                  <h4>Soporte 24/7</h4>
                  <p>Atención al cliente siempre disponible</p>
                  <span className="feature-detail">Chat en vivo y WhatsApp</span>
                </div>
                <div className="feature-stats">
                  <span className="stat-highlight">&lt;2min</span>
                  <span className="stat-text">Tiempo de respuesta</span>
                </div>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-container">
                <div className="feature-icon">🌱</div>
              </div>
              <div className="feature-content">
                <div className="feature-text">
                  <h4>Eco-Friendly</h4>
                  <p>Materiales sostenibles y reciclables</p>
                  <span className="feature-detail">Compromiso con el medio ambiente</span>
                </div>
                <div className="feature-stats">
                  <span className="stat-highlight">100%</span>
                  <span className="stat-text">Empaques reciclables</span>
                </div>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-container">
                <div className="feature-icon">⭐</div>
              </div>
              <div className="feature-content">
                <div className="feature-text">
                  <h4>Calidad Premium</h4>
                  <p>Productos seleccionados cuidadosamente</p>
                  <span className="feature-detail">Control de calidad riguroso</span>
                </div>
                <div className="feature-stats">
                  <span className="stat-highlight">4.9/5</span>
                  <span className="stat-text">Calificación promedio</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
      </main>

      <div>
        <Footer />
      </div>
    </div>
  );
};
