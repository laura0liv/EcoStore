import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Carrito, Login,Principal,
   ProductosCategoria, Registrarse, VistaProducto, Checkout} from '../src/components'
import { BuscarProductos } from '../src/components/BuscarProductos'



export const PublicRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Principal/>}/>
        {/* <Route path='/productos/:id' element={<ProductosCategoria/>}/> */}
        <Route path='/producto/:id' element={<VistaProducto/>}/>
        <Route path='/buscar/:termino?' element={<BuscarProductos/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/registro' element={<Registrarse/>}/>
        <Route path='/productos/categoria/:categoria' element={<ProductosCategoria/>}/>
        <Route path='/carrito' element={<Carrito/>}/>
        {/* <Route path='/checkout/cart' element={<Cart/>}/> */}
        {/* <Route path='/checkout/profile' element={<Profile/>}/> */}
        {/* <Route path='/checkout/shipping' element={<Envio/>}/> */}
        <Route path='/admin' element={<Navigate to='/'/>}/>
        <Route path='/nuevoProducto' element={<Navigate to='/'/>}/>
        <Route path='/nuevaCategoria' element={<Navigate to='/'/>}/>
        <Route path='/nuevaReferencia' element={<Navigate to='/'/>}/>
        <Route path="/checkout" element={<Checkout/>} />
    </Routes>
  )
}
