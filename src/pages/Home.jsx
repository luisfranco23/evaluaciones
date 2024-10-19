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
                    params: { idColaborador: user?.user.idUsuario, idEvaluador: user?.user.idUsuario }
                });

                if (respuesta.status === 200) {
                    setDisponible(respuesta.data?.disponible);
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
        return <div className="text-center mt-5">Cargando...</div>; // Mensaje de carga
    }

    return (
        <div className="flex flex-col gap-2 my-5 mx-10 bg-gray-50 w-auto">
            <h1 className="font-bold text-center mb-4 mt-5 text-2xl">Bienvenidos al módulo de evaluaciones</h1>
            <p><span>Cordial saludo,</span> Te damos la bienvenida a la evaluación de desempeño 2024 y te invitamos a participar activamente desde tu rol.</p>
            <p>El objetivo de esta evaluación es valorar las competencias que nos hacen competitivos como organización, a fin de identificar nuestras fortalezas como colaboradores y equipos de trabajo, así como para evidenciar temas que debamos intervenir mediante planes de mejoramiento individuales o grupales.</p>
            <p>Este año vamos a tener dos componentes:</p>
            <ol className="list-decimal ml-5">
                <li>Evaluación de Jefe Inmediato</li>
                <li>Autoevaluación</li>
            </ol>
            <p>Por lo que si eres líder debes evaluar y retroalimentar las personas a tu cargo, además de realizar tu autoevaluación; y si eres colaborador, debes diligenciar tu autoevaluación.</p>
            <p>A continuación, vas a encontrar las competencias y responsabilidades junto con los comportamientos que las componen, para que califiques en qué medida se están cumpliendo las expectativas acordes al rol que desempeña el evaluado.</p>
            <div className="flex justify-between mt-9">
                <p>Lo anterior teniendo en cuenta con la siguiente escala de calificación</p>
                <img
                    src={rankEval}
                    className="hidden md:block w-[500px]"
                    alt="rank de evaluación"
                />
            </div>
            <div className="flex justify-end gap-3 my-6">

                <button
                    onClick={() => evaluarColaborador("resultados", user.user.idUsuario)}
                    className="flex items-center gap-5 self-start rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black/80 md:text-base"
                >
                    <span>Ver resultados</span>
                </button>
                {
                    disponible ? (
                        <button
                            onClick={() => evaluarColaborador("evaluacion", user.user.idUsuario)}
                            className="flex items-center gap-5 self-start rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-black/80 md:text-base"
                        >
                            <span>Iniciar</span> <FiArrowRight className="w-5 md:w-6" />
                        </button>
                    ): null
                }
            </div>
        </div>
    );
};

export default Home;
