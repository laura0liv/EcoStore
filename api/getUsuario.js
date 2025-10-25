import axios from 'axios'
import React from 'react'

export const getUsuario = async (setInformacionContacto) => {
    const userId = localStorage.getItem('id');    
    const {data} = await axios.get(`http://127.0.0.1:3001/getUsuario/${userId}`)
    setInformacionContacto(data[0])
    console.log(data)
}
