import  Card  from '../../shared/components/Card.jsx';
import Button from '../../shared/components/Button.jsx';
import { useState } from 'react';

function UserHomePage() {
  const [ searchTerm, setSearchTerm ] = useState('');
  const handleSearch = async () => {
    // Lógica de búsqueda aquí
  };

  return (
    <div
      className='
        flex
        flex-col
        p-4
        h-full
      '
    >
      <div className='
        flex
        flex-row
        items-center
        gap-3
        mb-4
        w-full'>

        <div>
          <span>logo</span>
        </div>

        <div className='flex gap-4 items-center'>
          <Button>Products</Button>
          <Button>Carrito de compras</Button>
        </div>

        <div
          className='flex items-center gap-4'
        >
          <input value={searchTerm} onChange={(evt) => setSearchTerm(evt.target.value)} type="text" placeholder='Buscar' className='text-[1.3rem] w-full' />
          <Button className='h-11 w-11' onClick={handleSearch}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
          </Button>
        </div>

        <div className='flex gap-4 items-center'>
          <Button>Iniciar Sesion</Button>
          <Button>Registrarse</Button>
        </div>

      </div>
      <div
        className='
        grid
        grid-cols-1
        grid-rows-[auto_1fr]
      '>
        <Card>Producto 1</Card>
      </div>
    </div>
  );
}
export default UserHomePage;