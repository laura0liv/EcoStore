import React, { useEffect, useState } from 'react'
import { FaUserAlt } from 'react-icons/fa'
//import { getTallas } from '../../../api/getTallas'
import axios from 'axios'
import toast from 'react-hot-toast'

export const NuevaReferencia = () => {

    const [tallas, setTallas] = useState([])
    const [newReferencia, setNewReferencia] = useState({
      sku_producto:'',
      id_talla:null
    })
    
    useEffect(() => {
      getTallas(setTallas)
    }, [])
    
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setNewReferencia({ ...newReferencia, [name]: value });
    };

    const handleTallasChange = (event) => {
      const selectedTallas = event.target.value;
      setNewReferencia({ ...newReferencia, id_talla: selectedTallas });
      console.log(selectedTallas)
    };
  
    const postReferencias = async(e) =>{
      e.preventDefault()
      try {
        const formData = new FormData();
        formData.append('sku_producto', newReferencia.sku_producto)
        formData.append('id_talla', newReferencia.id_talla)
        const {data} =  await axios.post('http://127.0.0.1:3001/referencia', formData)
        console.log(data)
        const status = data.status
        if(status === 'success'){
          toast.success('Referencia creada correctamente',{
            position: "top-center",
            style:{
                background:"#656a78",
                color:"white",
                fontFamily:"sans-serif"
            }
          })
        
        }
      } catch (error) {
        console.error('Error al crear una nueva referencia', error)
      }
    }
    
  
  return (
          <div className='nuevo'>
        <div className='header'>
          <div className='iconos'>
              <div className='icono-sesion'>
                <p><FaUserAlt/>Cerrar sesión</p>
              </div>
          </div>
          <div className='titulo'>
              <h1>Nueva Referencia</h1>
          </div>
      </div>
      <div className='crear'>
        <form className='formulario' onSubmit={postReferencias} >
            <fieldset>
                
                <label htmlFor="sku_producto">Codigo de producto</label>
                <input type="text" id='sku_producto' name='sku_producto' onChange={handleInputChange} />

                <label htmlFor='talla'>talla</label>
                <select name="id_talla" id="id_talla" onChange={handleTallasChange} >
                    <option >--select--</option>
                    {tallas.map((talla)=>(
                        <option key={talla.id} value={talla.id} >
                          {talla.nombre}
                        </option>
                    ))}
                     
                </select>
            </fieldset>
            <div className='btn-crear'>
                <input type="submit" className='btn' value='Crear' />
            </div>
            
        </form>
      </div>
    </div>
    
  )
}
