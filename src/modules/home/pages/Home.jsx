import Card from '../../shared/components/Card';
import { useEffect, useState } from 'react';
import { getProducts } from '../../products/services/list';

function Home() {
  const [total, setTotal ] = useState(0);
  const fetchProducts = async () => {
    try {
      const { data, error } = await getProducts('', 'all', 1, 10);

      if (error) throw error;

      setTotal(data.total);

    } catch (error) {
      console.error(error);
    };
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div
      className='flex flex-col gap-3 sm:grid sm:grid-cols-2'
    >
      <Card>
        <h3>Productos</h3>
        <p>{`Cantidad: ${total}`}</p>
      </Card>

      <Card>
        <h3>Ordenes</h3>
        <p>Cantidad: #</p>
      </Card>
    </div>
  );
};

export default Home;
