import React, { useEffect, useState } from 'react';
import { FaEdit, FaPaypal, FaTruck } from 'react-icons/fa';
import { ResumenCompra } from './ResumenCompra';
import { Header } from '../layout/Header';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { departamentos, municipiosPorDepartamento } from '../../../helpers/ciudades';
import { getUsuario } from '../../../api/getUsuario';
import axios from 'axios';
import { getCarrito } from '../../../api/getCarrito';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';

export const Envio = () => {
  const navigate = useNavigate()
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('');
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState('');
  const [informacionContacto, setInformacionContacto] = useState([]);
  const [metodoPago, setMetodoPago] = useState('');
  const [informacionEnvio, setInformacionEnvio] = useState({
    id_usuario: null,
    departamento: '',
    municipio: '',
    direccion: '',
    total: null,
    metodo_pago: '',
  });
  const [verProductosCarrito, setVerProductosCarrito] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('id');
    setInformacionEnvio((prevInfo) => ({ ...prevInfo, id_usuario: userId }));
    getUsuario(setInformacionContacto);
    getCarrito(setVerProductosCarrito);
  }, []);

  const subtotal = Array.isArray(verProductosCarrito)
    ? verProductosCarrito.reduce((total, producto) => total + producto.cantidad * producto.precio, 0)
    : 0;

  useEffect(() => {
    setInformacionEnvio((prevInfo) => ({ ...prevInfo, total: subtotal }));
  }, [subtotal]);

  const handleDepartamentoChange = (e) => {
    const selectedDepartamento = e.target.value;
    setDepartamentoSeleccionado(selectedDepartamento);
    setMunicipioSeleccionado('');
    setInformacionEnvio((prevInfo) => ({ ...prevInfo, departamento: selectedDepartamento }));
  };

  const handleMunicipioChange = (e) => {
    const selectedMunicipio = e.target.value;
    setMunicipioSeleccionado(selectedMunicipio);
    setInformacionEnvio((prevInfo) => ({ ...prevInfo, municipio: selectedMunicipio }));
  };


  const validate = ()=>{
    if(!informacionEnvio.departamento || !informacionEnvio.municipio || !informacionEnvio.direccion 
      || !informacionEnvio.total ){
      toast.error('Todos los campos son necesarios',{
        position: "top-center",
        style:{
            background:"#656a78",
            color:"white",
            fontFamily:"sans-serif"
        }
      })
      return false;
    }
    return true;
  }

  const postInformacionEnvio = async (e) => {
    e.preventDefault();
    if(validate()){
    // Verificar que el método de pago esté seleccionado
    if (!metodoPago) {
      console.error('Selecciona un método de pago antes de continuar');
      return;
    }
    try {
      const formData = new FormData();

      formData.append('id_usuario', informacionEnvio.id_usuario);
      formData.append('departamento', informacionEnvio.departamento);
      formData.append('municipio', informacionEnvio.municipio);
      formData.append('direccion', informacionEnvio.direccion);
      formData.append('total', informacionEnvio.total);
      formData.append('metodo_pago', metodoPago);

      const { data } = await axios.post('http://127.0.0.1:3001/nuevaVenta', formData);
      console.log('data', data);

      toast.success('Compra exitosa',{
        position: "top-center",
        style:{
            background:"#656a78",
            color:"white",
            fontFamily:"sans-serif"
        }
      })

      navigate('/')

    } catch (error) {
      console.error('error de nueva venta', error);
    }
  }
  };

  const handlePaymentMethod = (e) => {
    setMetodoPago(e.target.value);
  };

  return (
    <div className="envio">
      <PayPalScriptProvider options={{
        ClientId: "AQL8hLNUgGBkbbeZqXN4DKF0ubD2Rj-s_JexhB9XU0lx6bTw5v34L5akaaObiqdp7o0XEDiTxWcTW9jl"
      }}>
      <Header />
      <div className="informacion">
        <div className="formulario">
          <div className="contacto">
            <h1>Información de Contacto</h1>
            <Link to="/checkout/profile">
              <button>
                <FaEdit />
              </button>
            </Link>
          </div>
          <div className="usuario">
            <p>{informacionContacto.email}</p>
            <p>{informacionContacto.nombre + ' ' + informacionContacto.apellido}</p>
            <p>{informacionContacto.telefono}</p>
          </div>
          <hr />
          <form onSubmit={postInformacionEnvio}>
            <div className="title">
              <h1>Información de envío</h1>
            </div>
            <div>
              <label>Selecciona un departamento:</label>
              <select
                value={departamentoSeleccionado}
                onChange={handleDepartamentoChange}
              >
                <option value="">Seleccionar...</option>
                {departamentos.map((departamento) => (
                  <option key={departamento.id} value={departamento.nombre}>
                    {departamento.nombre}
                  </option>
                ))}
              </select>

              {departamentoSeleccionado && (
                <div>
                  <label>Selecciona un municipio:</label>
                  <select
                    value={municipioSeleccionado}
                    onChange={handleMunicipioChange}
                  >
                    <option value="">Seleccionar...</option>
                    {municipiosPorDepartamento[departamentoSeleccionado].map(
                      (municipio, index) => (
                        <option key={index} value={municipio}>
                          {municipio}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
            </div>

            <div className="direcccion">
              <p>Complete su dirección de entrega</p>
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                onChange={(e) =>
                  setInformacionEnvio({
                    ...informacionEnvio,
                    direccion: e.target.value,
                  })
                }
              />
            </div>
            <div className="title">
              <h1>Metodo de pago</h1>
            </div>
            <div className="pagos">
              <div className="contraentrega">
                <input
                  type="radio"
                  name="metodoPago"
                  value="contraentrega"
                  checked={metodoPago === 'contraentrega'}
                  onChange={handlePaymentMethod}
                />
                ContraEntrega <FaTruck />
              </div>
              <div className="paypal">
                <input
                  type="radio"
                  name="metodoPago"
                  value="paypal"
                  checked={metodoPago === 'paypal'}
                  onChange={handlePaymentMethod}
                />
                PayPal <FaPaypal />
              </div>
              {metodoPago === 'contraentrega' ? (
                <p>Realiza el pago cuando la transportadora te entregue el pedido. </p>
              ) : (
                <PayPalButtons 
                className='btn-paypal'
                
                />
              )}
            </div>
          </form>

          <div className="continuar">
            <button type="submit" className="btn" onClick={postInformacionEnvio}>
              Comprar Ahora
            </button>
          </div>
        </div>
        <div className="resumen">
          <ResumenCompra />
        </div>
      </div>
      </PayPalScriptProvider>
    </div>
  );
};
