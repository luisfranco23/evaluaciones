import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URLBASE } from '../lib/actions';
import { useUser } from '../context/UserContext';

const Evaluar = () => {
  const navigate = useNavigate();
  const user = useUser();

  const evaluarColaborador = (path, idUsuario) => {
    navigate(`/${path}/${idUsuario}`);
  };

  useEffect(() => {
    if (user?.user?.idUsuario) {
      axios
        .get(`${URLBASE}/usuarios/evaluar`, { params: { idUsuario: user?.user.idUsuario } })
        .then((res) => user.setColaboradores(res.data?.data))
        .catch((err) => console.log(err));
    }
  }, [user?.user?.idUsuario]);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Lista de colaboradores a Evaluar
      </h1>
      {user?.colaboradores?.colaboradores?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user?.colaboradores?.colaboradores.map((colaborador) => (
            <div
              key={colaborador.idUsuario}
              className="bg-white shadow-md p-4 rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  {colaborador.nombre}
                </h2>
                <p className="text-gray-500 mb-2">{colaborador.cargo}</p>
                <p className="text-gray-500 mb-2">
                  {colaborador.Empresas.length > 0 
                    ? colaborador.Empresas.map(empresa => (
                        <span key={empresa.idEmpresa} className="text-blue-600">{empresa.nombre} </span>
                      )) 
                    : "❌ No asignado"}
                </p>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => evaluarColaborador('evaluacion', colaborador.idUsuario)}
                  className="bg-black text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-950 focus:outline-none focus:ring focus:ring-blue-300 transition-all"
                >
                  Evaluar
                </button>
                <button
                  className="bg-gray-400 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300 transition-all"
                  onClick={() => evaluarColaborador('resultados', colaborador.idUsuario)}
                >
                  Ver Resultados
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl text-gray-600">No hay colaboradores asignados.</h2>
        </div>
      )}
    </div>
  );
};

export default Evaluar;
