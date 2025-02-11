import { useEffect, useRef, useState } from "react"
import InformeResultados from "./InformeResultados"
import InformeResultadosDetalle from "./InformeResultadosDetalle"
import axios from "axios"
import { URLBASE } from "../lib/actions"

export const InformesExcel = () => {
  const [report, setReport] = useState(0)
  const [evaluaciones, setEvaluaciones] = useState([])
  const idEvaluacion = useRef(null)

  useEffect(() => {
    axios.get(`${URLBASE}/evaluaciones/gestionar`)
      .then(res => {
        setEvaluaciones(res.data?.data)
      })
      .catch(err => console.log(err))
  }, [])
  return (
    <div className={`mt-5 ml-20`}>
      <div className="flex gap-4">
        <select ref={idEvaluacion} className="w-80" name="evaluacion" id="id-evaluacion" >
          <option disabled selected>Seleccione...</option>
          {evaluaciones.map((evaluacion, index) => (
            <option key={index} value={evaluacion.idEvaluacion}>{`${evaluacion.nombre} ${evaluacion.año}`}</option>
          ))}
        </select>
        <select className="w-80" name="tipo-evaluacion" id="id-tipo" onChange={(e) => setReport(e.target.value)} >
          <option disabled selected>Seleccione...</option>
          <option value="1">Informe resultados</option>
          <option value="2">Informe resultados detalle</option>
        </select>
      </div>
      {
        report == 1 ? <InformeResultados idEvaluacion={idEvaluacion.current.value} /> : report == 2 ? <InformeResultadosDetalle idEvaluacion={idEvaluacion.current.value} /> : null
      }
    </div>
  )
}
