import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { FaStore, FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard, FaUserPlus, FaSignInAlt, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import '../../styles/css/Registro.css';

export const Registrarse = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registro, setRegistro] = useState({
     identificacion: '',
     email: '',
     password: '',
     confirmPassword:'',
     nombre: '',
     apellido: '',
     telefono: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRegistro({ ...registro, [name]: value });
  };

  const validate = () =>{
    if(!registro.identificacion || !registro.email || !registro.password || !registro.confirmPassword || !registro.nombre || !registro.apellido
      ||!registro.telefono ){
      toast.error('Todos los campos son necesarios',{
        position: "top-center",
        style:{
            background:"#e74c3c",
            color:"white",
            fontFamily:"Arial, sans-serif"
        }
      })
      return false;
    }
    if(registro.password !== registro.confirmPassword){
      toast.error('Las contraseñas no coinciden',{
        position: "top-center",
        style:{
            background:"#e74c3c",
            color:"white",
            fontFamily:"Arial, sans-serif"
        }
      })
      return false;
   }
   if(registro.password.length < 6){
      toast.error('La contraseña debe tener al menos 6 caracteres',{
        position: "top-center",
        style:{
            background:"#e74c3c",
            color:"white",
            fontFamily:"Arial, sans-serif"
        }
      })
      return false;
   }
   return true;
  }

  const postRegistro = async(e) =>{
    e.preventDefault();
    if(validate()){
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('identificacion', registro.identificacion);
        formData.append('email', registro.email);
        formData.append('password', registro.password);
        formData.append('confirmPassword', registro.confirmPassword);
        formData.append('nombre', registro.nombre);
        formData.append('apellido', registro.apellido);
        formData.append('telefono', registro.telefono);

        const {data} = await axios.post('http://127.0.0.1:3001/registrate', formData);
        const status = data.status
        if(status === 'success'){
          toast.success('¡Cuenta creada exitosamente!',{
            position: "top-center",
            style:{
                background:"#667eea",
                color:"white",
                fontFamily:"Arial, sans-serif"
            }
          })
          navigate('/login')
        }
      } catch (error) {
        toast.error('Error al crear la cuenta. Intenta nuevamente.',{
          position: "top-center",
          style:{
              background:"#e74c3c",
              color:"white",
              fontFamily:"Arial, sans-serif"
          }
        })
        console.error('error de registro', error)
      } finally {
        setIsLoading(false);
      }
    }
  }
  
  return (
    <div className="registro-container">
      {/* Sección izquierda - Logo y branding */}
      <div className="registro-left">
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
            <h2>¡Únete a nuestra comunidad!</h2>
            <p>Crea tu cuenta y descubre una nueva forma de comprar moda sostenible y responsable.</p>
          </div>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🌱</span>
              <span>Moda Sostenible</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎁</span>
              <span>Ofertas Exclusivas</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⭐</span>
              <span>Calidad Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección derecha - Formulario */}
      <div className="registro-right">
        <div className="registro-form-container">
          <div className="registro-form-header">
            <h2>Crear Cuenta</h2>
            <p>Completa tus datos para registrarte</p>
          </div>

          <form onSubmit={postRegistro} className="registro-form">
            <div className="registro-form-row">
              <div className="registro-input-group">
                <div className="registro-input-wrapper">
                  <FaUser className="registro-input-icon" />
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={registro.nombre}
                    onChange={handleInputChange}
                    className="registro-form-input"
                    required
                  />
                </div>
              </div>

              <div className="registro-input-group">
                <div className="registro-input-wrapper">
                  <FaUser className="registro-input-icon" />
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                    value={registro.apellido}
                    onChange={handleInputChange}
                    className="registro-form-input"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="registro-input-group">
              <div className="registro-input-wrapper">
                <FaIdCard className="registro-input-icon" />
                <input
                  type="text"
                  name="identificacion"
                  placeholder="Número de identificación"
                  value={registro.identificacion}
                  onChange={handleInputChange}
                  className="registro-form-input"
                  required
                />
              </div>
            </div>

            <div className="registro-input-group">
              <div className="registro-input-wrapper">
                <FaEnvelope className="registro-input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={registro.email}
                  onChange={handleInputChange}
                  className="registro-form-input"
                  required
                />
              </div>
            </div>

            <div className="registro-input-group">
              <div className="registro-input-wrapper">
                <FaPhone className="registro-input-icon" />
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Número de teléfono"
                  value={registro.telefono}
                  onChange={handleInputChange}
                  className="registro-form-input"
                  required
                />
              </div>
            </div>

            <div className="registro-form-row">
              <div className="registro-input-group">
                <div className="registro-input-wrapper">
                  <FaLock className="registro-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Contraseña"
                    value={registro.password}
                    onChange={handleInputChange}
                    className="registro-form-input"
                    required
                  />
                  <button
                    type="button"
                    className="registro-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="registro-input-group">
                <div className="registro-input-wrapper">
                  <FaLock className="registro-input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    value={registro.confirmPassword}
                    onChange={handleInputChange}
                    className="registro-form-input"
                    required
                  />
                  <button
                    type="button"
                    className="registro-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="registro-form-options">
              <label className="registro-terms-agreement">
                <input type="checkbox" required />
                <span className="registro-checkmark"></span>
                Acepto los <Link to="/terms" className="registro-terms-link">términos y condiciones</Link>
              </label>
            </div>

            <button 
              type="submit" 
              className={`registro-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="registro-spinner"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  <FaUserPlus />
                  Crear Cuenta
                </>
              )}
            </button>

            <div className="registro-divider">
              <span>o</span>
            </div>

            <div className="registro-login-section">
              <p>¿Ya tienes una cuenta?</p>
              <Link to="/login" className="registro-login-btn">
                <FaSignInAlt />
                Iniciar Sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
