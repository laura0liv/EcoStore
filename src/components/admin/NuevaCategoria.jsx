import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FaUserAlt } from 'react-icons/fa'
//import { getGenero } from '../../../api/getGenero';
import { useNavigate } from 'react-router-dom';

export const NuevaCategoria = () => {

  const navigate = useNavigate()
  const [nombreGenero, setNombreGenero] = useState([])
  const [newCategoria, setNewCategoria] = useState({
      tipo:'',
      imagen:'',
      id_genero:null
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCategoria({ ...newCategoria, [name]: value });
  };

  const handleFileChange = (event) =>{
    const file = event.target.files[0];
    setNewCategoria({...newCategoria, imagen: file });
  }
  const handleGeneroChange = (event) => {
    const selectedGeneroId = event.target.value;
    setNewCategoria({ ...newCategoria, id_genero: selectedGeneroId });
    console.log(selectedGeneroId)
  };

  const validate = ()=>{
    if(!newCategoria.tipo || !newCategoria.imagen || !newCategoria.id_genero){
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

  const postCategoria = async (e) => {
    e.preventDefault()
    if(validate()){
      try {
        const formData = new FormData();
        formData.append('tipo', newCategoria.tipo);
        formData.append('imagen', newCategoria.imagen);
        formData.append('id_genero', newCategoria.id_genero); 

        const {data} = await axios.post('http://127.0.0.1:3001/categoria', formData)
        const status = data.status
        if(status === 'success'){
          toast.success('La categoria fue creada correctamente',{
            position: "top-center",
            style:{
                background:"#656a78",
                color:"white",
                fontFamily:"sans-serif"
            }
           
          })
          navigate('/admin')
        }
   
        
      } catch (error) {
        console.error('error al crear una nueva categoria', error)
      }
    }
  }

  useEffect(() => {
    getGenero(setNombreGenero)
  }, [])
  
  return (
    <div className='nuevo'>
        <div className='header'>
          <div className='iconos'>
              <div className='icono-sesion'>
                <p><FaUserAlt/>Cerrar sesión</p>
              </div>
          </div>
          <div className='titulo'>
              <h1>Nueva Categoria</h1>
          </div>
      </div>
      <div className='crear'>
        <form className='formulario' onSubmit={postCategoria}>
            <fieldset>
                
               <label htmlFor='genero'>Genero</label>
                <select name="genero" id="genero" onChange={handleGeneroChange}>
                    <option >--select--</option>
                    {nombreGenero.map((genero)=>(
                        <option key={genero.id} value={genero.id} >
                          {genero.tipo}
                        </option>
                    ))}
                     
                </select>

                <label htmlFor="tipo">Nombre de la Categoria</label>
                <input type="text" id='tipo' name='tipo' onChange={handleInputChange}/>

                <label htmlFor="imagen">Imagen</label>
                <input type="file" id='imagen' name='imagen' onChange={handleFileChange} />

           
            </fieldset>
            <div className='btn-crear'>
                <input type="submit" className='btn' value='Crear' />
            </div>
            
        </form>
      </div>
    </div>
  )
}
