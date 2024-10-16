import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronLeft, FaChevronRight, FaCheckCircle, FaHome, FaCog, FaSignOutAlt, FaClipboardCheck, FaUser, FaList, FaEdit, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useUser } from '../context/UserContext';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isAdminSubMenuOpen, setIsAdminSubMenuOpen] = useState(false); // Estado para controlar el submenú de administración
  const [idPerfil, setIdPerfil] = useState(null);
  const navigate = useNavigate();

  const user = useUser();

  const handleLogout = () => {
    Cookies.remove('token');
    user.setColaboradores(null)
    user.setUser(null)
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAdminSubMenu = () => {
    setIsAdminSubMenuOpen(!isAdminSubMenuOpen); // Alterna el estado del submenú
  };

  useEffect(() => {
    const perfil = user?.user.idPerfil;
    setIdPerfil(Number(perfil));
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Menú lateral fijo */}
      <nav className={`fixed h-full bg-black text-white transition-all duration-300 ease-in-out flex flex-col justify-between ${isMenuOpen ? 'w-64' : 'w-16'}`}>
        <div className="relative p-4 flex items-center justify-between">
          <span className={`text-xl font-bold transition-block duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
            {user?.user.sedes[0]?.nombre}
          </span>
          <button onClick={toggleMenu} className={`absolute top-1/2 transform -translate-y-1/2 text-white focus:outline-none hover:bg-gray-800 p-2 rounded-full transition-all duration-300 ${isMenuOpen ? '-right-3' : 'right-0'}`}>
            {isMenuOpen ? <FaChevronLeft size={20} /> : <FaChevronRight size={20} />}
          </button>
        </div>
        <span className={`text-sm ml-4 font-bold transition-block duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
          {user?.user.nombre}
        </span>

        {/* Opciones del menú */}
        <ul className="flex-1 space-y-4 mt-8">
          <li>
            <Link to="/home" className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors">
              <FaHome size={20} />
              <span className={`${!isMenuOpen && 'hidden'} transition-all duration-300`}>Home</span>
            </Link>
          </li>

          {/* Solo los evaluadores y administradores pueden ver "Evaluar" */}
          {idPerfil === 2 || idPerfil === 3 ? (
            <li>
              <Link to="/evaluar" className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors">
                <FaCheckCircle size={20} />
                <span className={`${!isMenuOpen && 'hidden'} transition-all duration-300`}>Evaluar</span>
              </Link>
            </li>
          ) : null}

          {/* Solo los administradores pueden ver los menús de administración */}
          {idPerfil === 3 ? (
            <>
              <li>
                <Link to="/informes/graficas" className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors">
                  <FaClipboardCheck size={20} />
                  <span className={`${!isMenuOpen && 'hidden'} transition-all duration-300`}>Informes</span>
                </Link>
              </li>

              {/* Menú principal de administración con submenú */}
              <li>
                <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer" onClick={toggleAdminSubMenu}>
                  <FaCog size={20} />
                  <span className={`${!isMenuOpen && 'hidden'} transition-all duration-300`}>Administración</span>
                  {/* Mostrar el ícono de desplegar/plegar */}
                  {isAdminSubMenuOpen ? (
                    <FaCaretUp size={16} className={`${!isMenuOpen && 'hidden'} transition-all duration-300`} />
                  ) : (
                    <FaCaretDown size={16} className={`${!isMenuOpen && 'hidden'} transition-all duration-300`} />
                  )}
                </div>

                {/* Submenú de administración desplegable */}
                {isAdminSubMenuOpen && (
                  <ul className="pl-6 space-y-2">
                    <li>
                      <Link to="/administrar/usuarios" className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors">
                        <FaUser size={20} />
                        <span className={`${!isMenuOpen && 'hidden'} transition-all duration-300`}>Usuarios</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/administrar/descriptores" className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors">
                        <FaList size={20} />
                        <span className={`${!isMenuOpen && 'hidden'} transition-all duration-300`}>Descriptores</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/administrar/evaluaciones" className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors">
                        <FaEdit size={20} />
                        <span className={`${!isMenuOpen && 'hidden'} transition-all duration-300`}>Evaluaciones</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/administrar/seguimiento" className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors">
                        <FaEdit size={20} />
                        <span className={`${!isMenuOpen && 'hidden'} transition-all duration-300`}>Seguimiento</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </>
          ) : null}

          {/* Cerrar sesión */}
          <li onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
            <FaSignOutAlt size={20} />
            <span className={`${!isMenuOpen && 'hidden'} transition-all duration-300`}>Cerrar sesión</span>
          </li>
        </ul>

        <div className="p-4">
          <button onClick={toggleMenu} className="mt-4 text-white hover:bg-gray-700 p-3 rounded-full focus:outline-none w-full flex justify-center transition-all duration-300">
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </nav>

      <div className={`ml-${isMenuOpen ? '64' : '16'} flex-1 overflow-auto h-full p-6 transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
