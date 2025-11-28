// Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  FaShoppingCart, 
  FaSearch, 
  FaBars, 
  FaTimes,
  FaSignOutAlt,
  FaSignInAlt,
  FaMale,
  FaFemale,
  FaHeart
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Carrito } from '../Carrito';
import { useCarrito } from '../../provider/CarritoProvider';
import axios from 'axios';
import '../../styles/css/Header.css';

export const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const searchRef = useRef(null);
  const { contadorCarrito } = useCarrito();

  // Cargar productos desde Fake Store API
  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(res => {
        setAllProducts(res.data.map(p => ({
          id: p.id,
          nombre: p.title,
          precio: p.price.toFixed(2),
          imagen: JSON.stringify([p.image]),
          categoria: p.category,
          genero: p.category.includes("men") ? "Hombre" : 
                 p.category.includes("women") ? "Mujer" : "Unisex",
        })));
      })
      .catch(err => console.error("Error cargando productos:", err));
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      const filtered = allProducts
        .filter(p => 
          p.nombre.toLowerCase().includes(value.toLowerCase()) ||
          p.categoria.toLowerCase().includes(value.toLowerCase()) ||
          p.genero.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.nombre);
    setShowSuggestions(false);
    navigate(`/buscar/${encodeURIComponent(product.nombre)}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    setIsLoggedIn(false);
    navigate('/');
  };

  const toggleCarrito = () => setMostrarCarrito(!mostrarCarrito);
  const toggleMenuMovil = () => setMenuMovilAbierto(!menuMovilAbierto);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar/${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleSearchIconClick = () => {
    if (searchTerm.trim()) {
      navigate(`/buscar/${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  return (
    <header className='navbar'>
      <div className='navbar-container'>

        {/* Logo */}
        <div className='navbar-brand'>
          <Link to='/' className='brand-link'>
            <h2 className='brand-text'>EcoStore</h2>
            <span className='brand-subtitle'>Store</span>
          </Link>
        </div>

        {/* Navegación Desktop - CORREGIDO: navbar-nav, no mobile-nav */}
        <nav className='navbar-nav'>
          <Link to="/productos/categoria/men's clothing" className='nav-link'>
            <span>MEN'S</span>
          </Link>
          <Link to="/productos/categoria/women's clothing" className='nav-link'>
            <span>WOMEN'S</span>
          </Link>
          <Link to='/productos/categoria/jewelery' className='nav-link'>
            <span>JEWELERY</span>
          </Link>
          <Link to='/productos/categoria/electronics' className='nav-link'>
            <span>ELECTRONICS</span>
          </Link>
        </nav>

        {/* Buscador */}
        <div className='search-form-container' ref={searchRef}>
          <form className='search-form' onSubmit={handleSearch}>
            <div className="search-container">
              <FaSearch className='search-icon' onClick={handleSearchIconClick} style={{cursor: 'pointer'}} />
              <input
                type="text"
                placeholder="Buscar productos..."
                className='search-input'
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button type="button" className="search-button" onClick={handleSearchIconClick}>
                Buscar
              </button>
            </div>
          </form>

          {/* Sugerencias */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="suggestion-image">
                    <img 
                      src={JSON.parse(suggestion.imagen)[0]} 
                      alt={suggestion.nombre}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                    />
                  </div>
                  <div className="suggestion-content">
                    <span className="suggestion-name">{suggestion.nombre}</span>
                    <span className="suggestion-category">{suggestion.categoria} - {suggestion.genero}</span>
                  </div>
                  <span className="suggestion-price">${suggestion.precio}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usuario y carrito */}
        <div className='navbar-actions'>
          {isLoggedIn ? (
            <div className='action-item user-menu'>
              <Link className='action-link' to='/' onClick={handleLogout}>
                <FaSignOutAlt className='action-icon' />
                <span className='action-text'>Cerrar sesión</span>
              </Link>
            </div>
          ) : (
            <div className='action-item user-menu'>
              <Link className='action-link' to='/login'>
                <FaSignInAlt className='action-icon' />
                <span className='action-text'>Iniciar sesión</span>
              </Link>
            </div>
          )}
         
          <div className='action-item cart-menu'>
            <button className='action-button' onClick={toggleCarrito}>
              <FaShoppingCart className='action-icon' />
              <span className='action-text'>Carrito</span>
              {contadorCarrito > 0 && <span className='cart-badge'>{contadorCarrito}</span>}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <button className='mobile-menu-toggle' onClick={toggleMenuMovil}>
          {menuMovilAbierto ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <Carrito mostrarCarrito={mostrarCarrito} onCerrarCarrito={toggleCarrito} />

      {/* Menú móvil completo */}
      <div className={`mobile-menu ${menuMovilAbierto ? 'mobile-menu-open' : ''}`}>
        <div className='mobile-search'>
          <form onSubmit={handleSearch}>
            <div className="search-container">
              <FaSearch className='search-icon' />
              <input
                type="text"
                placeholder="Buscar productos..."
                className='search-input'
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </form>
        </div>
        
        <nav className='mobile-nav'>
          <Link to="/productos/categoria/men's clothing" className='mobile-nav-link' onClick={toggleMenuMovil}>
            <FaMale className='mobile-nav-icon' />
            Hombre
          </Link>
          <Link to="/productos/categoria/women's clothing" className='mobile-nav-link' onClick={toggleMenuMovil}>
            <FaFemale className='mobile-nav-icon' />
            Mujer
          </Link>
          <Link to='/productos/categoria/jewelery' className='mobile-nav-link' onClick={toggleMenuMovil}>
            Joyería
          </Link>
          <Link to='/productos/categoria/electronics' className='mobile-nav-link' onClick={toggleMenuMovil}>
            Electrónica
          </Link>
        </nav>

        <div className='mobile-actions'>
          {isLoggedIn ? (
            <Link className='mobile-action-link' to='/' onClick={handleLogout}>
              <FaSignOutAlt /> Cerrar sesión
            </Link>
          ) : (
            <Link className='mobile-action-link' to='/login' onClick={toggleMenuMovil}>
              <FaSignInAlt /> Iniciar sesión
            </Link>
          )}
          
          <button className='mobile-action-link' onClick={() => { toggleCarrito(); toggleMenuMovil(); }}>
            <FaShoppingCart /> Carrito
            {contadorCarrito > 0 && <span className='cart-badge'>{contadorCarrito}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};