import axios from 'axios'
import React from 'react'

export const getCarrito = async(setVerProductosCarrito) => {
    try {
        const userId = localStorage.getItem('id');
        
        // Intentar obtener carrito real de la API
        const {data} = await axios.get(`http://127.0.0.1:3001/carrito/${userId}`);
        
        // Obtener carrito falso del localStorage
        const carritoFalso = JSON.parse(localStorage.getItem('carritoFalso') || '[]');
        
        // Combinar ambos carritos
        const carritoCompleto = [...data, ...carritoFalso];
        
        setVerProductosCarrito(carritoCompleto);
    } catch (error) {
        console.log('Error al obtener carrito de la API, usando solo carrito falso');
        
        // Si falla la API, usar solo el carrito falso
        const carritoFalso = JSON.parse(localStorage.getItem('carritoFalso') || '[]');
        setVerProductosCarrito(carritoFalso);
    }
}
