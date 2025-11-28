import React, { useState, useEffect } from 'react';
import { PublicRoutes } from './PublicRoutes';
import { AdminRoutes } from './AdminRoutes';
import { Loading } from '../src/components/layout/Loading';

export const Rutas = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const validarToken = () => {
    // ------ Simulación sin API ------
    const token = localStorage.getItem('token');   // "token" puede ser cualquier valor
    const role = localStorage.getItem('rol');      // Puedes guardar 1 para admin y 2 para user

    if (token) {
      setIsAuthenticated(true);
      setUserRole(Number(role));  
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    validarToken();
  }, []);

  if (isLoading) return <Loading />;

  if (isAuthenticated && userRole === 1) {
    return <AdminRoutes />;
  } else {
    return <PublicRoutes />;
  }
};
