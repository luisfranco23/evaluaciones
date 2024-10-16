import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Evaluacion from './pages/Evaluacion';
import Evaluar from './pages/Evaluar';
import ProtectedLayout from './components/ProtectedLayout';
import Resultados from './pages/Resultados';
import Home from './pages/Home';
import InformesGraficas from './pages/InformesGraficas';
import ComentariosAcciones from './components/ComentariosAcciones';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Usuarios from './pages/Usuarios'; // Importa el componente de Usuarios
// import Descriptores from './pages/Descriptores'; // Importa el componente de Descriptores
// import Evaluaciones from './pages/Evaluaciones'; // Importa el componente de Evaluaciones

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
        </Route>

        {/* Solo para evaluadores y administradores */}
        <Route element={<ProtectedLayout allowedProfiles={[2, 3]} />}>
          <Route path="/evaluar" element={<Evaluar />} />
          <Route path="/informes/graficas" element={<InformesGraficas />} />
        </Route>
        <Route element={<ProtectedLayout allowedProfiles={[3]} />}>

          {/* Rutas de administración */}
          <Route path="administrar">
            {/* <Route path="usuarios" element={<Usuarios />} /> {/* Subruta relativa */}
            {/* <Route path="descriptores" element={<Descriptores />} />
            <Route path="evaluaciones" element={<Evaluaciones />} />  */}
            <Route path="seguimiento" element={<ComentariosAcciones />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;