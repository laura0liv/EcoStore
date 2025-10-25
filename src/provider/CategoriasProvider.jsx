import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'

const categoriaContext = createContext();

export function useCategoriaContext() {
  const context = useContext(categoriaContext);
  if (!context) {
    throw new Error('useCategoriaContext debe ser utilizado dentro de un CategoriasProvider');
  }
  return context;
}

export const CategoriasProvider = ({children}) => {
  const [allCategorias, setAllCategorias] = useState([]);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://127.0.0.1:3001/categorias');
        setAllCategorias(data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    fetchData();

  }, []);

  const contextValue = {
    allCategorias,
    getAllCategorias: async () => {
      fetchData(); 

    },
  };

  return (
   <categoriaContext.Provider value={contextValue} >
            {children}
   </categoriaContext.Provider> 
  )
}
