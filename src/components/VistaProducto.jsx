import React, { useEffect, useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { getOneProducto, getReferencias, getTallas } from '../../api'
import { Header } from './layout/Header'


export const VistaProducto = () => {

  const {id} = useParams()  
  const navigate = useNavigate()
  const [verProductos, setVerProductos] = useState([])
  const [tallas, setTallas] = useState([])
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null)
  const [imagenes, setImagenes] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [referencias, setReferencias] = useState([])
  const [userId, setUserId] = useState(null);
  

  const handleSeleccion = (tallaId) => {
    setTallaSeleccionada(tallaId)
  };

  useEffect(() => {
    
    getOneProducto(id, setVerProductos);
    getTallas(setTallas)
    getReferencias(setReferencias)
    
  }, [id])

  useEffect(() => {
    if(verProductos.imagen){
      setImagenes(JSON.parse(verProductos.imagen));
    }
  }, [verProductos])

    //   async function eliminarProducto(){
    //     await deleteProducto(id)
    //     navigate('/admin')
    // }

  const handleAñadirCarrito = async () => {
    const isLoggedIn = !!localStorage.getItem('token'); // Definir isLoggedIn aquí

    if (!isLoggedIn) {
      toast.error('Debes iniciar sesión para agregar productos al carrito', {
        position: 'top-center',
        style: {
          background: '#656a78',
          color: 'white',
          fontFamily: 'sans-serif',
        },
      });
        navigate('/login')
      return;
    }

      if (tallaSeleccionada === null) {
        toast.error('Por favor selecciona la talla deseada', {
          position: 'top-center',
          style: {
            background: '#656a78',
            color: 'white',
            fontFamily: 'sans-serif',
          },
        });
        return;
      }

    try {
    // Obtener el ID de referencia basado en el SKU del producto y la talla seleccionada
      const idReferencia = await obtenerIdReferenciaPorProductoYTalla(
      verProductos.sku,
      tallaSeleccionada
    );
    if (idReferencia === null || idReferencia === undefined) {
      toast.error('Referencia no disponible', {
        position: 'top-center',
        style: {
          background: '#656a78',
          color: 'white',
          fontFamily: 'sans-serif',
        },
      });
      return;
    }

    const userId = localStorage.getItem('id');

    const data = {
      id_usuario: userId,
      id_referencia: idReferencia,
      
    };


    const { response } = await axios.post('http://127.0.0.1:3001/agregarProducto', data);
    console.log(data)

 
    if(data.id_referencia === undefined){
      toast.error('Referencia no disponible', {
        position: 'top-center',
        style: {
          background: '#656a78',
          color: 'white',
          fontFamily: 'sans-serif',
        },
      });
      return;
    }
    
  } catch (error) {
    console.error('No se pudo añadir el producto al carrito de compras', error);
  }
};

    // Función para obtener el ID de referencia basado en el SKU del producto y la talla seleccionada
    const obtenerIdReferenciaPorProductoYTalla = async (skuProducto, tallaSeleccionada) => {
      try {
        const { data } = await axios.get(
          `http://127.0.0.1:3001/obtenerIdReferencia/${skuProducto}/${tallaSeleccionada}`);
        return data.id;

      } catch (error) {
        console.error('Error al obtener el ID de referencia', error);
        
      }
 };


  return (
    <div className='producto'>
        <div className='header'>
            <div className='iconos'>
                <Header/>
            </div>
        </div>

        <div className='vista-producto'> 
          <div className='vista-imagen'>
              <div className='imagenes'>
                {imagenes.map((imagen)=>(
                     <img key={imagen} src={`http://127.0.0.1:3001/${imagen}`} alt="producto" />
                ))}
              </div>
            </div>

            <div className='descripcion'>
                <h2>{verProductos.nombre}</h2>
                <p>{verProductos.caracteristicas}</p>
                <p>${verProductos.precio}</p>
                <div className='tallas'>
                  {tallas.map((talla) => (
                    <div
                      key={talla.id}
                      className={`talla ${tallaSeleccionada === talla.id ? 'seleccionada' : ''}`}
                      onClick={() => handleSeleccion(talla.id)}
                    >
                      <label>
                        <span>{talla.nombre}</span>
                        <input
                          className='radio'
                          type="radio"
                          name="talla"
                          value={talla.id}
                          onChange={() => {}}
                          checked={tallaSeleccionada === talla.id}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  ))}
                </div>

                  <button className='añadir-carrito' onClick={handleAñadirCarrito}
                  >Añadir al carrito <FaShoppingCart/>
                  </button>
              </div>

        </div>
    </div>
  )
}
