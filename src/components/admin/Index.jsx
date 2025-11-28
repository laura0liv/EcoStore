import React, { useEffect, useState } from 'react'
import { FaUserAlt } from 'react-icons/fa'
import { Link} from 'react-router-dom'
//import { getGenero } from '../../../api/getGenero'
import { Header } from '../layout/Header'


export const Index = () => {

  const [generos, setGeneros] = useState([])

  useEffect(() => {
    getGenero(setGeneros);
  }, [])
  
  return (
    <div className='admin'>
      <div className='header'>
         <Header/>
          <div className='titulo'>
              <h1>Inventario</h1>
          </div>
      </div>
      <div className='acciones'>
        <Link className='link' to='/nuevaCategoria'>
            <button className='nueva-categoria'>Nueva Categoria</button>
        </Link>
        <Link to='/nuevoProducto'>
            <button className='nueva-categoria'>Nuevo Producto</button>
        </Link>
        <Link to='/nuevaReferencia'>
            <button className='nueva-categoria'>Nueva Referencia</button>
        </Link>
      </div>

      <div className='titulo'>
          <h2>Generos</h2>
          <div className='generos'>
              {generos.map((genero)=>(
                <Link className='link' to={`/productos/genero/${genero.id}`} key={genero.id}>
                <div className='hombre'>
                    <h2>{genero.tipo}</h2>
                    <img src={genero.imagen} alt="" width={600} height={700} />
                </div>
                </Link>
              ))}
        </div>
      </div>            
    </div>
  )
}
