import axios from 'axios'
import toast from 'react-hot-toast'


export const deleteProducto = async(id) => {

    const {data} = await axios.delete(`http://127.0.0.1:3001/producto/${id}`)
    const status = data.status

    if(status === 'success'){
        toast.success('El producto fue eliminado',{
            position: "top-center",
            style:{
                background:"#656a78",
                color:"white",
                fontFamily:"sans-serif"
            }
        })

    }  
    
   
}
