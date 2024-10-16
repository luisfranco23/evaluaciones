import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Librería para manejar cookies
import Layout from './Layout';
import { Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedLayout = ({ allowedProfiles }) => {
  const navigate = useNavigate();
  const user = useUser()

  useEffect(() => {
    // Verificar si existe el token en la cookie
    const token = Cookies.get('token');
    const idPerfil = user?.user.idPerfil
    // Si no existe el token, redirigir al login
    if (!token) {
      navigate('/');
      return;
    }

    // Si existe el token, validar el idPerfil permitido
    const idPerfilNumber = Number(idPerfil); // Convertir a número para comparar correctamente

    // Si el perfil del usuario no está en la lista de perfiles permitidos, redirigir a Home
    if (!allowedProfiles.includes(idPerfilNumber)) {
      navigate('/home'); // Redirigir a la ruta de Home
    }
  }, [navigate, allowedProfiles]);

  return (
    <div className="flex h-screen overflow-auto">
      {/* Menú lateral siempre visible en rutas protegidas */}
      <Layout />

      {/* El contenido de las rutas */}
      <div className="flex-1 bg-gray-50">
        <Outlet />
        {/* Puedes habilitar el footer si es necesario */}
      </div>
    </div>
  );
};

export default ProtectedLayout;
