import { useState, useEffect } from 'react';
import axios from 'axios'; // Para hacer peticiones HTTP
import { URLBASE } from '../lib/actions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Para la redirección
import PropTypes from 'prop-types'

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
          const responseCompetencias = await axios.get(`${URLBASE}/respuestas`, { params: { idEvaluador, idColaborador, idEvaluacion } });
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

  const competencias = competenciasFiltradas.filter(competencia => competencia.promedio < 3.4)

  const pass = (esEvaluador && retroalimentacion) && (
    (competencias.length >= 3 && accionesMejoramiento.length >= 3) || 
    (competencias.length <= 3 && accionesMejoramiento.length === competencias.length)
  )
  // Manejo de envío de datos
  const submitComentarios = async () => {
    const puedeEnviar = comentariosGenerales.length > 0 && (!esEvaluador || pass);
    if (puedeEnviar) {
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

          toast.success("Comentarios guardados con éxito!", {position: 'top-center', toastId: 'comentarios-id-succes'});

          if (!esEvaluador) {
            navigate("/home")
            return
          }

          if (pass) {
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
            toast.success("Compromisos guardados con éxito!", {position: 'top-center',toastId: 'err-id-mejoramiento'});
            setTimeout(() => {
              navigate("/home")
            }, 1500);
          }else{
            toast.error('Debes registrar las acciones de mejoramiento!', {position: 'top-center', toastId: 'err-id-mejoramiento'})
          }
        } else {
          toast.error('Ya has agregado un comentario!', {position: 'top-center',toastId: 'err-id-mejoramiento'});
        }
      } catch {
        toast.error("Ocurrió un error en la comunicación con el servidor.");
      }
    } else {
      toast.error("Debes llenar los comentarios", {position: 'top-center',toastId: 'err-id-mejoramiento'})
    }
  };

  return (
    <div className="my-12 mx-auto max-w-4xl">
      <h2 className="text-lg font-bold text-zvioleta">Comentarios Generales</h2>
      <p className='mt-2'>Comentario <span className='text-red-600 font-bold'>*</span></p>
      <textarea
        className={`border w-full p-2 rounded-md focus:ring-1 focus:ring-znaranjaclaro focus:border-znaranjaclaro`}
        placeholder="Escribe tus comentarios..."
        value={comentariosGenerales}
        required
        onChange={(e) => setComentariosGenerales(e.target.value)}
      />

      {esEvaluador && (
        <>
          <h2 className="text-lg font-bold mt-4 text-zvioleta">Acciones de Mejoramiento</h2>
          {accionesMejoramiento.map((accion, index) => (
            <div key={index} className="mt-2 flex flex-col gap-3 border-b-2">
              <p className='-mb-2 mt-2'>Competencia <span className='text-red-600 font-bold'>*</span></p>
              <select
                className="border w-full rounded-md focus:ring-1 focus:ring-znaranjaclaro focus:border-znaranjaclaro"
                value={accion.idCompetencia}
                required
                onChange={(e) => handleAccionChange(index, 'idCompetencia', e.target.value)}
              >
                <option value="">Selecciona una competencia</option>
                {
                  competencias.map(competencia => (
                      <option key={competencia.idCompetencia} value={competencia.idCompetencia}>{`${competencia.nombre} (${competencia.promedio.toFixed(1)})`}</option>
                  ))
                }
              </select>
              <p className='-mb-2 mt-2'>Descripción <span className='text-red-600 font-bold'>*</span></p>
              <textarea
                className="border w-full rounded-md focus:ring-1 focus:ring-znaranjaclaro focus:border-znaranjaclaro"
                placeholder="Describe la acción de mejoramiento..."
                value={accion.comentario}
                required
                onChange={(e) => handleAccionChange(index, 'comentario', e.target.value)}
              />
              <p className='-mb-2'>Estado <span className='text-red-600 font-bold'>*</span></p>
              <select
                className="border w-full rounded-md focus:ring-1 focus:ring-znaranjaclaro focus:border-znaranjaclaro"
                value={accion.estado}
                required
                onChange={(e) => handleAccionChange(index, 'estado', e.target.value)}
              >
                <option value="" className=''>Selecciona el estado</option>
                <option value="En curso">En curso</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Por iniciar">Por iniciar</option>
              </select>
              <p className='-mb-2'>Fecha de cumplimiento <span className='text-red-600 font-bold'>*</span></p>
              <input
                type="date"
                required
                className="border w-full rounded-md focus:ring-1 focus:ring-znaranjaclaro focus:border-znaranjaclaro mb-7"
                value={accion.fechaCumplimiento}
                onChange={(e) => handleAccionChange(index, 'fechaCumplimiento', e.target.value)}
                title='Fecha del compromiso'
              />
            </div>
          ))}
          <button onClick={agregarAccion} disabled={competencias.length === accionesMejoramiento.length} className={`bg-zvioleta text-white p-2 rounded-md mt-4 ${competencias.length === accionesMejoramiento.length ? 'cursor-not-allowed': null}`} >
            Agregar Acción
          </button>
          <div className="my-6 mt-10 flex items-center">
            <input
              type="checkbox"
              id="retroalimentacion-checkbox"
              checked={retroalimentacion}
              onChange={(e) => setRetroalimentacion(e.target.checked)}
              className="h-5 w-5 rounded-lg appearance-none border-znaranja focus:ring-zvioleta text-znaranja"
            />
            <label htmlFor="retroalimentacion-checkbox" className="ml-2">
              Confirmo que he realizado la retroalimentación
            </label>
          </div>
        </>

      )}
      <button onClick={submitComentarios} className="bg-zvioleta hover:bg-zvioleta/90 hover:scale-105 text-white p-2 rounded-md mt-4">
        Guardar y finalizar
      </button>
    </div>
  );
};

ComentariosAcciones.propTypes = {
  idEvaluacion: PropTypes.number,
  idEvaluador: PropTypes.number,
  idColaborador: PropTypes.number,
  esEvaluador: PropTypes.bool
};
export default ComentariosAcciones;
