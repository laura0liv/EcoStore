import React from 'react'
import { useCategoriaContext } from '../provider/CategoriasProvider';
import { Link } from 'react-router-dom';


export const Categorias = () => {

    const { allCategorias, getAllCategorias } = useCategoriaContext();

  // return (
  //   <div>
  //       <div className='categorias'>
  //       {allCategorias.map((categoria)=>(
  //         <Link className='link' to={`/productos/${categoria.id}`} key={categoria.id} >
  //             <div className='categoria' >
  //               <img src={categoria.imagen} alt='categoria' />
  //               <p className='nombre-categoria'>{categoria.tipo}</p>
  //           </div>
  //        </Link>
  //       ))}
  //     </div>
    
  //   </div>
  // )
}
