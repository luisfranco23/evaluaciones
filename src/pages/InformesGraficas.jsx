import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { URLBASE } from '../lib/actions';
import { BarChartAdvance } from './GraficaAvances';

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

  return (
    <div className="p-4 mx-24 mt-5">
      <h1 className="text-3xl font-bold mb-4 text-zvioleta">Informes Gráficas</h1>
      <div className="flex gap-4 flex-col m-9">
        <BarChartAdvance data={data?.totalUsuariosSede} nombre={'Sedes'} />
        <BarChartAdvance data={data?.totalUsuariosEmpresa} nombre={'Empresas'} />
      </div>
    </div>
  );
};

export default InformesGraficas;
