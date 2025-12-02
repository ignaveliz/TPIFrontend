import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../../../shared/components/Button';
import useAuth from '../../../auth/hook/useAuth';

function Header({ searchTerm, setSearchTerm, handleSearch, onLogin, onRegister }) {
  const navigate = useNavigate();
  const { isAuthenticated, singout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    singout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    setIsMenuOpen(false);

    if (onLogin) onLogin();
    else navigate('/login');
  };

  const handleRegisterClick = () => {
    setIsMenuOpen(false);

    if (onRegister) onRegister();
    else navigate('/signup');
  };

  // ESTILOS: Links para Desktop (Píldora horizontal)
  const getDesktopLinkStyles = ({ isActive }) => (
    `
      block px-4 py-2 font-medium rounded-full transition text-center
      ${isActive
      ? 'bg-purple-100 text-purple-700'
      : 'text-gray-600 hover:bg-gray-100'
    }
    `
  );

  // ESTILOS: Links para Sidebar Móvil (Bloque tipo botón)
  const getSidebarLinkStyles = ({ isActive }) => (
    `
      block px-4 py-3 font-medium rounded-xl transition text-left mb-2 text-lg
      ${isActive
      ? 'bg-purple-100 text-purple-700'
      : 'text-gray-700 hover:bg-gray-50'
    }
    `
  );

  return (
    <>
      {/* --- HEADER PRINCIPAL (Siempre visible) --- */}
      <header className="bg-white shadow-sm sm:col-span-2 sticky top-0 z-40">
        <div className="px-4 py-3 md:px-6">
          <div className="flex items-center justify-between gap-3 md:gap-6">

            {/* 1. IZQUIERDA: Logo + Nav Desktop */}
            <div className="flex items-center gap-6 shrink-0">
              <span className="text-purple-600 shrink-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8H6z" />
                  <path d="M9 8V5a3 3 0 0 1 6 0v3" />
                </svg>
              </span>
              <nav className="hidden md:flex items-center gap-2">
                <NavLink to="/" className={getDesktopLinkStyles}>Productos</NavLink>
                <NavLink to="/cart" className={getDesktopLinkStyles}>Carrito</NavLink>
              </nav>
            </div>

            {/* 2. CENTRO: Barra de Búsqueda */}
            <div className='flex-1 max-w-2xl'>
              <div className="relative flex items-center w-full">
                <input
                  value={searchTerm || ''}
                  onChange={(evt) => setSearchTerm && setSearchTerm(evt.target.value)}
                  type="text"
                  placeholder='Buscar...'
                  className='
                    w-full bg-gray-100 text-gray-700 rounded-full py-2 pl-4 pr-10
                    text-sm md:text-base
                    focus:outline-none focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all
                  '
                />
                <button
                  className='absolute right-1 p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors'
                  onClick={handleSearch}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 3. DERECHA: Auth Desktop + Hamburguesa Móvil */}
            <div className="flex items-center shrink-0">
              <div className="hidden md:flex items-center gap-3">
                {isAuthenticated ? (
                  <Button className="font-medium px-5 py-2 rounded-lg" onClick={handleLogout}>Cerrar Sesión</Button>
                ) : (
                  <>
                    <Button className="bg-purple-200 text-gray-700 hover:bg-purple-300 font-medium px-4 py-2" onClick={handleLoginClick}>Iniciar Sesión</Button>
                    <Button className="bg-purple-200 text-gray-700 hover:bg-purple-300 font-medium px-4 py-2" onClick={handleRegisterClick}>Registrarse</Button>
                  </>
                )}
              </div>

              {/* Botón Hamburguesa */}
              <button
                className="md:hidden ml-2 text-gray-600 hover:bg-gray-100 p-2 rounded-md focus:outline-none"
                onClick={() => setIsMenuOpen(true)}
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- SIDEBAR MÓVIL (DRAWER) --- */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-50 shadow-2xl 
          transform transition-transform duration-300 ease-in-out md:hidden flex flex-col
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <span className="font-bold text-xl text-gray-800">Menú</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-500 hover:text-gray-800 p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            <NavLink to="/" className={getSidebarLinkStyles} onClick={() => setIsMenuOpen(false)}>
              Productos
            </NavLink>
            <NavLink to="/cart" className={getSidebarLinkStyles} onClick={() => setIsMenuOpen(false)}>
              Carrito de Compras
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 pb-6">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center items-center text-2xl px-5 py-2 rounded-xl bg-purple-100 text-gray-700 font-bold hover:bg-purple-200 transition text-center"
            >
              Cerrar sesión
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLoginClick}
                className="w-full text-center text-2xl px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={handleRegisterClick}
                className="w-full text-center text-2xl px-4 py-2 rounded-xl bg-purple-200 text-gray-700 font-bold hover:bg-purple-700"
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Header;