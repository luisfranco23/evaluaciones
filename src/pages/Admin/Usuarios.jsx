import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { URLBASE } from '../../lib/actions';
import Modal from '../../components/Modal';

const Usuarios = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [perfiles, setPerfiles] = useState([]);
  const [nivelesCargo, setNivelesCargo] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [asignadasEmpresas, setAsignadasEmpresas] = useState([]);
  const [asignadasSedes, setAsignadasSedes] = useState([]);
  const [asignadosColaboradores, setAsignadosColaboradores] = useState([]);
  const [showModal, setShowModal] = useState({ type: '', open: false });


  const buscarUsuario = async (data) => {
    const { idUsuario, correo } = data;
    setLoading(true);
    try {
      const response = await axios.get(`${URLBASE}/usuarios`, { params: { idUsuario, correo } });
      const userData = response.data?.data;

      if (userData) {
        setUsuario(userData);
        setAsignadasEmpresas(userData.Empresas || []);
        setAsignadasSedes(userData.Sedes || []);
        setAsignadosColaboradores(userData.colaboradores || []);

        const [perfilesRes, nivelesCargoRes, empresasRes, sedesRes, colaboradoresRes] = await Promise.all([
          axios.get(`${URLBASE}/usuarios/perfiles`),
          axios.get(`${URLBASE}/usuarios/nivelcargos`),
          axios.get(`${URLBASE}/empresas`),
          axios.get(`${URLBASE}/empresas/sedes`),
          axios.get(`${URLBASE}/usuarios/colaboradores`)
        ]);

        setPerfiles(perfilesRes.data?.data);
        setNivelesCargo(nivelesCargoRes.data?.data);
        setEmpresas(empresasRes.data?.data);
        setSedes(sedesRes.data?.data);
        setColaboradores(colaboradoresRes.data?.data);

        setValue('idUsuario', userData.idUsuario);
        setValue('nombre', userData.nombre);
        setValue('correo', userData.correo);
        setValue('cargo', userData.cargo);
        setValue('idPerfil', userData.idPerfil);
        setValue('idNivelCargo', userData.idNivelCargo);
      } else {
        toast.error('Usuario no encontrado.');
      }
    } catch {
      toast.error('Error al buscar usuario.');
    } finally {
      setLoading(false);
    }
  };


  const actualizarUsuario = async (data) => {
    try {
      await axios.put(`${URLBASE}/usuarios/${data.idUsuario}`, {
        ...data,
        Empresas: asignadasEmpresas,
        Sedes: asignadasSedes,
        colaboradores: asignadosColaboradores
      });
      toast.success('Usuario actualizado exitosamente.');
    } catch {
      toast.error('Error al actualizar usuario.');
    }
  };

  const cancelarBusqueda = () => {
    reset();
    setUsuario(null);
  };

  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-md max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Administrar Usuarios</h1>

      <div className="mb-8">
        <form onSubmit={handleSubmit(buscarUsuario)} className="flex gap-4">
          <input
            type="text"
            {...register('idUsuario')}
            placeholder="Buscar por ID de Usuario"
            className="border p-3 rounded-lg w-full"
          />
          <input
            type="email"
            {...register('correo')}
            placeholder="Buscar por Correo"
            className="border p-3 rounded-lg w-full"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>
      </div>

      {usuario && (
        <form onSubmit={handleSubmit(actualizarUsuario)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">ID Usuario</label>
              <input type="text" {...register('idUsuario')} className="border p-3 rounded-lg w-full" disabled />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Nombre</label>
              <input type="text" {...register('nombre', { required: true })} className="border p-3 rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Correo</label>
              <input type="email" {...register('correo', { required: true })} className="border p-3 rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Cargo</label>
              <input type="text" {...register('cargo', { required: true })} className="border p-3 rounded-lg w-full" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Perfil</label>
              <select {...register('idPerfil', { required: true })} className="border p-3 rounded-lg w-full">
                {perfiles?.map((perfil) => (
                  <option key={perfil.idPerfil} value={perfil.idPerfil}>{perfil.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Nivel de Cargo</label>
              <select {...register('idNivelCargo', { required: true })} className="border p-3 rounded-lg w-full">
                {nivelesCargo?.map((nivel) => (
                  <option key={nivel.idNivelCargo} value={nivel.idNivelCargo}>{nivel.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            {/* <button
              type="button"
              onClick={() => setShowModal({ type: 'Empresas', open: true })}
              className="bg-zvioleta text-white px-4 py-2 rounded-lg"
            >
              Asignar Empresas
            </button> */}
            <button
              type="button"
              onClick={() => setShowModal({ type: 'Colaboradores', open: true })}
              className="bg-zvioleta text-white px-4 py-2 rounded-lg"
            >
              Asignar Colaboradores
            </button>
          </div>

          <Modal
            showModal={showModal.open}
            idUsuario={usuario.idUsuario}
            type={showModal.type}
            onClose={() => setShowModal({ type: '', open: false })}
            data={{
              disponibles: showModal.type === 'Empresas' ? empresas : showModal.type === 'Sedes' ? sedes : colaboradores,
              asignados:
                showModal.type === 'Empresas'
                  ? asignadasEmpresas
                  : showModal.type === 'Sedes'
                  ? asignadasSedes
                  : asignadosColaboradores,
              onChange: (items) => {
                if (showModal.type === 'Empresas') setAsignadasEmpresas(items);
                else if (showModal.type === 'Sedes') setAsignadasSedes(items);
                else setAsignadosColaboradores(items);
              }
            }}
          />

          <div className="flex gap-4 mt-8">
            <button type="submit" className="bg-zverde text-white px-6 py-3 rounded-lg">Actualizar</button>
            <button type="button" onClick={cancelarBusqueda} className="bg-znaranja text-white px-6 py-3 rounded-lg">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Usuarios;


