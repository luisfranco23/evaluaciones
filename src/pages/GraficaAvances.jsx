import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PropTypes from 'prop-types';

export const BarChartAdvance = ({data, nombre}) => {
  
  return (
    <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-4">
          <p className="mx-auto font-mono text-xl">Avance por {nombre}</p>
          <ResponsiveContainer width="100%" aspect={2}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              stackOffset='stacked'
            >
              <XAxis dataKey="nombre" angle={-15} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Usuarios" fill="#A65C99" stackId="a" />
              <Bar dataKey="Respuestas" fill="#FFB5A6" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
};

BarChartAdvance.propTypes = {
  data: PropTypes.array.isRequired,
  nombre: PropTypes.string.isRequired,
};



// const GraficaAvances = () => (
//   <div className="p-4">
//     <h2 className="text-lg font-semibold mb-2">Avances Mensuales</h2>
//     <ResponsiveContainer width="100%" aspect={2}>
//       <BarChart
//         data={chartdata}
//         // margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//         type={"percent"}
//       >
//         <CartesianGrid strokeDasharray="4 1 2" />
//         <XAxis dataKey="date" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="SolarPanels" fill="#A65C99" />
//         <Bar dataKey="Inverters" fill="#FFB5A6" />
//       </BarChart>
//     </ResponsiveContainer>
//   </div>
// );

// export default GraficaAvances;