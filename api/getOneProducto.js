import axios from "axios"


export const getOneProducto = async(id, setVerProductos) => {
    try {
        const {data} = await axios.get(`http://127.0.0.1:3001/producto/${id}`)
        setVerProductos(data)
     
    } catch (error) {
        console.error('no se pudo obtener el producto', error)
    }
   
}
