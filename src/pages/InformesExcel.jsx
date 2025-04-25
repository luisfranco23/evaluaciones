import { useEffect, useMemo, useRef, useState } from "react"
import InformeResultados from "./InformeResultados"
import InformeResultadosDetalle from "./InformeResultadosDetalle"
import axios from "axios"
import { URLBASE } from "../lib/actions"
import { useUser } from "../context/UserContext"
import { toast } from "react-toastify"

export const InformesExcel = () => {
  const [report, setReport] = useState(0)
  const [evaluaciones, setEvaluaciones] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [changeSelect, setChangeSelect] = useState(false)
  const idEvaluacion = useRef(null)
  const idSede = useRef(null)
  const idEmpresa = useRef(null)

  const user = useUser()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evaluacionesRes, empresasRes] = await Promise.all([
          axios.get(`${URLBASE}/evaluaciones/gestionar`),
          axios.get(`${URLBASE}/usuarios/empresassedes`, { params: { idUsuario: user?.user.idUsuario } })
        ]);
        setEvaluaciones(evaluacionesRes.data?.data || []),
          setEmpresas(empresasRes.data?.data || [])
      } catch (e) {
        toast.error("Ocurrio un error al cargar los datos", e)
      }
    }
    fetchData()
  }, [user])

  const empresasOrdenadas = useMemo(() => {
    return empresas?.Empresas?.sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [empresas])

  const sedesOrdenadas = useMemo(() => {
    return empresas?.Sedes?.sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [empresas])

  return (
    <div className={`mt-5 ml-20`}>
      <div className="flex gap-4 items-end text-gray-800 flex-col sm:flex-row">
        <div className="flex flex-col">
          <label htmlFor="id-evaluacion">Evaluación</label>
          <select ref={idEvaluacion} className="w-80 border-gray-300 rounded-md" name="evaluacion" id="id-evaluacion" >
            <option disabled selected>Seleccione...</option>
            {evaluaciones.map((evaluacion, index) => (
              <option key={index} value={evaluacion.idEvaluacion}>{`${evaluacion.nombre} ${evaluacion.año}`}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="id-empresa">Empresa</label>
          <select ref={idEmpresa} className="w-80 border-gray-300 rounded-md" name="evaluacion" id="id-empresa" >
            <option selected value="">Seleccione...</option>
            {empresasOrdenadas?.map((empresa, index) => (
              <option key={index} value={empresa.idEmpresa}>{empresa.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="id-sede">Sede</label>
          <select ref={idSede} className="w-80 border-gray-300 rounded-md" name="evaluacion" id="id-sede" >
            <option selected value="">Seleccione...</option>
            {sedesOrdenadas?.map((sede, index) => (
              <option key={index} value={sede.idSede}>{sede.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="id-tipo">Tipo reporte</label>
          <select className="w-80 border-gray-300 rounded-md" name="tipo-evaluacion" id="id-tipo" onChange={(e) => setReport(e.target.value)} >
            <option disabled selected>Seleccione...</option>
            <option value="1">Informe resultados</option>
            <option value="2">Informe resultados detalle</option>
          </select>
        </div>
        <button className="bg-zvioleta py-2 px-10 rounded-lg text-white hover:scale-105 shadow-md" onClick={() => setChangeSelect(prev => !prev)}>Consultar</button>
      </div>
      {
        report == 1 ? <InformeResultados changeSelect={changeSelect} idEvaluacion={idEvaluacion.current.value} idEmpresa={idEmpresa.current.value} idSede={idSede.current.value} /> : report == 2 ? <InformeResultadosDetalle idEvaluacion={idEvaluacion.current.value} changeSelect={changeSelect} idEmpresa={idEmpresa.current.value} idSede={idSede.current.value} /> : null
      }
    </div>
  )
}
