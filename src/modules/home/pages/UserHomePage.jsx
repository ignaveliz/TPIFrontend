import Card from '../../shared/components/Card.jsx';
import Button from '../../shared/components/Button.jsx';
import { useState } from 'react';

function UserHomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    // Lógica de búsqueda aquí
    console.log('Buscando:', searchTerm);
  };

  return (
    <div className='h-full grid grid-cols-1 grid-rows-[auto_1fr] sm:gap-3 sm:grid-cols-[256px_1fr]'>

      {/* HEADER */}
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
          {/* Aquí podrías poner tu <img src... /> o SVG del logo */}
          <span className="font-bold text-2xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
          </span>

          <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none font-medium px-4 py-2 rounded-lg text-sm">
            Productos
          </Button>

          <Button className="bg-transparent text-gray-600 hover:text-black border-none font-medium text-sm">
            Carrito de compras
          </Button>
        </div>

        {/* GRUPO CENTRO: Buscador */}
        {/* flex-1 hace que ocupe el espacio disponible, max-w limita el ancho */}
        <div className='flex-1 max-w-2xl px-4'>
          <div className="relative flex items-center w-full">
            <input
              value={searchTerm}
              onChange={(evt) => setSearchTerm(evt.target.value)}
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

        {/* GRUPO DERECHA: Botones de Auth */}
        <div className="flex items-center gap-3">
          <Button className="bg-purple-100 text-gray-700 hover:bg-purple-200 border-none font-medium px-5 py-2 rounded-lg transition-colors">
            Iniciar Sesión
          </Button>
          <Button className="bg-gray-200 text-gray-700 hover:bg-gray-300 border-none font-medium px-5 py-2 rounded-lg transition-colors">
            Registrarse
          </Button>
        </div>

      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className='grid grid-cols-1 grid-rows-[auto_1fr] p-4'>
        <Card>Producto 1</Card>
      </div>
    </div>
  );
}

export default UserHomePage;