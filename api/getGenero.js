import axios from 'axios';


export const getGenero = async(setNombreGenero) => {
    try {
        const {data} = await axios.get('http://127.0.0.1:3001/generos');
        setNombreGenero(data);  
    
        
      } catch (error) {
        console.error('Error al obtener tipos de género', error);
      }
}
