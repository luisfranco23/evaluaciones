import { useState, useEffect } from 'react';
import axios from 'axios'; // Para hacer peticiones HTTP
import { URLBASE } from '../lib/actions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Para la redirección

const ComentariosAcciones = ({ idEvaluacion, idEvaluador, idColaborador, esEvaluador }) => {
  const [comentariosGenerales, setComentariosGenerales] = useState('');
  const [accionesMejoramiento, setAccionesMejoramiento] = useState([]);
  const [competenciasFiltradas, setCompetenciasFiltradas] = useState([]);
  const [retroalimentacion, setRetroalimentacion] = useState(false);
  const navigate = useNavigate(); // Hook para navegar

  // Fetch competencias solo si es evaluador
  useEffect(() => {
    if (esEvaluador) {
      const obtenerDatos = async () => {
        try {
          const responseCompetencias = await axios.get(`${URLBASE}/respuestas`, { params: { idEvaluador, idColaborador, idEvaluacion} });
          setCompetenciasFiltradas(responseCompetencias.data?.evaluacion);
        } catch {
          toast.error("Ocurrió un error al obtener las competencias.");
        }
      };
      obtenerDatos();
    }
  }, [idColaborador, idEvaluador, esEvaluador, idEvaluacion]);

  // Manejar cambio en acciones de mejoramiento
  const handleAccionChange = (index, field, value) => {
    const nuevasAcciones = [...accionesMejoramiento];
    nuevasAcciones[index][field] = value;
    setAccionesMejoramiento(nuevasAcciones);
  };

  // Agregar una nueva acción de mejoramiento
  const agregarAccion = () => {
      setAccionesMejoramiento([...accionesMejoramiento, { idCompetencia: '', comentario: '', estado: '', fechaCumplimiento: '' }]);
  };

  // Manejo de envío de datos
  const submitComentarios = async () => {
    try {
      // Guardar comentarios generales
      const payload = {
        idEvaluacion,
        idEvaluador,
        idColaborador,
        comentario: comentariosGenerales,
        accionesMejoramiento: esEvaluador ? accionesMejoramiento : [],
        retroalimentacion
      };

      const response = await axios.post(`${URLBASE}/evaluaciones/comentarios`, payload);

      if (response.status === 200) {
        const idEvalRealizada = response.data?.data?.idEvalRealizada;

        toast.success("Comentarios guardados con éxito!");

        if (esEvaluador && comentariosGenerales.length > 0) {
          for (const accion of accionesMejoramiento) {
            const compromisoPayload = {
              idCompetencia: accion.idCompetencia,
              idEvalRealizada, // Obtenido del comentario registrado
              comentario: accion.comentario,
              estado: accion.estado,
              fechaCumplimiento: accion.fechaCumplimiento
            };
            await axios.post(`${URLBASE}/evaluaciones/compromisos`, compromisoPayload);
          }
          toast.success("Compromisos guardados con éxito!");
        }
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else {
        toast.error('Ya has agregado un comentario!');
      }
    } catch {
      toast.error("Ocurrió un error en la comunicación con el servidor.");
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    }
  };

  return (
    <div className="m-12">
      <h2 className="text-lg font-bold text-znaranja">Comentarios Generales</h2>
      <textarea
        className="border w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zvioleta/90"
        placeholder="Escribe tus comentarios..."
        value={comentariosGenerales}
        required
        onChange={(e) => setComentariosGenerales(e.target.value)}
      />

      {esEvaluador && (
        <>
          <h2 className="text-lg font-bold mt-4 text-znaranja">Acciones de Mejoramiento</h2>
          {accionesMejoramiento.map((accion, index) => (
            <div key={index} className="mt-2">
              <select
                className="border w-full p-2 rounded-md"
                value={accion.idCompetencia}
                onChange={(e) => handleAccionChange(index, 'idCompetencia', e.target.value)}
              >
                <option value="">Selecciona una competencia</option>
                {
                  competenciasFiltradas.map(competencia => (
                    competencia.promedio < 3.5 ? 
                    <option key={competencia.idCompetencia} value={competencia.idCompetencia}>{`${competencia.nombre} - (${competencia.promedio.toFixed(1)})`}</option>
                    : null
                  ))
                }
              </select>
              <textarea
                className="border w-full p-2 mt-2 rounded-md"
                placeholder="Describe la acción de mejoramiento..."
                value={accion.comentario}
                required
                onChange={(e) => handleAccionChange(index, 'comentario', e.target.value)}
              />
              <select
                className="border w-full p-2 mt-2 rounded-md"
                value={accion.estado}
                onChange={(e) => handleAccionChange(index, 'estado', e.target.value)}
              >
                <option value="">Selecciona el estado</option>
                <option value="En curso">En curso</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Por iniciar">Por iniciar</option>
              </select>
              <input
                type="date"
                className="border w-full p-2 mt-2 rounded-md"
                value={accion.fechaCumplimiento}
                onChange={(e) => handleAccionChange(index, 'fechaCumplimiento', e.target.value)}
              />
            </div>
          ))}
          <button onClick={agregarAccion} className="bg-zvioleta text-white p-2 rounded-md mt-4">
            Agregar Acción
          </button>
        </>
      )}

      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          checked={retroalimentacion}
          onChange={(e) => setRetroalimentacion(e.target.checked)}
        />
        <label className="ml-2">Confirmo que he realizado la retroalimentación</label>
      </div>

      <button onClick={submitComentarios} className="bg-zvioleta hover:bg-zvioleta/90 hover:scale-105 text-white p-2 rounded-md mt-4">
        Finalizar
      </button>
    </div>
  );
};

export default ComentariosAcciones;
