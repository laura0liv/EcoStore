import axios from 'axios'
import React from 'react'

export const getCategoriaGenero = async (id, setCategoriasPorGenero) => {
    try {
        const { data } = await axios.get(`http://127.0.0.1:3001/categorias/${id}`);
        setCategoriasPorGenero(data);
    } catch (error) {
        console.error('Error fetching categorias:', error.message);
     
    }
};
