import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { URLBASE } from '../lib/actions';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';

const Resultados = () => {
  const { idUsuario } = useParams();
  const user = useUser();
  const [respuestas, setRespuestas] = useState({});
  const [calificaciones, setCalificaciones] = useState([])

  useEffect(() => {
    const fetchRespuestas = async () => {
      try {
        const respuesta = await axios.get(`${URLBASE}/respuestas`, { params: { idEvaluador: user.user?.idUsuario, idColaborador: usuario?.idUsuario, idEvaluacion: 1 } });
        setRespuestas(respuesta.data);

        const calificaciones = await axios.get(`${URLBASE}/respuestas/calificacion`, { withCredentials: true })
        setCalificaciones(calificaciones.data?.data)
      } catch {
        toast.error("Ocurrio un error al obtener los resultados!")
      }
    };

    fetchRespuestas();
  }, [idUsuario]);

  const formatearFecha = (fecha) => {
    if (!fecha) return 0
    const opciones = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    };
    return new Intl.DateTimeFormat('es-ES', opciones).format(new Date(fecha)).replace(',', '');
  };

  const usuario = user?.colaboradores?.colaboradores.find(c => c.idUsuario == idUsuario) || user?.colaboradores || user?.user;

  if (!respuestas || respuestas.evaluacion?.length === 0) {
    return <p className='text-center pt-10'>Aún no hay registros</p>
  }

  const calcularPromedio = (competencias) => {
    if (competencias?.length === 0) return 0
    const sumaPromedio =  competencias?.reduce((acc, curr) => acc + curr.promedio, 0)
    const promedio = sumaPromedio / competencias?.length
    return promedio.toFixed(1)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-7xl my-2 mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-zvioleta text-center my-5">{`Resultados de evaluación ${usuario?.nombre}`}</h1>

      {/* Estructura de tabla */}
      <table className='w-full flex flex-col '>
        <thead className=''>
          <tr className='grid border grid-cols-3 font-semibold justify-items-center items-center'>
            <th className='row-span-2'>
              <img className=' w-32 p-1 h-auto' src={usuario.Empresas[0].urlLogo} alt={`logo-empresa-${usuario.Empresas[0].nombre}`} />
            </th>
            <th className='border-b py-2'>VALORACION DE ATRIBUTOS</th>
            <th className='border-l px-4 row-span-2'>{`Versión: ${1}`}</th>
            <th>PROCESO: GESTIÓN HUMANA</th>
          </tr>
        </thead>
        <tbody className=''>
          <tr className='grid grid-cols-4 mt-4 border p-1'>
            <th className='border-b text-start'>Nombre del evaluado</th>
            <th className='border-b text-start'>Cargo</th>
            <th className='border-b text-start'>Fecha de ingreso</th>
            <th className='border-b text-start'>Periodo</th>
            <td className='border-b'>{usuario.nombre}</td>
            <td className='border-b'>{usuario.cargo}</td>
            <td className='border-b'>{formatearFecha(usuario.fechaIngreso)}</td>
            <td className='border-b'>Año 2024</td>
            <th className='text-start'>Nombre del evaluador</th>
            <td className='col-span-3'>{user.user.nombre}</td>
          </tr>
          <tr className='grid grid-cols-2 border mt-2'>
            <th className='col-span-2 text-start border-b'>Objetivo</th>
            <td className='col-span-2 pb-2'>El objetivo de esta evaluación es valorar las competencias que nos hacen competitivos como organización, a fin de identificar nuestras fortalezas como colaboradores y equipos de trabajo, así como para evidenciar temas que debamos intervenir mediante planes de mejoramiento individuales o grupales.</td>
          </tr>
          <tr className='grid grid-cols-4 mt-4 p-1 mb-4'>
            <th className='col-span-4 border font-bold my-3'>Escala de calificación</th>
            {
              calificaciones?.map(calificacion => (
                <>
                  <td className='col-span-3 p-1 border' key={calificacion.descripcion}>{calificacion.descripcion}</td>
                  <td className='text-center border' key={calificacion.valor}>{calificacion.valor}</td>
                </>
              ))
            }
          </tr>
          <tr className="mt-2 grid grid-cols-4">
            <th className="border border-gray-300 col-span-3 px-4 py-2 text-left">Competencia</th>
            <th className="border border-gray-300 px-4 py-2 col-span-1 text-left">Promedio</th>
          </tr>
          {respuestas?.evaluacion?.map(({index, nombre, promedio}) => {
            return (
              <tr key={index} className="grid grid-cols-4">
                <td className="border border-gray-300 px-4 py-2 col-span-3">
                  {nombre}
                </td>
                <td className="border border-gray-300 px-4 py-2 col-span-1 text-center">
                  {promedio.toFixed(1)}
                </td>
              </tr>
            );
          })}
          <tr className='grid  grid-cols-4 border my-1'>
            <th className='col-span-3'>PROMEDIO EVALUACIÓN</th>
            <th className='col-span-1 text-center'>{calcularPromedio(respuestas?.evaluacion)}</th>
          </tr>
          <tr className='grid  grid-cols-4 border my-1'>
            <th className='col-span-3'>PROMEDIO AUTOEVALUACIÓN</th>
            <th className='col-span-1 text-center'>{calcularPromedio(respuestas?.autoevaluacion)}</th>
          </tr>
          <tr className='grid grid-cols-1 border'>
            <th className='text-start'>Comentarios</th>
            {respuestas?.compromisos?.map(({index, TipoEvaluacione, comentario, Compromisos}) => (
              <>
              <td key={index} className='border'>{`${TipoEvaluacione.nombre}:  ${comentario}`}</td>
                {Compromisos?.map(compromiso => (
                  <>
                  <th className='text-start'>Compromiso</th>
                  <td>Competencia: {compromiso.Competencia.nombre}</td>
                  <td>Estado: {compromiso.comentario}</td>
                  <td>Estado: {compromiso.estado}</td>
                  <td>fecha de cumplimiento: {formatearFecha(compromiso.fechaCumplimiento)}</td>
                  </>

                ))}
              </>
              
            ))}
            {/* acá van los compromisis */}
          </tr>
          <tr className='grid grid-cols-2 border'>
            <th>Firma evaluador</th>
            <th>Firma evaluado</th>
            <td className='border h-16'></td>
            <td className='border'></td>
          </tr>
        </tbody>
        <tfoot className='border grid grid-cols-2 my-4'>
          <th>Fecha registro</th>
          <th>{formatearFecha(new Date())}</th>
        </tfoot>
      </table>
    </div>
  );
};

export default Resultados;
