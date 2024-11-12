import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { URLBASE } from '../lib/actions';
import GraficaAvances from './GraficaAvances';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InformesGraficas = () => {
  const [data, setData] = useState();

  useEffect(() => {
    axios.get(`${URLBASE}/informes/grafica/all`)
      .then(res => setData(res.data?.data))
      .catch(err => console.log(err));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  // Organizar los datos de "totalRespuestasPorSede" y "totalUsuariosPorSede"
  const sedeNames = data.totalUsuariosPorSede.map(item => item.nombre);
  const totalRespuestas = data.totalRespuestasPorSede.map(item => item.total);
  const totalUsuariosPorSede = data.totalUsuariosPorSede.map(item => item.total);

  // Organizar los datos de "totalRespuestasPorEmpresa" y "totalUsuariosPorEmpresa"
  const empresaNames = data.totalUsuariosPorEmpresa.map(item => item.nombre);
  const totalRespuestasPorEmpresa = data.totalRespuestasPorEmpresa.map(item => item.total);
  const totalUsuariosPorEmpresa = data.totalUsuariosPorEmpresa.map(item => item.total);

  // Datos para el gráfico de barras (comparación de respuestas vs usuarios por sede)
  const barChartDataSede = {
    labels: sedeNames,
    datasets: [
      {
        label: 'Respuestas por Sede',
        data: totalRespuestas,
        backgroundColor: '#00B094',
        borderColor: '#00B094',
        borderWidth: 1,
      },
      {
        label: 'Usuarios por Sede',
        data: totalUsuariosPorSede,
        backgroundColor: '#FF5F3F',
        borderColor: '#FF5F3F',
        borderWidth: 1,
      },
    ],
  };

  const barChartDataEmpresa = {
    labels: empresaNames,
    datasets: [
      {
        label: 'Respuestas por Empresa',
        data: totalRespuestasPorEmpresa,
        backgroundColor: '#FF5F3F',
        borderColor: '#FF5F3F',
        borderWidth: 1,
      },
      {
        label: 'Usuarios por Empresa',
        data: totalUsuariosPorEmpresa,
        backgroundColor: '#80006A',
        borderColor: '#80006A',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 mx-24 mt-5">
      <h1 className="text-3xl font-bold mb-4 text-zvioleta">Informes Gráficas</h1>
      <div className="grid grid-cols-1 gap-4">
        
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Respuestas vs Usuarios por Sede</h2>
          <Bar data={barChartDataSede} height={200} />
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Respuestas vs Usuarios por Empresa</h2>
          <Bar data={barChartDataEmpresa} height={200} />
        </div>
      </div>
      {/* <div className='w-3/6'>
        <GraficaAvances />
      </div> */}
    </div>
  );
};

export default InformesGraficas;
