import axios from 'axios'
import React from 'react'

export const getReferencias = async(setReferencias) => {
    const {data} = await axios.get('http://127.0.0.1:3001/referencias')
    setReferencias(data)

}
