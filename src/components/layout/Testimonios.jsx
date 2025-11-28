import React, { useState, useEffect } from "react";
import "../../styles/css/Principal.css";


const testimonios = [
  {
    id: 1,
    nombre: "María González",
    comentario:
      "Excelente calidad y servicio. La ropa llegó perfecta y muy rápido. Definitivamente volveré a comprar.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    ubicacion: "Bogotá, Colombia",
  },
  {
    id: 2,
    nombre: "Carlos Rodríguez",
    comentario:
      "Me encanta la variedad de productos. Siempre encuentro lo que busco y los precios son muy competitivos.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    ubicacion: "Medellín, Colombia",
  },
  {
    id: 3,
    nombre: "Ana Martínez",
    comentario:
      "Precios justos y excelente atención al cliente. El proceso de compra es muy fácil y seguro.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    ubicacion: "Cali, Colombia",
  },
  {
    id: 4,
    nombre: "Luis Fernando",
    comentario:
      "La calidad de las prendas superó mis expectativas. Materiales excelentes y acabados perfectos.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    ubicacion: "Barranquilla, Colombia",
  },
  {
    id: 5,
    nombre: "Sofia Herrera",
    comentario:
      "Increíble experiencia de compra. El envío fue súper rápido y el empaque muy cuidado.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    ubicacion: "Cartagena, Colombia",
  },
  {
    id: 6,
    nombre: "Diego Morales",
    comentario:
      "Excelente relación calidad-precio. Las tallas son exactas y la ropa es muy cómoda.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    ubicacion: "Bucaramanga, Colombia",
  },
];

export const Testimonios = () => {
  const [currentTestimonioIndex, setCurrentTestimonioIndex] = useState(0);


  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ⭐
      </span>
    ));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonioIndex(
        (prevIndex) => (prevIndex + 1) % testimonios.length
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

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
    <div className="testinomios">
        {/* =====================================================
             TESTIMONIOS
        ====================================================== */}
        <section className="testimonios-section">
          <div className="section-header">
            <h2 className="section-title">Lo que dicen nuestros clientes</h2>
            <p className="section-subtitle">
              Experiencias reales de personas reales
            </p>
          </div>

          <div className="testimonios-carousel-container">
            <div className="testimonios-carousel">
              <div
                className="testimonios-track"
                style={{
                  transform: `translateX(-${
                    currentTestimonioIndex * (100 / 3)
                  }%)`,
                  transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "2rem",
                  width: `${testimonios.length * (100 / 3)}%`,
                }}
              >
                {testimonios.map((testimonio) => (
                  <div
                    key={`testimonio-${testimonio.id}`}
                    className="testimonio-card-carousel"
                  >
                    <div>
                      <div className="testimonio-rating">
                        {renderStars(testimonio.rating)}
                      </div>
                      <h3 className="testimonio-title">
                        {testimonio.rating === 5
                          ? "¡Excelente!"
                          : testimonio.rating === 4
                          ? "¡Muy bueno!"
                          : "¡Recomendado!"}
                      </h3>
                      <p className="testimonio-comentario">
                        "{testimonio.comentario}"
                      </p>
                      <div className="testimonio-footer">
                        <img
                          src={testimonio.avatar}
                          alt={testimonio.nombre}
                          className="testimonio-avatar"
                        />
                        <div className="testimonio-info">
                          <h5 className="testimonio-nombre">
                            {testimonio.nombre}
                          </h5>
                          <span className="testimonio-ubicacion">
                            {testimonio.ubicacion}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTROLES */}
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

            {/* INDICADORES */}
            <div className="carousel-indicators">
              {testimonios.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${
                    index === currentTestimonioIndex ? "active" : ""
                  }`}
                  onClick={() => goToTestimonio(index)}
                  aria-label={`Ir al testimonio ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
    </div>
  );
};
