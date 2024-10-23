import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URLBASE } from '../lib/actions';
import { useUser } from '../context/UserContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FaCheckCircle } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';

const Evaluar = () => {
  const navigate = useNavigate();
  const user = useUser();
  
  // Estados para manejar la data, filtros y scroll
  const [loading, setLoading] = useState(true);
  const [filteredColaboradores, setFilteredColaboradores] = useState([]);
  const [visibleColaboradores, setVisibleColaboradores] = useState([]);
  const [filters, setFilters] = useState({
    completado: 'todos',
    empresa: 'todas',
    cargo: '',
  });
  const [hasMore, setHasMore] = useState(true);
  const [scrollLimit, setScrollLimit] = useState(20); // Mostramos 20 colaboradores al inicio

  const evaluarColaborador = (path, idUsuario) => {
    navigate(`/${path}/${idUsuario}`);
  };

  useEffect(() => {
    if (user?.user?.idUsuario) {
      axios
        .get(`${URLBASE}/usuarios/evaluar`, { params: { idUsuario: user?.user.idUsuario } })
        .then((res) => {
          user.setColaboradores(res.data?.data);
          setFilteredColaboradores(res.data?.data.colaboradores || []);
          setVisibleColaboradores(res.data?.data.colaboradores.slice(0, scrollLimit));
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [user?.user?.idUsuario]);

  // Filtrado dinámico basado en los filtros seleccionados
  useEffect(() => {
    if (user?.colaboradores?.colaboradores) {
      const { completado, empresa, cargo } = filters;
      const filtered = user?.colaboradores?.colaboradores.filter((colaborador) => {
        const completadoFilter = completado === 'todos' || colaborador.completado === (completado === 'completado');
        const empresaFilter = empresa === 'todas' || colaborador.Empresas.some(e => e.nombre === empresa);
        const cargoFilter = cargo === '' || colaborador.cargo.toLowerCase().includes(cargo.toLowerCase());
        return completadoFilter && empresaFilter && cargoFilter;
      });
      setFilteredColaboradores(filtered);
      setVisibleColaboradores(filtered.slice(0, scrollLimit)); // Mostrar primeros 20
    }
  }, [filters, user?.colaboradores?.colaboradores]);

  // Obtener lista única de empresas para el filtro
  const empresasDisponibles = useMemo(() => {
    const empresas = user?.colaboradores?.colaboradores?.flatMap(colaborador => colaborador.Empresas) || [];
    const nombresEmpresas = [...new Set(empresas.map(empresa => empresa.nombre))];
    return ['todas', ...nombresEmpresas];
  }, [user?.colaboradores?.colaboradores]);

  // Cargar más colaboradores al hacer scroll
  const fetchMoreColaboradores = () => {
    if (visibleColaboradores.length >= filteredColaboradores.length) {
      setHasMore(false); // No hay más colaboradores para mostrar
      return;
    }

    // Simula la carga de más colaboradores en bloques de 20
    setVisibleColaboradores((prev) => [
      ...prev,
      ...filteredColaboradores.slice(prev.length, prev.length + 20),
    ]);
  };

  if (loading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Lista de colaboradores a Evaluar
      </h1>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap justify-between">
        <div className="mb-4">
          <label className="mr-2 font-semibold">Completado:</label>
          <select
            value={filters.completado}
            onChange={(e) => setFilters({ ...filters, completado: e.target.value })}
            className="border rounded px-2 py-1"
          >
            <option value="todos">Todos</option>
            <option value="completado">Completado</option>
            <option value="noCompletado">No Completado</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="mr-2 font-semibold">Empresa:</label>
          <select
            value={filters.empresa}
            onChange={(e) => setFilters({ ...filters, empresa: e.target.value })}
            className="border rounded px-2 py-1"
          >
            {empresasDisponibles.map((empresa) => (
              <option key={empresa} value={empresa}>
                {empresa}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mr-2 font-semibold">Cargo:</label>
          <input
            type="text"
            value={filters.cargo}
            onChange={(e) => setFilters({ ...filters, cargo: e.target.value })}
            className="border rounded px-2 py-1"
            placeholder="Filtrar por cargo"
          />
        </div>
      </div>

      {/* Lista de colaboradores con scroll infinito */}
      <InfiniteScroll
        dataLength={visibleColaboradores.length}
        next={fetchMoreColaboradores}
        hasMore={hasMore}
        loader={<h4 className="text-center">Cargando más...</h4>}
        endMessage={<p className="text-center text-gray-500">Has llegado al final de la lista</p>}
      >
        <ul className="divide-y divide-gray-200">
          {visibleColaboradores.map((colaborador) => (
            <li key={colaborador.idUsuario} className="py-4">
              <div className="flex justify-between items-center lg:flex-row flex-col">
                <div className='md:grid md:grid-cols-4 md:w-3/4 flex flex-col'>
                  <h2 className="text-lg font-semibold text-gray-700">{colaborador.nombre}</h2>
                  <p className="text-gray-500">{colaborador.cargo}</p>
                  <p className="text-gray-500">
                    {colaborador.Empresas.length > 0
                      ? colaborador.Empresas.map(empresa => (
                          <span key={empresa.idEmpresa} className="text-blue-600">{empresa.nombre} </span>
                        ))
                      : "❌ No asignado"}
                  </p>
                  {colaborador.completado ? (
                    <FaCheckCircle color='#07bc0c' size={25} />
                  ) : (
                    <MdCancel color='#ff2d55' size={25} />
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => evaluarColaborador('evaluacion', colaborador.idUsuario)}
                    className="bg-blue-600 text-white py-1 px-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none transition"
                  >
                    Evaluar
                  </button>
                  <button
                    onClick={() => evaluarColaborador('resultados', colaborador.idUsuario)}
                    className="bg-gray-400 text-white py-1 px-3 rounded-md shadow-md hover:bg-gray-500 focus:outline-none transition"
                  >
                    Ver Resultados
                  </button>
                  <button
                    onClick={() => evaluarColaborador('seguimiento', colaborador.idUsuario)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded-md shadow-md hover:bg-yellow-600 focus:outline-none transition"
                  >
                    Seguimiento
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
};

export default Evaluar;
