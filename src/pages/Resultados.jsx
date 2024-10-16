import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { URLBASE } from '../lib/actions';
import { useUser } from '../context/UserContext';
import { toast, ToastContainer } from 'react-toastify';

const Resultados = () => {
  const { idUsuario } = useParams();
  const user = useUser();
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    const fetchRespuestas = async () => {
      try {
        const respuesta = await axios.get(`${URLBASE}/respuestas`, { params: { idEvaluador: user.user?.idUsuario, idColaborador: usuario?.idUsuario } });
        setRespuestas(respuesta.data?.data);
      } catch (error) {
        toast.error("Ocurrio un error al obtener los resultados!")
      }
    };

    fetchRespuestas();
  }, [idUsuario]);

  const usuario = user?.colaboradores?.colaboradores.find(c => c.idUsuario == idUsuario) || user?.colaboradores || user?.user;

  // Función para calcular el promedio de las calificaciones por competencia
  const calcularValorCompetencia = (descriptores) => {
    const total = descriptores.reduce((sum, descriptor) => sum + descriptor.calificacion.valor, 0);
    return (total / descriptores.length).toFixed(2); // Promedio con 2 decimales
  };

  if (!respuestas || Object.keys(respuestas).length === 0) {
    return <p className='text-center pt-10'>Aún no hay registros</p>
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">{`Resultados de Evaluación de ${usuario?.nombre}`}</h1>

      {/* Estructura de tabla */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Competencia</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Promedio</th>
          </tr>
        </thead>
        <tbody>
          {/* Iterar sobre las competencias agrupadas */}
          {Object.keys(respuestas).map((competenciaId, competenciaIndex) => {
            const competencia = respuestas[competenciaId];
            return (
              <tr key={competenciaId} className="border-t">
                <td className="border border-gray-300 px-4 py-2">
                  {competencia.nombreCompetencia}
                  <ul className="mt-2">
                    {/* Listar los descriptores */}
                    {competencia.descriptores.map((descriptor) => (
                      <li key={descriptor.idDescriptor} className="text-sm text-gray-600">
                        {descriptor.nombreDescriptor} - Calificación: {descriptor.calificacion.valor}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {calcularValorCompetencia(competencia.descriptores)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Resultados;
