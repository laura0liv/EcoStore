import axios from 'axios';
import React from 'react'

export const getAllProductos = async(setAllProductos) => {
    const {data} = await axios.get('http://127.0.0.1:3001/productos');
    setAllProductos(data)
}
