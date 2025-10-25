import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllProductos } from '../../api/getAllProductos';

export const AllProductos = () => {

  const [allProductos, setAllProductos] = useState([]);

  useEffect(() => {
     getAllProductos(setAllProductos);
  }, [])


//   return (
//       // <div className='admin'>
//       //   <div className='header'>
//       //       <div className='titulo'>
//       //           <h1>Todos los Productos</h1>
//       //       </div>
//       //   </div>
//       //   <div className='productos'>
//       //     {allProductos.map((producto)=>{
//       //       const imagen = 'http://127.0.0.1:3001/' + JSON.parse(producto.imagen)[0];
//       //       return (
//       //      <Link className='link' to={`/producto/${producto.id}`} key={producto.id}>
//       //           <div className='producto'>
//       //               <img src={imagen} alt="producto" />
//       //               <h2>{producto.nombre}</h2>
//       //               <p className='precio'>${producto.precio}</p>
//       //           </div>
//       //       </Link>)
//       //     })}
          
//       //   </div> 
//       // </div>
//     )
}
