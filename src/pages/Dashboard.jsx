import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { URLBASE } from "../lib/actions";
import { BarChartPromedio, LineChartPromedio, PieChartCumplimiento } from "../pages/GraficaAvances";
import { Card } from "antd";
import Loading from "./Loading";
import { useUser } from "../context/UserContext";
import { desviacionEstandar } from "../lib/utils";
import { toast } from "react-toastify";

const DashboardUI = () => {
  const [competencias, setCompetencias] = useState([]);
  const [promediosUsuario, setPromediosUsuario] = useState([]);
  const [cubrimiento, setCubrimiento] = useState([]);
  const [calificaciones, setCalificaciones] = useState([]);
  const [empresas, setEmpresas] = useState({})
  const [isLoading, setIsLoading] = useState(true); // Estado para cargar datos
  const [evaluaciones, setEvaluaciones] = useState([])
  const [infoSelect, setInfoSelect] = useState([])
  const idEvaluacion = useRef(null)
  const idNivelCargo = useRef(null)
  const area = useRef(null)
  const idSede = useRef(null)
  const idEmpresa = useRef(null)

  const user = useUser()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [calificacionesRes, empresasRes, evaluacionesRes] = await Promise.all([
          axios.get(`${URLBASE}/respuestas/calificacion`),
          axios.get(`${URLBASE}/usuarios/empresassedes`, { params: { idUsuario: user?.user.idUsuario } }),
          axios.get(`${URLBASE}/evaluaciones/gestionar`)
        ]);
        setEmpresas(empresasRes.data?.data || [])
        setCalificaciones(calificacionesRes.data?.data || []);
        setEvaluaciones(evaluacionesRes.data?.data || []);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.user?.idUsuario]);


  const dataPie = cubrimiento.totalUsuariosEmpresa?.flatMap(item => [
    { value: item.Evaluacion, name: "Respuestas" },
    { value: item.Usuarios, name: "Usuarios" },
    { ...item }
  ])

  const resultado = promediosUsuario.reduce(
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


  const dataPieSede = cubrimiento.totalUsuariosSede?.flatMap(item => [
    { value: item.Evaluacion, name: "Respuestas" },
    { value: item.Usuarios, name: "Usuarios" },
    { ...item }
  ])

  const handleChangeEmpresa = async () => {
    try {
      setIsLoading(true)
      const [competenciasRes, cubrimientoRes] = await Promise.all([
        axios.get(`${URLBASE}/informes/resultados`, {
          params: { idEmpresa: idEmpresa.current.value, idEvaluacion: idEvaluacion.current.value, idNivelCargo: idNivelCargo.current.value, area: area.current.value, idSede: idSede.current.value },
        }),
        axios.get(`${URLBASE}/informes/grafica/all`, { params: { idEmpresa: idEmpresa.current.value, idEvaluacion: idEvaluacion.current.value, idNivelCargo: idNivelCargo.current.value, area: area.current.value, idSede: idSede.current.value } }),
      ])
      setCubrimiento(cubrimientoRes.data?.data || [])
      setCompetencias(competenciasRes.data?.data || []);
      setPromediosUsuario(competenciasRes.data?.informe || []);
      setInfoSelect(competenciasRes.data?.dataSelect || []);
    } catch (error) {
      console.log(error.response.data.message)
      toast.error(`Ups! ${error.response.data.message}`, {position: "top-right", toastId: "error"});
    } finally {
      setIsLoading(false)
    }
  };


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



  const empresasOrdenadas = useMemo(() => {
    return empresas?.Empresas?.sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [empresas])

  const sedesOrdenadas = useMemo(() => {
    return empresas?.Sedes?.sort((a, b) => a.nombre.localeCompare(b.nombre))}, [empresas])

  return (
    <>
    <Loading loading={isLoading} />
    <div className="m-10">
      <h1 className="text-zvioleta text-3xl font-bold text-center my-5">
        Dashboard resultados
      </h1>
      <div className="flex flex-col md:flex-row md:gap-4 gap-2">
        <select ref={idEvaluacion} className="w-80 border-gray-300 rounded-md" name="evaluacion" id="id-evaluacion" >
          <option selected disabled>Seleccione...</option>
          {evaluaciones.map((evaluacion, index) => (
            <option key={index} value={evaluacion.idEvaluacion}>{`${evaluacion.nombre} ${evaluacion.año}`}</option>
          ))}
        </select>
        <select ref={idEmpresa} className="w-80 border-gray-300 rounded-md" name="evaluacion" id="id-evaluacion" >
          <option selected value="">Seleccione...</option>
          {empresasOrdenadas?.map((empresa, index) => (
            <option key={index} value={empresa.idEmpresa}>{empresa.nombre}</option>
          ))}
        </select>
        <select ref={idSede} className={`border-gray-300 rounded-md w-80`} name="evaluacion" id="id-evaluacion" >
          <option selected value="">Seleccione...</option>
          {sedesOrdenadas.map((sede, index) => (
            <option key={index} value={sede.idSede}>{sede.nombre}</option>
          ))}
        </select>
        <select ref={area} className="w-80 border-gray-300 rounded-md" name="evaluacion" id="id-evaluacion" >
          <option selected value="">Seleccione...</option>
          {infoSelect?.areas?.map((area, index) => (
            <option key={index} value={area}>{area}</option>
          ))}
        </select>
        <select ref={idNivelCargo} className="w-80 border-gray-300 rounded-md" name="evaluacion" id="id-evaluacion" >
          <option selected value="">Seleccione...</option>
          {infoSelect?.niveles?.map((niveles) => (
            <option key={niveles.idNivelCargo} value={niveles.idNivelCargo}>{niveles.nombre}</option>
          ))}
        </select>
        <button className="bg-zvioleta py-2 px-10 rounded-lg text-white hover:scale-105 shadow-md" onClick={handleChangeEmpresa}>Consultar</button>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
        <PieChartCumplimiento nombre={dataPie?.length > 0 ? 'Cubrimiento' : null} data={cubrimiento?.totalUsuariosEmpresa?.length == 1 ? dataPie : dataPieSede} />
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
    </>
  );
};

export default DashboardUI;