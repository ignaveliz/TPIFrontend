import Card from '../../shared/components/Card.jsx';
import Header from '../shared/components/Header.jsx';

function UserHomePage() {

  return (
    <div className='h-full grid grid-cols-1 grid-rows-[auto_1fr] sm:gap-3 sm:grid-cols-[256px_1fr]'>

      <Header />

      {/* CONTENIDO PRINCIPAL */}
      <div className='grid grid-cols-1 grid-rows-[auto_1fr] p-4'>
        <Card>Producto 1</Card>
      </div>
    </div>
  );
}

export default UserHomePage;