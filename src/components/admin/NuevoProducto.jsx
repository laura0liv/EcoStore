import axios from 'axios'
import React, { useState } from 'react'
import { FaUserAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
//import { useCategoriaContext } from '../../provider/CategoriasProvider';
import toast from 'react-hot-toast';
import { Header } from '../layout/Header';

export const NuevoProducto = () => {

  const navigate = useNavigate();
  const { allCategorias, getAllCategorias } = useCategoriaContext();
  const [newProducto, setNewProducto] = useState({
    nombre:'',
    caracteristicas:'',
    precio:null,
    imagen:[],
    id_categoria:null
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProducto({ ...newProducto, [name]: value });
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
      setNewProducto((prevProducto) => ({
        ...prevProducto,
        imagen: Array.from(files)
      }));
  };

  const handleCategoriaChange = (event) => {
    const selectCategoriaId = event.target.value;
    setNewProducto({ ...newProducto, id_categoria: selectCategoriaId });
  };
  
  const validate = () =>{
    if(!newProducto.nombre || !newProducto.caracteristicas || !newProducto.precio || !newProducto.imagen 
      ||!newProducto.id_categoria){
      toast.error('Todos los campos son necesarios',{
        position: "top-center",
        style:{
            background:"#656a78",
            color:"white",
            fontFamily:"sans-serif"
        }
      })
      return false
    }
    return true;
  }

  const postProducto = async(e) =>{
    e.preventDefault();
    if(validate()){
      try {
        const formData = new FormData ();
        formData.append('nombre', newProducto.nombre);
        formData.append('caracteristicas', newProducto.caracteristicas);
        formData.append('precio', newProducto.precio);
          if (Array.isArray(newProducto.imagen) && newProducto.imagen.length > 0) {
            newProducto.imagen.forEach((file, index) => {
              formData.append(`imagen${index + 1}`, file);
            });
          }
          formData.append('id_categoria', newProducto.id_categoria);
  
          const {data} =  await axios.post('http://127.0.0.1:3001/producto', formData)
          const status = data.status
          if(status === 'success'){
            toast.success('El producto fue creado correctamente',{
              position: "top-center",
              style:{
                  background:"#656a78",
                  color:"white",
                  fontFamily:"sans-serif"
              }
            })
            navigate('/admin')
            return false 
          }
      }
      catch (error) {
         console.error('error al crear un nuevo producto', error);
      }
    }  
  }

  return (
    <div className='nuevo'>
    <div className='header'>
      <Header/>
      <div className='titulo'>
          <h1>Nuevo Producto</h1>
      </div>
  </div>
  <div className='crear'>
    <form className='formulario' onSubmit={postProducto}>
        <fieldset>
 
           <label htmlFor='categoria' >Categoria</label>
            <select name="categoria" id="categoria" onChange={handleCategoriaChange}>
                <option value="">--select--</option>
                {allCategorias.map((categoria)=>(
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.tipo}
                    </option>
                ))}
            </select>

            <label htmlFor="nombre">Nombre del producto</label>
            <input type="text" id='nombre' name='nombre' onChange={handleInputChange}/>

            <label htmlFor="caracteristica">Caracteristicas</label>
            <input type="text" id='caracteristica' name='caracteristicas' onChange={handleInputChange} />

            <label htmlFor="precio">Precio</label>
            <input type="text" id='precio' name='precio' onChange={handleInputChange} />

            <label htmlFor="imagen">Imagen Principal</label>
            <input type="file" id='imagen' name='imagen' multiple onChange={handleFileChange}/>


        </fieldset>
        <div className='btn-crear'>
            <input type="submit" className='btn'  value='Crear' />
        </div>
        
    </form>
  </div>
</div>
  )
}
