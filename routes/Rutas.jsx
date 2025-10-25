import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { PublicRoutes } from './PublicRoutes';
import { AdminRoutes } from './AdminRoutes';
import { Loading } from '../src/components/layout/Loading'; 

export const Rutas = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const validarToken = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(`http://127.0.0.1:3001/validar?token=${token}`);
      setIsAuthenticated(data.resultado);
      setUserRole(data.rol);
    } catch (error) {
      console.error('Error al validar token', error);
    } finally {
      setIsLoading(false);
    }
  }; 
  
  useEffect(() => {
    validarToken();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  // Verificar si el usuario está autenticado y es un administrador
  if (isAuthenticated && userRole === 1) {
    return <AdminRoutes />;
  } else {
    // El usuario no es un administrador o no está autenticado, mostrar las rutas públicas
    return <PublicRoutes />;
  }
};
