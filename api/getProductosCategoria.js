import axios from 'axios'

export const getProductosCategoria = async (id, setProductos) => {
    try {
      if (typeof setProductos === 'function') {
        const { data } = await axios.get(`http://127.0.0.1:3001/productos/${id}`);
        setProductos(data);
      } else {
        console.error('setProductos no es una función válida');
      }
    } catch (error) {
      console.error('No fue posible obtener los productos', error);
    }
  };
  