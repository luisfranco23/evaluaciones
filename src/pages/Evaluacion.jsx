import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { URLBASE } from '../lib/actions';
import { useUser } from '../context/UserContext';
import ComentariosAcciones from '../components/ComentariosAcciones';
import { toast } from 'react-toastify';


const Evaluacion = () => {
  const [selectedValues, setSelectedValues] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [calificaciones, setCalificaciones] = useState([]);
  const [evaluacion, setEvaluacion] = useState([]);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Para controlar el modal de confirmación
  const { idUsuario } = useParams();
  const user = useUser();

  const evaluadorId = user?.user.idUsuario; // Evaluador siempre es el usuario actual

  const competencias = evaluacion?.Competencias || [];
  const competenciaActual = competencias[currentPage]; // Obtener la competencia actual

  const usuario = user?.colaboradores?.colaboradores.find(c => c.idUsuario == idUsuario) || user?.colaboradores || user?.user;
  const dataParams = {
    idEmpresa: usuario?.Empresas[0].idEmpresa || null,
    idNivelCargo: usuario?.idNivelCargo
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const calificacionesResponse = await axios.get(`${URLBASE}/respuestas/calificacion`);
        setCalificaciones(calificacionesResponse.data?.data || []);

        const evaluacionResponse = await axios.get(`${URLBASE}/evaluaciones`, {
          params: dataParams
        });
        setEvaluacion(evaluacionResponse.data?.data || []);
        setIsLoading(false);
      } catch (err) {
        console.log(er)
        toast.error("Ocurrio un error durante la obtención de los datos!");
      }
    };

    fetchData();
  }, [user]); // Dependiendo de 'user' para evitar re-renderizados innecesarios

  // Manejar la selección de calificación
  const handleRadioChange = (descriptorId, calificacionId) => {
    setSelectedValues(prevState => ({
      ...prevState,
      [descriptorId]: calificacionId,
    }));
  };

  const validatePage = () => {
    const descriptores = competencias[currentPage]?.Descriptores || [];
    return descriptores.every(descriptor => selectedValues[descriptor.idDescriptor]);
  };

  // Manejar el cambio de página
  const nextPage = () => {
    if (validatePage()) {
      if (currentPage < competencias.length - 1) {
        setCurrentPage(currentPage + 1);
      }
    } else {
      toast.error("Por favor, selecciona una respuesta para cada descriptor.");
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Mostrar el diálogo de confirmación antes de enviar
  const handleFinalizarClick = (e) => {
    e.preventDefault();
    if (validatePage()) {
      setShowConfirmDialog(true); // Mostrar el diálogo de confirmación
    } else {
      toast.error("Por favor, selecciona una respuesta para cada descriptor antes de finalizar.");
    }
  };

  // Confirmar el envío
  const confirmSubmit = async () => {
    const idEvaluacion = evaluacion.idEvaluacion; // ID de la evaluación actual
    const respuestas = Object.entries(selectedValues).map(([idDescriptor, idCalificacion]) => ({
      idDescriptor: parseInt(idDescriptor),
      idCalificacion,
      idEvaluacion,
      idColaborador: usuario.idUsuario,
      idEvaluador: evaluadorId, // Evaluador es el usuario actual
    }));

    try {
      await axios.post(`${URLBASE}/respuestas`, { respuestas });
      setCompleted(true); // Marcar como completado después de enviar
      setMostrarComentarios(true);
      setShowConfirmDialog(false); // Ocultar el diálogo de confirmación
    } catch (error) {
      console.log(error)
      toast.error("Error al enviar las respuestas!");
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center m-14 ">
      <h1 className="font-bold text-2xl">{`${evaluacion.nombre} - ${evaluacion.año}`}</h1>
      <p className="font-light">{`Evaluando a: ${usuario.nombre}`}</p>

      <form className="w-full" onSubmit={handleFinalizarClick}>
        {!completed ? (
          <div className="border-2 mt-4 p-2 rounded-lg w-full">
            {/* Renderización de la evaluación por competencias */}
            {currentPage < competencias.length ? (
              <>
                <div className="bg-gray-50 mt-2 pt-2 pb-2 text-center">
                  <h1 className="font-bold text-2xl">{competenciaActual?.nombre || 'Nombre de la competencia'}</h1>
                  <p className="italic">{competenciaActual?.tipoCompetencium?.nombre}</p>
                  <p className="italic m-4">{competenciaActual?.descripcion}</p>
                </div>

                {competenciaActual?.Descriptores?.map((descriptor) => (
                  <div key={descriptor.idDescriptor} className="w-full">
                    <div className="bg-gray-50 mt-1 items-center justify-center flex w-full">
                      <p className="font-semibold m-3">{descriptor.descripcion}</p>
                    </div>

                    <div className="bg-gray-50 mt-2 p-6 w-full flex gap-2 flex-col">
                      {calificaciones.sort((a, b) => b.valor - a.valor).map((calificacion) => {
                        const isSelected = selectedValues[descriptor.idDescriptor] === calificacion.idCalificacion;
                        return (
                          <div
                            key={calificacion.idCalificacion}
                            className={`cursor-pointer p-4 border-2 rounded-lg flex items-center space-x-2 ${isSelected ? 'border-black bg-blue-100 text-black' : 'border-gray-300'}`}
                            onClick={() => handleRadioChange(descriptor.idDescriptor, calificacion.idCalificacion)}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'bg-black' : 'border-gray-300'}`} />
                            <label className="cursor-pointer">{calificacion.valor} - {calificacion.descripcion}</label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Botones de navegación */}
                <div className="mt-4 mb-8 flex justify-between">
                  {currentPage > 0 && (
                    <button
                      type="button"
                      onClick={prevPage}
                      className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/80"
                    >
                      Atrás
                    </button>
                  )}
                  {!completed && (
                    currentPage === competencias.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleFinalizarClick}
                        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/80"
                      >
                        Finalizar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={nextPage}
                        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/80"
                      >
                        Siguiente
                      </button>
                    )
                  )}
                </div>
              </>
            ) : null}
          </div>
        ) : (
          mostrarComentarios && <ComentariosAcciones idColaborador={usuario?.idUsuario} idEvaluador={evaluadorId} idEvaluacion={evaluacion?.idEvaluacion} esEvaluador={!(usuario?.idUsuario === evaluadorId)} />
        )}
      </form>

      {/* Modal de confirmación */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">¿Confirmar el envío de la evaluación?</h2>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                onClick={confirmSubmit}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evaluacion;