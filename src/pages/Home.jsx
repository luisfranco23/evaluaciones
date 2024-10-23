import React, { useEffect, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import rankEval from '../assets/evaluaciones.png';
import axios from 'axios';
import { URLBASE } from '../lib/actions';
import { toast } from 'react-toastify';

const Home = () => {
    const navigate = useNavigate();
    const user = useUser();
    const [disponible, setDisponible] = useState(true);
    const [loading, setLoading] = useState(true); // Estado de carga

    const evaluarColaborador = (path, idUsuario) => {
        navigate(`/${path}/${idUsuario}`);
    };

    useEffect(() => {
        const getDisponible = async () => {
            if (!user || !user.user) {
                toast.error("Usuario no encontrado.");
                return;
            }

            try {
                const respuesta = await axios.get(`${URLBASE}/evaluaciones/disponible`, {
                    params: { idColaborador: user?.user.idUsuario, idEvaluador: user?.user.idUsuario, idEvaluacion: 1 }
                });

                if (respuesta.status === 200) {
                    setDisponible(respuesta.data?.disponible);
                    toast.info(`Llevas el ${respuesta.data.cantidad.toFixed(1)}% de evaluaciones completadas.`, {position: "top-center", toastId: "percentage-id", autoClose: 10000})
                } else {
                    toast.error("Error al obtener la disponibilidad.");
                }
            } catch (error) {
                toast.error("Ocurrió un error al verificar la disponibilidad.");
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };

        getDisponible();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                {/* Un spinner elegante <Spinner />  */}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 mx-8 my-10 bg-white p-8 shadow-lg rounded-lg max-w-7xl">
            <div className="text-center">
                <h1 className="font-extrabold text-4xl text-gray-800 mb-2">
                    Bienvenido(a) {user.user.nombre.split(' ')[0]} al Módulo de Evaluaciones
                </h1>
                <p className="text-gray-600 text-lg">Evaluación de Desempeño 2024</p>
            </div>

            <p className="text-gray-700 text-base leading-relaxed mt-6">
                <span className="font-medium">Cordial saludo,</span> Te damos la bienvenida a la evaluación de desempeño 2024 y te invitamos a participar activamente desde tu rol.
                <p className='text-gray-700 text-base leading-relaxed mt-6'>
                El objetivo de esta evaluación es valorar las competencias que nos hacen competitivos como organización, a fin de identificar nuestras fortalezas como colaboradores y equipos de trabajo, así como para evidenciar temas que debamos intervenir mediante planes de mejoramiento individuales o grupales.
                </p>
            </p>

            <div className="mt-4 text-gray-700">
                <p className="text-base">Este año, la evaluación tendrá dos componentes:</p>
                <ul className="list-disc ml-5 mt-2 text-base space-y-1">
                    <li>Evaluación de Jefe Inmediato</li>
                    <li>Autoevaluación</li>
                </ul>
            </div>

            <p className="text-gray-700 leading-relaxed">
            Por lo que si eres líder debes evaluar y retroalimentar las personas a tu cargo, además de realizar tu autoevaluación; y si eres colaborador, debes diligenciar tu autoevaluación.
            </p>
            <p className="text-gray-700 leading-relaxed">
            A continuación, vas a encontrar las competencias y responsabilidades junto con los comportamientos que las componen, para que califiques en qué medida se están cumpliendo las expectativas acordes al rol que desempeña el evaluado.
            </p>

            <div className="relative rounded-lg shadow-lg bg-gradient-to-r from-gray-100 to-gray-200 p-6 flex items-center justify-between">
                <p className="text-gray-800 text-sm md:text-base">
                    Recuerda calificar las competencias y responsabilidades de tus evaluados
                    utilizando la siguiente escala de calificación:
                </p>
                <img src={rankEval} className="hidden md:block w-[450px] rounded-lg" alt="rank de evaluación" />
            </div>

            <div className="flex justify-end gap-4 mt-10">
                {/* Botón de resultados */}
                <button
                    onClick={() => evaluarColaborador("resultados", user.user.idUsuario)}
                    className="flex items-center gap-2 px-5 py-3 text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-300 rounded-lg shadow-md text-base font-semibold"
                >
                    <span>Ver Resultados</span>
                </button>

                {/* Botón para iniciar la evaluación */}
                {disponible && (
                    <button
                        onClick={() => evaluarColaborador("evaluacion", user.user.idUsuario)}
                        className="flex items-center gap-2 px-5 py-3 text-white bg-blue-600 hover:bg-blue-500 transition-colors duration-300 rounded-lg shadow-md text-base font-semibold"
                    >
                        <span>Iniciar Evaluación</span>
                        <FiArrowRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Home;
