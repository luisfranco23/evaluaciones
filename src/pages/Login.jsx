import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { URLBASE } from '../lib/actions';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import talentoImagen from '/talento.jpg'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useUser()
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const result = await axios.post(`${URLBASE}/usuarios/login`, { correo: email, contrasena: password }, { withCredentials: true })
      if (result.data?.data) {
        user?.setUser(result.data?.data)

        if (result.data?.data.Sedes.length < 1) {
          toast.warning("No cuenta con sedes asignadas, por favor contacta con el Administrador")
          navigate('/');
          return;
        }
        // Redirigir al Home después de iniciar sesión
        navigate('/home');
      } else {
        // Mostrar error si las credenciales son incorrectas
        toast.error("Credenciales Invalidas.")
      }
    } catch (error) {
      toast.error('Ocurrió un error. Inténtalo de nuevo.')
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 min-h-screen md:h-auto flex justify-center items-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Iniciar sesión</h1>
            <p className="text-sm text-gray-600">Ingresa tus credenciales para acceder</p>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                aria-autocomplete='current-password'
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>

      <div className="w-full md:w-1/2 relative min-h-[500px] md:min-h-screen hidden md:block">
        {/* Imagen de fondo o ilustración */}
        <img src={talentoImagen} alt="Imagen de inicio de sesión" className="hidden md:block w-auto h-full object-cover" />
      </div>
    </main>
  );
};

export default Login;
