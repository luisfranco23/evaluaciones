import { Bar, BarChart, CartesianGrid, Cell, Line, Label, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PropTypes from 'prop-types';

export const BarChartAdvance = ({ data, nombre }) => {

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <p className="mx-auto font-mono text-xl">Avance por {nombre}</p>
        <ResponsiveContainer width="100%" aspect={2}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            stackOffset='sign'
          >
            <XAxis dataKey="nombre" angle={-8} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Usuarios" fill="#A65C99" stackId="a" />
            <Bar dataKey="Evaluacion" fill="#FFB5A6" stackId="a" />
            <Bar dataKey="Autoevaluacion" fill="#D7D7D7" stackId="a" />
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

export const BarChartPromedio = ({ data, nombre }) => {

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <p className="text-znaranja font-bold text-xl text-center">{nombre}</p>
        <ResponsiveContainer width="100%" aspect={2}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            stackOffset='stacked'
          >
            <XAxis dataKey="nombre" height={100} fontSize={15} tickFormatter={(value) => {
              return value.split(" ").join("\n");
            }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="promedio" fill="#A65C99" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

BarChartPromedio.propTypes = {
  data: PropTypes.array.isRequired,
  nombre: PropTypes.string.isRequired,
};


export const PieChartCumplimiento = ({ nombre, data }) => {

  const COLORS = ['#D7D7D7', "#A65C99",]

  const Respuestas = data?.map(item => item.Respuestas)?.filter(item => item != undefined && item != null).join(',')
  const Usuarios = data?.map(item => item.Usuarios)?.filter(item => item != undefined && item != null).join(',')
  const porcentaje = (Respuestas * 100) / Usuarios


  return (
    <ResponsiveContainer width="100%" aspect={2}>
      <div className="flex justify-center items-center flex-col">
        <h2 className="text-znaranja font-bold text-xl">{nombre}</h2>
        {
          data?.length > 0 ? (
            <>
              <p>Población total {Usuarios}</p>
              <p>Evaluados {Respuestas}</p>
            </>
          ) : null
        }
      </div>
      {/* paddingAngle={2} */}
      <PieChart width={600} height={300}>
        <Pie data={data} dataKey='value' label innerRadius="60%" outerRadius="80%" cx="50%" cy="50%">
          {
            data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))
          }
          <Label
            value={`${porcentaje.toFixed(1)}%`}
            position="center"
            fontSize="20"
            color="#80006A"
            fontWeight="bold"
            fill="#333"
          />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

PieChartCumplimiento.propTypes = {
  data: PropTypes.array.isRequired,
  nombre: PropTypes.string.isRequired,
};

export const LineChartPromedio = ({ nombre, data }) => {

  return (
    <ResponsiveContainer width='100%' aspect={2} >
      <h2 className="text-znaranja font-bold text-xl text-center">{nombre}</h2>
      <LineChart width={500} height={200} data={data} margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="valor" color="#FF5F3F" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="promedio" stroke="#80006A" fill="#80006A" />
      </LineChart>
    </ResponsiveContainer>
  )

}

LineChartPromedio.propTypes = {
  data: PropTypes.array,
  nombre: PropTypes.string.isRequired,
};