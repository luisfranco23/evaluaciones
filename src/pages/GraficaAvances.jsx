import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartdata = [
  { date: "Jan 23", SolarPanels: 2890, Inverters: 2338 },
  { date: "Feb 23", SolarPanels: 2756, Inverters: 2103 },
  { date: "Mar 23", SolarPanels: 3322, Inverters: 2194 },
  { date: "Apr 23", SolarPanels: 3470, Inverters: 2108 },
  { date: "May 23", SolarPanels: 3475, Inverters: 1812 },
  { date: "Jun 23", SolarPanels: 3129, Inverters: 1726 },
  { date: "Jul 23", SolarPanels: 3490, Inverters: 1982 },
  { date: "Aug 23", SolarPanels: 2903, Inverters: 2012 },
  { date: "Sep 23", SolarPanels: 2643, Inverters: 2342 },
  { date: "Oct 23", SolarPanels: 2837, Inverters: 2473 },
  { date: "Nov 23", SolarPanels: 2954, Inverters: 3848 },
  { date: "Dec 23", SolarPanels: 3239, Inverters: 3736 },
];

const GraficaAvances = () => (
  <div className="p-4">
    <h2 className="text-lg font-semibold mb-2">Avances Mensuales</h2>
    <ResponsiveContainer width="100%" aspect={2}>
      <BarChart
        data={chartdata}
        // margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        type={"percent"}
      >
        <CartesianGrid strokeDasharray="4 1 2" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="SolarPanels" fill="#A65C99" />
        <Bar dataKey="Inverters" fill="#FFB5A6" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default GraficaAvances;
