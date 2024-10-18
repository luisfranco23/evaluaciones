import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { URLBASE } from '../../lib/actions';

const Usuarios = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [perfiles, setPerfiles] = useState([]);
  const [nivelesCargo, setNivelesCargo] = useState([]);

  // Función para buscar usuario por idUsuario o correo
  const buscarUsuario = async (data) => {
    const { idUsuario, correo } = data;
    setSearching(true);
    setLoading(true);

    try {
      const response = await axios.get(`${URLBASE}/usuarios`, {
        params: { idUsuario, correo }
      });

      const userData = response.data?.data.usuario;
      const perfilesData = response.data?.data.perfiles;
      const nivelesData = response.data?.data.nivelcargo;

      if (userData) {
        setUsuario(userData);
        setPerfiles(perfilesData); // Guardar los perfiles recibidos
        setNivelesCargo(nivelesData); // Guardar los niveles de cargo recibidos

        // Setea los valores del formulario con la respuesta del servidor
        setValue('idUsuario', userData.idUsuario);
        setValue('nombre', userData.nombre);
        setValue('correo', userData.correo);
        setValue('cargo', userData.cargo);
        setValue('idPerfil', userData.idPerfil);
        setValue('idNivelCargo', userData.idNivelCargo);
        setValue('contrasena')
      } else {
        toast.error('Usuario no encontrado.');
      }
    } catch (error) {
      console.error('Error al buscar usuario:', error);
      toast.error('Error al buscar usuario.');
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar los datos del usuario
  const actualizarUsuario = async (data) => {

    try {
      await axios.put(`${URLBASE}/usuarios/${data.idUsuario}`, data);
      toast.success('Usuario actualizado exitosamente.');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      toast.error('Error al actualizar usuario.');
    }
  };

  // Función para resetear el formulario y buscar otro usuario
  const cancelarBusqueda = () => {
    reset();
    setUsuario(null);
    setSearching(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Administrar Usuarios</h1>

      {/* Buscador */}
      <div className="mb-6">
        <form onSubmit={handleSubmit(buscarUsuario)} className="flex gap-4">
          <input
            type="text"
            {...register('idUsuario')}
            placeholder="Buscar por ID de Usuario"
            className="border p-2 rounded w-full"
          />
          <input
            type="email"
            {...register('correo')}
            placeholder="Buscar por Correo"
            className="border p-2 rounded w-full"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
      </div>

      {/* Formulario de actualización solo si el usuario está cargado */}
      {usuario && (
        <form onSubmit={handleSubmit(actualizarUsuario)} className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">ID Usuario</label>
            <input
              type="text"
              {...register('idUsuario')}
              className="border p-2 rounded w-full"
              disabled
            />
          </div>

          <div>
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              {...register('nombre', { required: true })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Correo</label>
            <input
              type="email"
              {...register('correo', { required: true })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Cargo</label>
            <input
              type="text"
              {...register('cargo', { required: true })}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Perfil</label>
            <select
              {...register('idPerfil', { required: true })}
              className="border p-2 rounded w-full"
            >
              {perfiles.map((perfil) => (
                <option key={perfil.idPerfil} value={perfil.idPerfil}>
                  {perfil.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Nivel de Cargo</label>
            <select
              {...register('idNivelCargo', { required: true })}
              className="border p-2 rounded w-full"
            >
              {nivelesCargo.map((nivel) => (
                <option key={nivel.idNivelCargo} value={nivel.idNivelCargo}>
                  {nivel.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-3">
            <label className="block mb-1">Contraseña</label>
            <input
              type="password"
              {...register('contrasena', { required: true })}
              className="border p-2 rounded w-full bg-gray-100"
            />
          </div>

          {/* Botones */}
          <div className="col-span-3 flex gap-4 mt-4">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Actualizar
            </button>
            <button
              type="button"
              onClick={cancelarBusqueda}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Usuarios;
