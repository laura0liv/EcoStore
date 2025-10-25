import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { FaStore, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import '../../styles/css/Login.css';

// Cuentas fake para el sistema de login
const fakeAccounts = [
  {
    id: 1,
    email: 'admin@ecostore.com',
    password: 'admin123',
    nombre: 'Administrador',
    apellido: 'LauEco',
    id_rol: 1 // Admin
  },
  {
    id: 2,
    email: 'usuario@ecostore.com',
    password: 'usuario123',
    nombre: 'Usuario',
    apellido: 'Cliente',
    id_rol: 2 // Cliente
  },
  {
    id: 3,
    email: 'maria@gmail.com',
    password: '123456',
    nombre: 'María',
    apellido: 'García',
    id_rol: 2 // Cliente
  },
  {
    id: 4,
    email: 'juan@gmail.com',
    password: '123456',
    nombre: 'Juan',
    apellido: 'Pérez',
    id_rol: 2 // Cliente
  },
  {
    id: 5,
    email: 'ana@hotmail.com',
    password: 'ana2024',
    nombre: 'Ana',
    apellido: 'López',
    id_rol: 2 // Cliente
  }
];

export const Login = () => {
  const navigate = useNavigate();
  const [autenticacion, setAutenticacion] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAutenticacion({ ...autenticacion, [name]: value });
  };

  const validate = () => {
    if (!autenticacion.email || !autenticacion.password) {
      toast.error('Debe ingresar Email y Contraseña', {
        position: 'top-center',
        style: {
          background: '#656a78',
          color: 'white',
          fontFamily: 'sans-serif'
        }
      });
      return false;
    }

    return true;
  };

  const logueo = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      
      // Simular delay de autenticación
      setTimeout(() => {
        // Buscar usuario en las cuentas fake
        const usuario = fakeAccounts.find(
          account => account.email === autenticacion.email && account.password === autenticacion.password
        );

        if (usuario) {
          // Crear un token fake (solo para simular)
          const fakeToken = `fake-jwt-token-${usuario.id}-${Date.now()}`;
          
          // Guardar datos en localStorage
          localStorage.setItem('token', fakeToken);
          localStorage.setItem('id', usuario.id.toString());
          localStorage.setItem('role', usuario.id_rol.toString());

          toast.success(`¡Bienvenido ${usuario.nombre}!`, {
            position: 'top-center',
            style: {
              background: '#667eea',
              color: 'white',
              fontFamily: 'Arial, sans-serif'
            }
          });

          // Redirigir según el rol
          if (usuario.id_rol === 2) {
            navigate('/');
          } else if (usuario.id_rol === 1) {
            navigate('/admin');
          }
        } else {
          toast.error('Credenciales incorrectas', {
            position: 'top-center',
            style: {
              background: '#e74c3c',
              color: 'white',
              fontFamily: 'Arial, sans-serif'
            }
          });
        }
        
        setIsLoading(false);
      }, 1000); // Simular 1 segundo de carga
    }
  };

      
    

  return (
    <div className="login-container">
      {/* Sección izquierda - Logo y branding */}
      <div className="login-left">
        <Link to="/" className="back-to-store">
          <FaArrowLeft />
          <span>Volver a la tienda</span>
        </Link>
        <div className="brand-section">
          <div className="brand-logo">
            <FaStore className="logo-icon" />
            <div className="brand-content">
              <h1 className="brand-title">Eco</h1>
              <span className="brand-subtitle">Store</span>
            </div>
          </div>
          <div className="welcome-text">
            <h2>¡Bienvenido de vuelta!</h2>
            <p>Inicia sesión para acceder a tu cuenta y descubrir las mejores ofertas en moda sostenible.</p>
          </div>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🌱</span>
              <span>Moda Sostenible</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <span>Envío Gratis</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💳</span>
              <span>Pago Seguro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección derecha - Formulario */}
      <div className="login-right">
        <div className="form-container">
          <div className="form-header">
            <h2>Iniciar Sesión</h2>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={logueo} className="login-form">
            <div className="input-group">
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={autenticacion.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contraseña"
                  value={autenticacion.password}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Sección de cuentas de prueba */}
            <div className="demo-accounts">
              <h4>Cuentas de prueba:</h4>
              <div className="demo-account-list">
                <div className="demo-account">
                  <strong>Admin:</strong> admin@ecostore.com / admin123
                </div>
                <div className="demo-account">
                  <strong>Usuario:</strong> usuario@ecostore.com / usuario123
                </div>
                <div className="demo-account">
                  <strong>Cliente:</strong> maria@gmail.com / 123456
                </div>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Recordarme
              </label>
              <Link to="/forgot-password" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button 
              type="submit" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="login-spinner"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  Iniciar Sesión
                </>
              )}
            </button>

            <div className="login-divider">
              <span>o</span>
            </div>

            <div className="register-section">
              <p>¿No tienes una cuenta?</p>
              <Link to="/registro" className="register-btn">
                <FaUserPlus />
                Crear cuenta nueva
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
