import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import useAuth from '../../../auth/hook/useAuth';

function Header({ searchTerm, setSearchTerm, handleSearch }) {
  const navigate = useNavigate();
  const { isAuthenticated, singout } = useAuth();

  const handleLogout = () => {
    singout();
    navigate('/'); // CAMBIO: Ahora redirige al Home en lugar de al Login
  };

  const getLinkStyles = ({ isActive }) => (
    `
      block bg-gray-100 border-none px-4 py-2  font-medium rounded-4xl transition hover:bg-gray-200
      ${isActive
      ? 'bg-purple-200 hover:bg-purple-100 '
      : ''
    }
    `
  );

  return (
    <header className="
          flex
          items-center
          justify-between
          px-6 py-3
          shadow-sm
          bg-white
          sm:col-span-2
          gap-4
        ">

      {/* GRUPO IZQUIERDA: Logo + Links */}
      <div className="flex items-center gap-4">
        <span className="text-purple-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8H6z" />
            <path d="M9 8V5a3 3 0 0 1 6 0v3" />
          </svg>
        </span>

        <NavLink
          to="/"
          className={getLinkStyles}>
            Productos
        </NavLink>

        <NavLink
          to="/cart"
          className={getLinkStyles}>
            Carrito de Compras
        </NavLink>
      </div>

      {/* GRUPO CENTRO: Buscador */}
      <div className='flex-1 max-w-2xl px-4'>
        <div className="relative flex items-center w-full">
          <input
            value={searchTerm}
            onChange={(evt) => setSearchTerm && setSearchTerm(evt.target.value)}
            type="text"
            placeholder='Search'
            className='
                w-full
                bg-gray-50
                border border-gray-200
                text-gray-700
                rounded-full
                py-2.5 pl-5 pr-12
                focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300
                transition-all
              '
          />
          <button
            className='absolute right-2 p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors'
            onClick={handleSearch}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* GRUPO DERECHA: Botones de Auth CONDICIONALES */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          // CAMBIO: Estilo estándar (morado) igual que en Dashboard
          <Button
            className="font-medium px-5 py-2 rounded-lg"
            onClick={handleLogout}>
              Cerrar Sesión
          </Button>
        ) : (
          <>
            <Button
              className="bg-purple-100 text-gray-700 hover:bg-purple-200 border-none font-medium px-5 py-2 rounded-lg transition-colors"
              onClick={() => navigate('/login')}>
                Iniciar Sesión
            </Button>
            <Button
              className="bg-gray-100 text-gray-700 hover:bg-gray-300 border-none font-medium px-5 py-2 rounded-lg transition-colors"
              onClick={() => navigate('/signup')}>
                Registrarse
            </Button>
          </>
        )}
      </div>

    </header>
  );
}

export default Header;