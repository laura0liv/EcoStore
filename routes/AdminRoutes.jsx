import React from 'react'
import { Carrito, Cart, Envio, Index, Login, NuevaCategoria, NuevaReferencia, NuevoProducto,
    Principal, ProductosCategoria, ProductosGenero, Profile, Registrarse, VistaProducto } from '../src/components'
import { Route, Routes } from 'react-router-dom'

export const AdminRoutes = () => {
  return (
    <Routes>
        <Route path='/admin' element={<Index/>}/>
        <Route path='/nuevaCategoria' element={<NuevaCategoria/>}/>
        <Route path='/nuevoProducto' element={<NuevoProducto/>}/>
        <Route path='/nuevaReferencia' element={<NuevaReferencia/>}/>
        <Route path='/checkout/cart' element={<Cart/>}/>
        <Route path='/checkout/profile' element={<Profile/>}/>
        <Route path='/checkout/shipping' element={<Envio/>}/>
        <Route path='/' element={<Principal/>}/>
        <Route path='/productos/:id' element={<ProductosCategoria/>}/>
        <Route path='/producto/:id' element={<VistaProducto/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/registro' element={<Registrarse/>}/>
        <Route path='/productos/genero/:id' element={<ProductosGenero/>}/>
        <Route path='/carrito' element={<Carrito/>}/>
    </Routes>
  )
}
