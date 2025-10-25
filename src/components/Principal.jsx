import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "./layout/Header";
import "../styles/css/Principal.css";
import { Footer } from "./layout/Footer";
import productosFalsos from "../data/productosFalsos.json";

// Datos estáticos para funcionar sin backend
const generosData = [
  {
    id: 1,
    tipo: "Hombre",
    imagen:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop&crop=face",
  },
  {
    id: 2,
    tipo: "Mujer",
    imagen:
      "https://img.freepik.com/foto-gratis/retrato-joven-mujer-juguetona-disquete-sobre-fondo-gris_231208-3907.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    id: 3,
    tipo: "Niños",
    imagen:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=700&fit=crop&crop=face",
  },
];

// Función para obtener el primer producto de cada categoría
const getProductosDestacados = () => {
  const allProducts = Object.values(productosFalsos).flat();
  const categorias = [...new Set(allProducts.map(p => p.categoria))];
  
  // Mapeo de géneros a números
  const generoToId = {
    'Hombre': 1,
    'Mujer': 2,
    'Niños': 3
  };
  
  return categorias.slice(0, 4).map(categoria => {
    const producto = allProducts.find(p => p.categoria === categoria);
    return {
      id: producto.id,
      nombre: producto.nombre,
      precio: `${producto.precio}`,
      imagen: JSON.parse(producto.imagen)[0],
      descuento: producto.descuento > 0 ? `${producto.descuento}%` : null,
      categoria: producto.categoria,
      genero: generoToId[producto.genero] || 1 // Por defecto género 1 si no se encuentra
    };
  });
};

// Productos destacados dinámicos
const productosDestacados = getProductosDestacados();

// Testimonios expandidos
const testimonios = [
  {
    id: 1,
    nombre: "María González",
    comentario: "Excelente calidad y servicio. La ropa llegó perfecta y muy rápido. Definitivamente volveré a comprar.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    ubicacion: "Bogotá, Colombia"
  },
  {
    id: 2,
    nombre: "Carlos Rodríguez",
    comentario: "Me encanta la variedad de productos. Siempre encuentro lo que busco y los precios son muy competitivos.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    ubicacion: "Medellín, Colombia"
  },
  {
    id: 3,
    nombre: "Ana Martínez",
    comentario: "Precios justos y excelente atención al cliente. El proceso de compra es muy fácil y seguro.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    ubicacion: "Cali, Colombia"
  },
  {
    id: 4,
    nombre: "Luis Fernando",
    comentario: "La calidad de las prendas superó mis expectativas. Materiales excelentes y acabados perfectos.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    ubicacion: "Barranquilla, Colombia"
  },
  {
    id: 5,
    nombre: "Sofia Herrera",
    comentario: "Increíble experiencia de compra. El envío fue súper rápido y el empaque muy cuidado.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    ubicacion: "Cartagena, Colombia"
  },
  {
    id: 6,
    nombre: "Diego Morales",
    comentario: "Excelente relación calidad-precio. Las tallas son exactas y la ropa es muy cómoda.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    ubicacion: "Bucaramanga, Colombia"
  }
];

export const Principal = () => {
  const [generos] = useState(generosData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTestimonioIndex, setCurrentTestimonioIndex] = useState(0);

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Aquí podrías implementar lógica de búsqueda si es necesario
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  // Auto-slide cada 3 segundos para scroll infinito
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonioIndex((prevIndex) => 
        (prevIndex + 1) % testimonios.length
      );
    }, 10000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, [testimonios.length]);

  const nextTestimonio = () => {
    setCurrentTestimonioIndex((prevIndex) => 
      prevIndex >= testimonios.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonio = () => {
    setCurrentTestimonioIndex((prevIndex) => 
      prevIndex <= 0 ? testimonios.length - 3 : prevIndex - 1
    );
  };

  const goToTestimonio = (index) => {
    setCurrentTestimonioIndex(index);
  };

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
                <Link to="/productos/genero/1" className="btn-primary">
                  Ver Colección
                </Link>
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
            {generos.map((genero) => (
              <Link
                className="genero-card-link"
                to={`/productos/genero/${genero.id}`}
                key={genero.id}
              >
                <div className="genero-card">
                  <div className="imagen-container">
                    <img
                      src={genero.imagen}
                      alt={`Ropa para ${genero.tipo}`}
                      loading="lazy"
                    />
                    <div className="overlay">
                      <span className="cta-text">Ver Colección</span>
                      <div className="arrow-icon">→</div>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3>{genero.tipo}</h3>
                    <p className="card-description">Descubre nuestra colección</p>
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
              <div key={producto.id} className="producto-card">
                <div className="producto-imagen-container">
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    loading="lazy"
                  />
                  {producto.descuento && (
                    <div className="descuento-badge">-{producto.descuento}</div>
                  )}
                  <div className="producto-overlay">
                    <Link 
                      to={`/productos/genero/${producto.genero}`} 
                      className="btn-quick-view"
                    >
                      Vista Rápida
                    </Link>
                  </div>
                </div>
                <div className="producto-info">
                  <span className="producto-categoria">{producto.categoria}</span>
                  <h4 className="producto-nombre">{producto.nombre}</h4>
                  <div className="producto-precio">
                    <span className="precio-actual">{producto.precio}</span>
                  </div>
                  <Link 
                    to={`/productos/genero/${producto.genero}`} 
                    className="btn-add-cart"
                  >
                    Ver Producto
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nueva Sección: Testimonios con Carrusel Grid Infinito */}
        <section className="testimonios-section">
          <div className="section-header">
            <h2 className="section-title">Lo que dicen nuestros clientes</h2>
            <p className="section-subtitle">Experiencias reales de personas reales</p>
          </div>
          
          <div className="testimonios-carousel-container">
            <div className="testimonios-carousel">
              <div 
              className="testimonios-track"
              style={{
                transform: `translateX(-${currentTestimonioIndex * (100 / 3)}%)`,
                transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                width: `${testimonios.length * (100 / 3)}%`
              }}
            >
              {testimonios.map((testimonio, index) => (
                <div key={`testimonio-${testimonio.id}`} className="testimonio-card-carousel">
                  <div>
                    <div className="testimonio-rating">
                      {renderStars(testimonio.rating)}
                    </div>
                    <h3 className="testimonio-title">
                      {testimonio.rating === 5 ? '¡Excelente!' : 
                       testimonio.rating === 4 ? '¡Muy bueno!' : 
                       '¡Recomendado!'}
                    </h3>
                    <p className="testimonio-comentario">"{testimonio.comentario}"</p>
                    <div className="testimonio-footer">
                      <img 
                        src={testimonio.avatar} 
                        alt={testimonio.nombre}
                        className="testimonio-avatar"
                      />
                      <div className="testimonio-info">
                        <h5 className="testimonio-nombre">{testimonio.nombre}</h5>
                        <span className="testimonio-ubicacion">{testimonio.ubicacion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
            
            {/* Controles del carrusel */}
            <div className="carousel-controls">
              <button 
                className="carousel-btn prev-btn" 
                onClick={prevTestimonio}
                aria-label="Testimonio anterior"
              >
                ‹
              </button>
              <button 
                className="carousel-btn next-btn" 
                onClick={nextTestimonio}
                aria-label="Siguiente testimonio"
              >
                ›
              </button>
            </div>
            
            {/* Indicadores */}
            <div className="carousel-indicators">
              {testimonios.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTestimonioIndex ? 'active' : ''}`}
                  onClick={() => goToTestimonio(index)}
                  aria-label={`Ir al testimonio ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

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
