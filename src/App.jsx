import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Evaluacion from './pages/Evaluacion';
import Evaluar from './pages/Evaluar';
import ProtectedLayout from './components/ProtectedLayout';
import Resultados from './pages/Resultados';
import Home from './pages/Home';
import InformesGraficas from './pages/InformesGraficas';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Usuarios from './pages/Admin/Usuarios';
import NotFound from './pages/NotFound';
import Seguimiento from './pages/Seguimiento';
import AdmEvaluacion from './pages/Admin/AdmEvaluacion';
import TablaAvancesUI from './pages/TablaAvancesUI';
import Descriptores from './pages/Admin/Descriptores';
import DashboardUI from './pages/Dashboard';
import InformeAccionesMejora from './pages/InformeAccionesMejora';
import { InformesExcel } from './pages/InformesExcel';
import InformeDetalleGrupo from './pages/InformeDetalleGrupo';
import DashboardUser from './pages/DashboardUser';


function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Ruta principal: Login */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas con Layout */}
        <Route element={<ProtectedLayout allowedProfiles={[1, 2, 3]} />}>
          {/* Rutas generales */}
          <Route path="/home" element={<Home />} />
          <Route path="/evaluacion/:idUsuario" element={<Evaluacion />} />
          <Route path="/resultados/:idUsuario" element={<Resultados />} />
          <Route path="/seguimiento/:idUsuario" element={<Seguimiento />} />
          <Route path="/informes/resultado/usuario" element={<InformeDetalleGrupo />} />
          <Route path="/DashboardUser" element={<DashboardUser />} />
        </Route>

        {/* Solo para evaluadores y administradores */}
        <Route element={<ProtectedLayout allowedProfiles={[2, 3]} />}>
          <Route path="/evaluar" element={<Evaluar />} />
          <Route path="/informes/graficas" element={<InformesGraficas />} />
          <Route path="/informes/evaluadores" element={<TablaAvancesUI />} />
          <Route path="/informes/dashboard" element={<DashboardUI />} />
          <Route path="/informes/resultados" element={<InformesExcel />} />
          <Route path="/informes/acciones" element={<InformeAccionesMejora />} />
        </Route>
        <Route element={<ProtectedLayout allowedProfiles={[3]} />}>

          {/* Rutas de administración */}
          <Route path="administrar">
            <Route path="usuarios" element={<Usuarios />} /> Subruta relativa
            <Route path="descriptores" element={<Descriptores />} />
            <Route path="evaluaciones" element={<AdmEvaluacion />} /> 
            {/* <Route path="seguimiento" element={<ComentariosAcciones />} /> */}
          </Route>
        </Route>
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;