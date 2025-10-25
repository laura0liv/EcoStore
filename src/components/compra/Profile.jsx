import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ResumenCompra } from './ResumenCompra'
import { Header } from '../layout/Header';
import { FaEdit} from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';


export const Profile = () => {
  const navigate = useNavigate()
  const [updateInformacion, setUpdateInformacion] = useState({
    id:0,
    email:'',
    nombre:'',
    apellido:'',
    telefono:0,
    identificacion:0
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdateInformacion({ ...updateInformacion, [name]: value });
  };

  const validate = () =>{
    if(!updateInformacion.email || !updateInformacion.nombre || !updateInformacion.apellido || !updateInformacion.telefono 
      || !updateInformacion.identificacion ){
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

    const editarInformacion = async (e) => {
      e.preventDefault();
      try {
        if(validate()){
        const formData = new FormData();
        formData.append('id', updateInformacion.id);
        formData.append('email', updateInformacion.email);
        formData.append('nombre', updateInformacion.nombre);
        formData.append('apellido', updateInformacion.apellido);
        formData.append('telefono', updateInformacion.telefono);
        formData.append('identificacion', updateInformacion.identificacion);
    
        const { data } = await axios.post('http://127.0.0.1:3001/usuarioEditar', formData);
        console.log(data)
        navigate('/checkout/shipping')

        }
      } catch (error) {
        console.error('Error al editar la información:', error);
      }
    };

     const getInformacionUsuario = async ()=>{
      const userId = localStorage.getItem('id');    
      const {data} = await axios.get(`http://127.0.0.1:3001/getUsuario/${userId}`)

      setUpdateInformacion({
          id: data[0].id,  
          email: data[0].email,
          nombre: data[0].nombre,
          apellido: data[0].apellido,
          telefono: data[0].telefono,
          identificacion: data[0].identificacion,
         
      })
  
   
    }

    useEffect(() => {
      getInformacionUsuario()
      }, [])
  
    
  



  return (
    <div className='profile'>
    <Header/>
    <div className='informacion'>
      <div className='formulario'>
        <form onSubmit={editarInformacion}>
          <div className='title'>
            <h1>Información de Contacto</h1>
          </div>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={updateInformacion.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={updateInformacion.nombre}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={updateInformacion.apellido}
            onChange={handleInputChange}
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Telefono"
            value={updateInformacion.telefono}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="identificacion"
            placeholder="Identificacion"
            value={updateInformacion.identificacion}
            onChange={handleInputChange}
          />
          <div>
              <input type="submit" className='btn' value="Continuar" />
          </div>
        </form>

        <hr />
        <div className='envio'>
          <h1>Información de envio</h1>
          <Link to='/checkout/shipping'>
            <button><FaEdit/></button>
          </Link>
        </div>
      </div>
      <div className='resumen'>
        <ResumenCompra/>
      </div>
    </div>
  </div>
  )
}
