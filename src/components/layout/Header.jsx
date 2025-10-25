// Header.js
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
  FaChild,
  FaTags,
  FaHeart
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Carrito } from '../Carrito';
import { useCarrito } from '../../provider/CarritoProvider';
import productosFalsos from '../../data/productosFalsos.json';
import '../../styles/css/Header.css';

export const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  // Usar el contexto del carrito
  const { contadorCarrito } = useCarrito();

  // Obtener todos los productos para las sugerencias
  const getAllProducts = () => {
    const allProducts = [];
    Object.values(productosFalsos).forEach(categoryProducts => {
      if (Array.isArray(categoryProducts)) {
        allProducts.push(...categoryProducts);
      }
    });
    return allProducts;
  };

  // Filtrar productos para sugerencias
  const filterSuggestions = (term) => {
    if (!term.trim()) return [];
    
    const allProducts = getAllProducts();
    const filtered = allProducts.filter(product => 
      product.nombre.toLowerCase().includes(term.toLowerCase()) ||
      product.categoria.toLowerCase().includes(term.toLowerCase()) ||
      product.genero.toLowerCase().includes(term.toLowerCase())
    );
    
    return filtered.slice(0, 5); // Máximo 5 sugerencias
  };

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length > 0) {
      const filteredSuggestions = filterSuggestions(value);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Manejar clic en sugerencia
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.nombre);
    setShowSuggestions(false);
    navigate(`/buscar/${encodeURIComponent(suggestion.nombre)}`);
  };

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    setIsLoggedIn(false);
    navigate('/');
  };

  const toggleCarrito = () => {
    setMostrarCarrito(!mostrarCarrito);
  };

  const cerrarCarrito = () => {
    setMostrarCarrito(false);
  };

  const toggleMenuMovil = () => {
    setMenuMovilAbierto(!menuMovilAbierto);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/buscar/${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleSearchIconClick = () => {
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/buscar/${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <header className='navbar'>
      <div className='navbar-container'>
        {/* Logo */}
        <div className='navbar-brand' onClick={(e) => e.stopPropagation()}>
          <Link to='/' className='brand-link'>
            <h2 className='brand-text'>EcoStore</h2>
            <span className='brand-subtitle'>Store</span>
          </Link>
        </div>

        {/* Navegación principal - Desktop */}
        <nav className='navbar-nav' onClick={(e) => e.stopPropagation()}>
          <Link to='/productos/genero/1' className='nav-link'>
            <span>Hombre</span>
          </Link>
          <Link to='/productos/genero/2' className='nav-link'>
            <span>Mujer</span>
          </Link>
          <Link to='/productos/genero/3' className='nav-link'>
            <span>Niños</span>
          </Link>
        </nav>

        {/* Buscador */}
        <div className='search-form-container' ref={searchRef} onClick={(e) => e.stopPropagation()}>
          <form className='search-form' onSubmit={handleSearch}>
            <div className="search-container">
              <FaSearch 
                className='search-icon' 
                onClick={handleSearchIconClick}
                style={{ cursor: 'pointer' }}
              />
              <input
                type="text"
                placeholder="Buscar productos..."
                className='search-input'
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm.trim() && setShowSuggestions(suggestions.length > 0)}
              />
              <button 
                type="button" 
                className="search-button"
                onClick={handleSearchIconClick}
                title="Ir a página de búsqueda"
              >
                Buscar
              </button>
            </div>
          </form>
          
          {/* Sugerencias */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions" ref={suggestionsRef}>
              {suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.id}-${index}`}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="suggestion-image">
                    <img 
                      src={JSON.parse(suggestion.imagen)[0]} 
                      alt={suggestion.nombre}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                      }}
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

        {/* Iconos de usuario y carrito */}
        <div className='navbar-actions' onClick={(e) => e.stopPropagation()}>
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
              {contadorCarrito > 0 && (
                <span className='cart-badge'>{contadorCarrito}</span>
              )}
            </button>
          </div>
        </div>

        {/* Botón menú móvil */}
        <button className='mobile-menu-toggle' onClick={toggleMenuMovil}>
          {menuMovilAbierto ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Carrito Sidebar */}
      <Carrito onCerrarCarrito={toggleCarrito} mostrarCarrito={mostrarCarrito} />

      {/* Menú móvil */}
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
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown mobile-suggestions">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => {
                        handleSuggestionClick(suggestion);
                        toggleMenuMovil();
                      }}
                    >
                      <div className="suggestion-image">
                        <img 
                          src={JSON.parse(suggestion.imagen)[0]} 
                          alt={suggestion.nombre}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="suggestion-content">
                        <span className="suggestion-name">{suggestion.nombre}</span>
                        <span className="suggestion-category">{suggestion.categoria}</span>
                      </div>
                      <span className="suggestion-price">${suggestion.precio}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>
        
        <nav className='mobile-nav'>
          <Link to='/productos/genero/1' className='mobile-nav-link' onClick={toggleMenuMovil}>
            <FaMale className='mobile-nav-icon' />
            Hombre
          </Link>
          <Link to='/productos/genero/2' className='mobile-nav-link' onClick={toggleMenuMovil}>
            <FaFemale className='mobile-nav-icon' />
            Mujer
          </Link>
          <Link to='/productos/genero/3' className='mobile-nav-link' onClick={toggleMenuMovil}>
            <FaChild className='mobile-nav-icon' />
            Niños
          </Link>
          <Link to='/buscar' className='mobile-nav-link' onClick={toggleMenuMovil}>
            <FaSearch className='mobile-nav-icon' />
            Buscar
          </Link>
        </nav>

        <div className='mobile-actions'>
          {isLoggedIn ? (
            <Link className='mobile-action-link' to='/' onClick={handleLogout}>
              <FaSignOutAlt />
              Cerrar sesión
            </Link>
          ) : (
            <Link className='mobile-action-link' to='/login' onClick={toggleMenuMovil}>
              <FaSignInAlt />
              Iniciar sesión
            </Link>
          )}
          
          <button className='mobile-action-link' onClick={() => {
            toggleCarrito();
            toggleMenuMovil();
          }}>
            <FaShoppingCart />
            Carrito
            {contadorCarrito > 0 && (
              <span className='cart-badge'>{contadorCarrito}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
