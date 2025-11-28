import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart } from 'react-icons/fa'
import '../../styles/css/Footer.css'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Sección principal del footer */}
        <div className="footer-content">
          {/* Información de la empresa */}
          <div className="footer-section company-info">
            <div className="logo-section">
              <h3 className="company-name">Eco Store</h3>
              <p className="company-tagline">Moda sostenible para toda la familia</p>
            </div>
            <p className="company-description">
              Descubre nuestra colección de ropa eco-friendly, diseñada con amor y 
              respeto por el medio ambiente. Calidad, estilo y sostenibilidad en cada prenda.
            </p>
            <div className="social-media">
              <h4>Síguenos</h4>
              <div className="social-links">
                <a href="#" className="social-link facebook" aria-label="Facebook">
                  <FaFacebook />
                </a>
                <a href="#" className="social-link instagram" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="#" className="social-link twitter" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="#" className="social-link whatsapp" aria-label="WhatsApp">
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="footer-section quick-links">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to={"/productos/categoria/men's%20clothing"}>MEN'S</Link></li>
              <li><Link to={"/productos/categoria/women's%20clothing"}>WOMEN'S</Link></li>
              <li><Link to='/productos/categoria/jewelery'>JEWELERY</Link></li>
              <li><Link to='/productos/categoria/electronics'>ELECTRONICS</Link></li>
              <li><Link to="/ofertas">Ofertas</Link></li>
              <li><Link to="/nuevos">Nuevos Productos</Link></li>
            </ul>
          </div>

          {/* Atención al cliente */}
          <div className="footer-section customer-service">
            <h4>Atención al Cliente</h4>
            <ul>
              <li><Link to="/ayuda">Centro de Ayuda</Link></li>
              <li><Link to="/envios">Información de Envíos</Link></li>
              <li><Link to="/devoluciones">Devoluciones</Link></li>
              <li><Link to="/tallas">Guía de Tallas</Link></li>
              <li><Link to="/cuidado">Cuidado de Prendas</Link></li>
              <li><Link to="/contacto">Contáctanos</Link></li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div className="footer-section contact-info">
            <h4>Contáctanos</h4>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div>
                <p>Calle 123 #45-67</p>
                <p>Barranquilla, Colombia</p>
              </div>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div>
                <p>+57 300 123 4567</p>
                <p>Lun - Vie: 8:00 AM - 6:00 PM</p>
              </div>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div>
                <p>info@ecostore.com</p>
                <p>soporte@ecostore.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h4>¡Mantente al día!</h4>
              <p>Suscríbete a nuestro newsletter y recibe ofertas exclusivas, nuevos productos y tips de moda sostenible.</p>
            </div>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="newsletter-input"
              />
              <button className="newsletter-button">Suscribirse</button>
            </div>
          </div>
        </div>

        {/* Información legal y certificaciones */}
        <div className="footer-bottom">
          <div className="legal-info">
            <div className="legal-links">
              <Link to="/privacidad">Política de Privacidad</Link>
              <Link to="/terminos">Términos y Condiciones</Link>
              <Link to="/cookies">Política de Cookies</Link>
            </div>
            <div className="certifications">
              <span className="cert-badge">🌱 Eco-Friendly</span>
              <span className="cert-badge">♻️ Reciclable</span>
              <span className="cert-badge">🏷️ Comercio Justo</span>
            </div>
          </div>
          
          <div className="copyright">
            <p>
              © {currentYear}EcoStore. Hecho con <FaHeart className="heart-icon" /> en Colombia.
            </p>
            <p className="eco-message">
              Comprometidos con un futuro más verde 🌍
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}