import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URLBASE } from '../lib/actions';
import { useUser } from '../context/UserContext';

const Evaluar = () => {
  const navigate = useNavigate();
  const [disponible, setDisponible] = useState(false)
  const user = useUser();

  const evaluarColaborador = (path, idUsuario) => {
    navigate(`/${path}/${idUsuario}`);
  };

  useEffect(() => {
    // Verificar si el usuario está disponible antes de hacer la solicitud
    if (user?.user?.idUsuario) {
      axios
        .get(`${URLBASE}/usuarios/evaluar`, { params: { idUsuario: user?.user.idUsuario } })
        .then((res) => user.setColaboradores(res.data?.data))
        .catch((err) => console.log(err));
    }
    // const getDisponible = async () => {
    //   if (!user || !user.user) {
    //     toast.error("Usuario no encontrado.");
    //     return;
    //   }
      
      
    //   console.log(user?.colaboradores?.colaboradores.map((colaborador) => colaborador.idUsuario))
      
    //   try {
    //     const respuesta = await axios.get(`${URLBASE}/evaluaciones/disponible`, {
    //       params: { idColaborador: user?.colaboradores?.colaboradores.map((colaborador) => colaborador.idUsuario), idEvaluador: user.user.idUsuario }
    //     });
    //     console.log(respuesta.data?.disponible)

    //     if (respuesta.status === 200) {
    //       setDisponible(respuesta.data?.disponible);
    //     } else {
    //       toast.error("Error al obtener la disponibilidad.");
    //     }
    //   } catch (error) {
    //     console.error("Error en la petición:", error);
    //     toast.error("Ocurrió un error al verificar la disponibilidad.");
    //   }
    // };
    // getDisponible()

  }, [user?.user?.idUsuario]); // Se actualiza solo cuando `idUsuario` cambia

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Lista de colaboradores a Evaluar</h1>
      {/* Listar colaboradores si los hay */}
      {user?.colaboradores?.colaboradores?.length > 0 ? (
        user?.colaboradores?.colaboradores.map((colaborador) => (
          <div key={colaborador.idUsuario} className="border p-4 mb-4 rounded-lg">
            {/* Detalles del colaborador */}
            <div className="flex mb-4 justify-between">
              <h2 className="text-xl font-semibold">{colaborador.nombre}</h2>
              <p className="text-gray-700">{colaborador.cargo}</p>
              <p className="text-gray-700">{colaborador.Empresas.length > 0 ? colaborador.Empresas.map(empresa => (<span>{empresa.nombre} </span>)) : "❌"}</p>
              <div className="flex gap-4 mt-2">

                <button
                  onClick={() => evaluarColaborador('evaluacion', colaborador.idUsuario)}
                  className="bg-black text-white py-2 px-4 rounded-md"
                >
                  Evaluar
                </button>
                <button
                  className="bg-gray-500 text-white py-2 px-4 rounded-md"
                  onClick={() => evaluarColaborador('resultados', colaborador.idUsuario)}
                >
                  Ver resultados
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>
          <h2>No hay colaboradores asignados.</h2>
        </div>
      )}
    </div>
  );
};

export default Evaluar;
