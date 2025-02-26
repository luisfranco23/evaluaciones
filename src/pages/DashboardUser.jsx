import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { URLBASE } from "../lib/actions";
import { BarChartPromedio, LineChartPromedio, PieChartCumplimiento } from "../pages/GraficaAvances";
import { Card } from "antd";
import Loading from "./Loading";
import { useUser } from "../context/UserContext";
import { desviacionEstandar } from "../lib/utils";

const DashboardUser = () => {
  const [competencias, setCompetencias] = useState([]);
  const [cubrimiento, setCubrimiento] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para cargar datos
  const [promediosUsuario, setPromediosUsuario] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([])
  const idEvaluacion = useRef(null)

  const user = useUser()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evaluacionesRes] = await Promise.all([
          axios.get(`${URLBASE}/evaluaciones/gestionar`)
        ]);
        setEvaluaciones(evaluacionesRes.data?.data || []);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.user?.idUsuario]);


  const dataPie = cubrimiento?.flatMap(item => [
    { value: item.Respuestas, name: "Respuestas" },
    { value: item.Usuarios, name: "Usuarios" },
    { ...item }
  ])


  const loadDataDashboard = async () => {
    try {
      const [calificacionesRes, competenciasRes, cubrimientoRes] = await Promise.all([
        axios.get(`${URLBASE}/respuestas/calificacion`),
        axios.get(`${URLBASE}/informes/resultados`, { params: { idEvaluador: user?.user?.idUsuario, idEvaluacion: idEvaluacion.current.value } }),
        axios.get(`${URLBASE}/informes/resultados/${user?.user?.idUsuario}`),
      ]);
      setCalificaciones(calificacionesRes.data?.data || []);
      setCubrimiento(cubrimientoRes.data?.data || [])
      setCompetencias(competenciasRes.data?.data || []);
      setPromediosUsuario(competenciasRes.data?.informe || []);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setIsLoading(false);
    }
  }


  const resultado = competencias.reduce(
    (acc, curr) => {
      if (curr.promedio > 3.5) {
        acc.totalSupera++;
      } else {
        acc.totalMenor++;
      }
      return acc;
    },
    { totalSupera: 0, totalMenor: 0 } // Inicialización del acumulador
  );

  //1. Lista de promedios de competencias
  const promedios = promediosUsuario.map((competencia) => competencia.promedio);
  const newCalificaciones = calificaciones.map(calificacion => calificacion.valor)
  //2. Con la lista de promedios debo calcular la desviación estandar
  const distribucion = desviacionEstandar(promedios, newCalificaciones)
  //3. Con la desviación estandar, el valor de las calificaciones y la media de las competencias debo calcular la distribución normal
  const calificacionesData = distribucion?.sort((a, b) => a.valor - b.valor)

  const porcentaje =
    resultado.totalMenor === 0
      ? 100
      : 100 - (resultado.totalMenor * 100) / resultado.totalSupera;


  const groupedData = useMemo(() => {
    return competencias.reduce((acc, curr) => {
      const existingGroup = acc.find((group) => group.tipo === curr.tipoCompetencia);
      if (existingGroup) {
        existingGroup.competencias.push({
          idCompetencia: curr.idCompetencia,
          nombre: curr.nombre,
          promedio: curr.promedio,
        });
      } else {
        acc.push({
          tipo: curr.tipoCompetencia,
          competencias: [
            {
              idCompetencia: curr.idCompetencia,
              nombre: curr.nombre,
              promedio: curr.promedio,
            },
          ],
        });
      }
      return acc;
    }, []);
  }, [competencias]);


  if (isLoading) {
    return <Loading />
  }



  return (
    <div className="m-10">
      <h1 className="text-zvioleta text-3xl font-bold text-center my-5">
        Dashboard equipo
      </h1>
      <div className="flex flex-col md:flex-row md:gap-4 gap-2 items-end text-gray-800">
        <div className="flex flex-col">
          <label htmlFor="id-evaluacion">Evaluación</label>
          <select ref={idEvaluacion} className="w-80 border-gray-300 rounded-md" name="evaluacion" id="id-evaluacion" >
            <option selected disabled>Seleccione...</option>
            {evaluaciones.map((evaluacion, index) => (
              <option key={index} value={evaluacion.idEvaluacion}>{`${evaluacion.nombre} ${evaluacion.año}`}</option>
            ))}
          </select>
        </div>
        <button className="bg-zvioleta py-2 px-10 rounded-lg text-white hover:scale-105 shadow-md h-10" onClick={loadDataDashboard}>Consultar</button>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
        <PieChartCumplimiento nombre={dataPie?.length > 0 ? 'Cubrimiento' : null} data={dataPie} />
        <LineChartPromedio data={calificacionesData} nombre={calificacionesData.length > 0 ? "Curva de Desempeño" : null} />
        <div className="flex flex-col items-center gap-10">
          <h2 className="text-znaranja font-bold text-xl">Índice de Desempeño:</h2>
          <Card className="bg-zvioletaopaco text-white text-center" >
            <p>{porcentaje.toFixed(1)}%</p>
            <p>Evaluaciones con resultado esperado y superior</p>
          </Card>
        </div>
        {groupedData.map((competencia, index) => (
          <BarChartPromedio
            key={competencia.tipo}
            nombre={competencia?.tipo}
            data={competencia.competencias}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardUser;