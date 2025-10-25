import axios from 'axios';
import React from 'react'

export const getTallas = async(setTallas) => {
    
    const {data} = await axios.get('http://127.0.0.1:3001/tallas');
    setTallas(data)
    
}
