import axios from 'axios'
import React from 'react'

export const getProductosGenero = async(id, setProductosPorGenero) => {
    const {data} = await axios.get(`http://127.0.0.1:3001/productos/genero/${id}`)
    setProductosPorGenero(data)

}
