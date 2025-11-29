import Card from '../../shared/components/Card.jsx';
import Header from '../shared/components/Header.jsx';
import ProductItem from '../shared/components/ProductItem.jsx';

function UserHomePage() {

  return (
    <div className='h-full grid grid-cols-1 grid-rows-[auto_1fr]'>

      <Header />

      {/* CONTENIDO PRINCIPAL */}
      <div className='grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card><ProductItem imageAspect="aspect-square" /></Card>
        <Card><ProductItem /></Card>
        <Card><ProductItem /></Card>
        <Card><ProductItem /></Card>

        <Card className='sm:col-span-2' ><ProductItem imageAspect="aspect-[2/1]" /></Card>
        <Card className='sm:col-span-2'><ProductItem imageAspect="aspect-[2/1]"/></Card>
      </div>
    </div>
  );
}

export default UserHomePage;